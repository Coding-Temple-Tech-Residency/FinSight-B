import os
from typing import Any

import requests
from fastapi import HTTPException, status


# Finnhub REST API base URL.
FINNHUB_BASE_URL = "https://finnhub.io/api/v1"

# API key loaded from the Docker/container environment.
FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY")


def _finnhub_get(
    endpoint: str,
    params: dict[str, Any] | None = None,
) -> dict:
    """
    Sends one authenticated GET request to Finnhub.

    All Finnhub requests pass through this helper so the application has
    consistent behavior for:

    - authentication;
    - network timeouts;
    - provider rate limits;
    - invalid request responses;
    - unexpected provider errors;
    - invalid JSON responses.

    Args:
        endpoint:
            Finnhub endpoint path.

            Examples:
                "/search"
                "/stock/profile2"
                "/quote"

        params:
            Optional URL query parameters.

            The API token is sent through the X-Finnhub-Token header and
            therefore should not be added to this dictionary.

    Returns:
        dict:
            Parsed Finnhub JSON response.

    Raises:
        HTTPException:
            500 when the API key is missing.
            404 when the requested provider resource does not exist.
            429 when the Finnhub request limit has been reached.
            502 when Finnhub returns an unexpected response.
            504 when Finnhub takes too long to respond.
    """

    if not FINNHUB_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Finnhub API key is not configured",
        )

    # Copy the input dictionary so this helper never mutates the original
    # object supplied by the caller.
    request_params = dict(params or {})

    try:
        response = requests.get(
            f"{FINNHUB_BASE_URL}{endpoint}",
            params=request_params,
            headers={
                "X-Finnhub-Token": FINNHUB_API_KEY,
            },
            timeout=20,
        )

    except requests.Timeout as error:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="Finnhub took too long to respond",
        ) from error

    except requests.RequestException as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to contact Finnhub",
        ) from error

    # Finnhub uses HTTP 429 when the current account has exceeded its
    # permitted request rate.
    if response.status_code == status.HTTP_429_TOO_MANY_REQUESTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=(
                "Finnhub data is temporarily unavailable because "
                "the provider request limit was reached."
            ),
        )

    # A search result may refer to an instrument for which the current
    # Finnhub plan does not expose a profile or quote.
    if response.status_code in (
        status.HTTP_400_BAD_REQUEST,
        status.HTTP_404_NOT_FOUND,
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The requested Finnhub resource was not found",
        )

    try:
        response.raise_for_status()

    except requests.HTTPError as error:
        # This logging is useful while debugging unsupported international
        # listings and entitlement errors.
        #
        # The API key is not printed because it is sent through the request
        # header rather than through request_params.
        print(
            "FINNHUB HTTP ERROR:",
            {
                "status_code": response.status_code,
                "endpoint": endpoint,
                "params": request_params,
                "response": response.text[:500],
            },
        )

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=(
                f"Finnhub returned HTTP "
                f"{response.status_code} for {endpoint}"
            ),
        ) from error

    try:
        data = response.json()

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Finnhub returned an invalid JSON response",
        ) from error

    # Finnhub may return an error inside a successful HTTP response.
    if isinstance(data, dict) and data.get("error"):
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(data["error"]),
        )

    return data

def search_finnhub_symbols(
    keywords: str,
) -> list[dict]:
    """
    Searches Finnhub by partial ticker, company name, ISIN, or CUSIP.

    Examples:
        "app" -> Apple-related matches
        "microsoft" -> Microsoft-related matches
        "US5949181045" -> matching security

    The response is normalized so the rest of FinSight does not depend
    directly on Finnhub's raw property names.
    """

    clean_keywords = keywords.strip()

    if len(clean_keywords) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Enter at least two characters",
        )

    data = _finnhub_get(
        endpoint="/search",
        params={
            "q": clean_keywords,
        },
    )

    raw_results = data.get("result", [])

    normalized_results: list[dict] = []
    processed_symbols: set[str] = set()

    for item in raw_results:
        symbol = str(
            item.get("symbol", "")
        ).strip().upper()

        if not symbol:
            continue

        # Avoid duplicate results for the exact same complete Finnhub
        # symbol within one response.
        if symbol in processed_symbols:
            continue

        processed_symbols.add(symbol)

        normalized_results.append(
            {
                # Complete Finnhub symbol. This may include exchange
                # suffixes and should be used as the unique identifier.
                "symbol": symbol,

                # Cleaner symbol intended for display in the frontend.
                "display_symbol": (
                    str(
                        item.get("displaySymbol", "")
                    ).strip().upper()
                    or symbol
                ),

                # Finnhub search description, usually the company or
                # instrument name.
                "name": str(
                    item.get("description", "")
                ).strip(),

                # Examples may include:
                # - Common Stock
                # - ETF
                # - ADR
                # - Index
                "asset_type": item.get("type"),
            }
        )

    return normalized_results


def fetch_finnhub_company_profile(
    symbol: str,
) -> dict:
    """
    Retrieves Finnhub Company Profile 2 for one symbol.

    Finnhub-to-Stock mapping:

        name
            -> Stock.company_name

        exchange
            -> Stock.exchange

        currency
            -> Stock.currency

        finnhubIndustry
            -> Stock.industry

        logo
            -> Stock.company_logo_url

    Additional fields are returned by Finnhub but are not currently
    represented by the Stock model:
    - country
    - weburl
    - ipo
    - marketCapitalization
    - shareOutstanding
    - phone

    Finnhub Profile 2 does not provide a separate sector field, so
    Stock.sector should remain unchanged or null.
    """

    clean_symbol = symbol.strip().upper()

    if not clean_symbol:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Stock symbol cannot be empty",
        )

    data = _finnhub_get(
        endpoint="/stock/profile2",
        params={
            "symbol": clean_symbol,
        },
    )

    # Finnhub commonly returns an empty object when no profile exists.
    if not data or not data.get("ticker"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company profile not found",
        )

    return data


def fetch_finnhub_quote(
    symbol: str,
) -> dict:
    """
    Retrieves the latest Finnhub quote for one symbol.

    Finnhub quote fields:

        c
            Current price.

        d
            Absolute price change from the previous close.

        dp
            Percentage price change from the previous close.

        h
            Current trading day's high price.

        l
            Current trading day's low price.

        o
            Current trading day's opening price.

        pc
            Previous closing price.

        t
            Provider Unix timestamp.

    The Stock model currently stores only:
    - latest_price, from Finnhub's `c`;
    - last_refreshed_at, derived from Finnhub's `t`.

    The remaining quote properties can later be exposed through a quote
    schema or persisted in another table if needed.

    Finnhub may return all zero values when no usable quote is available,
    especially for unsupported, inactive, or restricted instruments.
    """

    clean_symbol = symbol.strip().upper()

    if not clean_symbol:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Stock symbol cannot be empty",
        )

    data = _finnhub_get(
        endpoint="/quote",
        params={
            "symbol": clean_symbol,
        },
    )

    current_price = data.get("c")

    try:
        valid_price = (
            current_price is not None
            and float(current_price) > 0
        )

    except (TypeError, ValueError):
        valid_price = False

    if not valid_price:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                f"A current Finnhub quote is not available "
                f"for {clean_symbol}"
            ),
        )

    return data