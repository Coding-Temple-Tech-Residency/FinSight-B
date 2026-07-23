from decimal import Decimal, InvalidOperation

import requests
from fastapi import HTTPException, params, status


FRANKFURTER_BASE_URL = "https://api.frankfurter.dev/v2"


def get_exchange_rate(
    from_currency: str,
    to_currency: str,
) -> Decimal:
    source = from_currency.strip().upper()
    destination = to_currency.strip().upper()

    if source == destination:
        return Decimal("1")

    url = (
        f"{FRANKFURTER_BASE_URL}/rate/"
        f"{source}/{destination}"
    )

    try:
        response = requests.get(
            url,
            timeout=10,
        )

        if response.status_code in (400, 404, 422):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=(
                    f"Conversion from {source} to {destination} "
                    "is not supported by the currency provider."
                ),
            )

        response.raise_for_status()
        data = response.json()

    except HTTPException:
        raise

    except requests.Timeout as error:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="The currency service took too long to respond.",
        ) from error

    except requests.RequestException as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to retrieve the current exchange rate.",
        ) from error

    rate = data.get("rate")

    if rate is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=(
                f"No exchange rate is available from "
                f"{source} to {destination}."
            ),
        )

    return Decimal(str(rate))


def convert_currency(
    amount: Decimal,
    from_currency: str,
    to_currency: str,
) -> tuple[Decimal, Decimal]:
    """
    Converts an amount between two currencies and returns both the
    converted amount and the exchange rate used.

    Returning both values prevents callers from making a second request
    to the currency provider just to retrieve the same exchange rate.

    Returns:
        tuple[Decimal, Decimal]:
            The first value is the converted monetary amount.
            The second value is the exchange rate used.

    Example:
        converted_amount, rate = convert_currency(
            amount=Decimal("100"),
            from_currency="USD",
            to_currency="EUR",
        )
    """

    # Retrieve the exchange rate only once.
    rate = get_exchange_rate(
        from_currency=from_currency,
        to_currency=to_currency,
    )

    # Multiply the original value by the retrieved rate and round the
    # result to two decimal places for monetary display.
    converted_amount = (
        amount * rate
    ).quantize(Decimal("0.01"))

    return converted_amount, rate