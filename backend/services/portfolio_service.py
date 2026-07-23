from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from models.portfolio import Portfolio
from models.user import User
from services.currency_service import convert_currency


def get_portfolio_summary(
    db: Session,
    current_user: User,
    portfolio_id: int,
    target_currency: str | None = None,
) -> dict:
    """
    Calculates the total value of a user-owned portfolio and optionally
    converts that value into another supported currency.

    Currency behavior:
    - The portfolio's stored currency is treated as the base currency.
    - If target_currency is omitted, the value is returned in the
      portfolio's base currency.
    - If target_currency differs from the base currency, one exchange-rate
      request is made and the total is converted once.

    Example:
        Portfolio base currency: EUR
        Requested target currency: GBP

        The service calculates the portfolio total in EUR and then
        converts the complete total from EUR to GBP.
    """

    # Retrieve the portfolio and ensure it belongs to the authenticated user.
    portfolio = (
        db.query(Portfolio)
        .filter(
            Portfolio.id == portfolio_id,
            Portfolio.user_id == current_user.id,
        )
        .first()
    )

    if portfolio is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found",
        )

    # The portfolio currency is the currency in which its stored prices
    # and calculated holding values are interpreted.
    base_currency = portfolio.currency.strip().upper()

    # When no target is provided, keep the result in the portfolio's
    # existing currency.
    requested_currency = (
        target_currency.strip().upper()
        if target_currency
        else base_currency
    )

    total_value_base = Decimal("0")

    for holding in portfolio.holdings:
        stock = holding.stock

        # Ignore incomplete relationships or stocks without a cached price.
        if stock is None or stock.latest_price is None:
            continue

        shares = Decimal(str(holding.shares))
        latest_price = Decimal(str(stock.latest_price))

        # This assumes the stored stock price is expressed in the
        # portfolio's base currency.
        total_value_base += shares * latest_price

    # Convert the entire total only once.
    converted_total, exchange_rate = convert_currency(
        amount=total_value_base,
        from_currency=base_currency,
        to_currency=requested_currency,
    )

    return {
        "portfolio_id": portfolio.id,
        "portfolio_name": portfolio.name,
        "base_currency": base_currency,
        "display_currency": requested_currency,
        "total_value_base": total_value_base.quantize(
            Decimal("0.01")
        ),
        "exchange_rate": exchange_rate,
        "converted_total": converted_total,
    }