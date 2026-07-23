from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field

from enums.currency import Currency


class HoldingCreate(BaseModel):
    """
    Request used to add a stock holding to a portfolio.

    The user enters the purchase price in their chosen currency.
    The backend converts that price into the stock's native currency.
    """

    symbol: str = Field(
        ...,
        min_length=1,
        max_length=20,
    )

    shares: Decimal = Field(
        ...,
        gt=0,
    )

    average_buy_price: Decimal = Field(
        ...,
        gt=0,
    )

    # The currency in which average_buy_price was entered.
    purchase_currency: Currency = Currency.USD

    purchased_at: datetime | None = None


class HoldingUpdate(BaseModel):
    """
    Partial update for a holding.

    When the price or purchase currency changes, the backend must recalculate average_buy_price_native and exchange_rate_at_purchase.
    """

    shares: Decimal | None = Field(
        default=None,
        gt=0,
    )

    average_buy_price: Decimal | None = Field(
        default=None,
        gt=0,
    )

    purchase_currency: Currency | None = None
    purchased_at: datetime | None = None

class HoldingResponse(BaseModel):
    id: int
    portfolio_id: int
    stock_id: int

    symbol: str
    company_name: str

    # Currency in which the stock trades.
    native_currency: Currency

    shares: Decimal

    # Original purchase value entered by the user.
    average_buy_price: Decimal
    purchase_currency: Currency

    # Conversion saved by the backend.
    exchange_rate_at_purchase: Decimal
    average_buy_price_native: Decimal

    # Current market price in native_currency.
    latest_price: Decimal | None = None

    purchased_at: datetime | None = None
    created_at: datetime

    class Config:
        from_attributes = True
    id: int
    portfolio_id: int
    stock_id: int

    shares: Decimal

    # Original amount entered by the user.
    average_buy_price: Decimal
    purchase_currency: Currency

    # Converted values stored by the backend.
    exchange_rate_at_purchase: Decimal
    average_buy_price_native: Decimal

    purchased_at: datetime | None = None

    class Config:
        from_attributes = True