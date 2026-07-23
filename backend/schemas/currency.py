from decimal import Decimal

from pydantic import BaseModel, Field

from enums.currency import Currency


class CurrencyConversionRequest(BaseModel):
    """
    Request body for a currency conversion.
    """

    amount: Decimal = Field(
        ...,
        gt=0,
    )

    from_currency: Currency
    to_currency: Currency


class CurrencyConversionResponse(BaseModel):
    """
    Response returned after converting a monetary amount.
    """

    original_amount: Decimal
    converted_amount: Decimal
    from_currency: Currency
    to_currency: Currency
    exchange_rate: Decimal