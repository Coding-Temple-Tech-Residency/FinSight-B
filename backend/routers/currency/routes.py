from fastapi import APIRouter, Depends

from dependencies import get_current_user
from models.user import User
from schemas.currency import (
    CurrencyConversionRequest,
    CurrencyConversionResponse,
)
from services.currency_service import convert_currency


router = APIRouter(
    prefix="/api/currency",
    tags=["Currency"],
)


@router.post(
    "/convert",
    response_model=CurrencyConversionResponse,
)
def convert_amount(
    body: CurrencyConversionRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Converts a monetary amount between two supported currencies.
    """

    converted_amount, exchange_rate = convert_currency(
        amount=body.amount,
        from_currency=body.from_currency.value,
        to_currency=body.to_currency.value,
    )

    return CurrencyConversionResponse(
        original_amount=body.amount,
        converted_amount=converted_amount,
        from_currency=body.from_currency,
        to_currency=body.to_currency,
        exchange_rate=exchange_rate,
    )