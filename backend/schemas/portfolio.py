from datetime import datetime
from pydantic import BaseModel, Field
from enums.currency import Currency


class PortfolioCreate(BaseModel):
    """
    Request body used to create a portfolio.

    USD remains the default, but users may select another supported
    display currency when creating the portfolio.
    """

    name: str = Field(
        ...,
        min_length=1,
        max_length=255,
    )

    description: str | None = None

    currency: Currency = Currency.USD


class PortfolioUpdate(BaseModel):
    """
    Request body used to partially update a portfolio.

    Every field is optional because omitted values should remain
    unchanged in the database.
    """

    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )

    description: str | None = None

    currency: Currency | None = None


class PortfolioResponse(BaseModel):
    """
    Standard portfolio response returned by the API.
    """

    id: int
    user_id: int
    name: str
    description: str | None = None
    currency: Currency
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True