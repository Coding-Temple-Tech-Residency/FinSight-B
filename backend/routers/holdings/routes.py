from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user

from models.holdings import Holding
from models.portfolio import Portfolio
from models.stock import Stock
from models.user import User

from schemas.holding import (
    HoldingCreate,
    HoldingResponse,
    HoldingUpdate,
)

from services.currency_service import convert_currency
from services.market_data_service import get_or_update_stock


# All holding routes use the full path directly in each decorator.
router = APIRouter(
    tags=["Holdings"],
)


def get_portfolio_or_404(
    portfolio_id: int,
    user_id: int,
    db: Session,
) -> Portfolio:
    """
    Retrieves a portfolio while verifying that it belongs to the
    authenticated user.

    This helper prevents users from reading or modifying holdings that
    belong to another user's portfolio.

    Args:
        portfolio_id:
            ID of the portfolio being accessed.

        user_id:
            ID of the authenticated user.

        db:
            Current SQLAlchemy database session.

    Returns:
        Portfolio:
            The portfolio when it exists and belongs to the user.

    Raises:
        HTTPException:
            Returns 404 when the portfolio does not exist or does not
            belong to the authenticated user.
    """

    portfolio = (
        db.query(Portfolio)
        .filter(
            Portfolio.id == portfolio_id,
            Portfolio.user_id == user_id,
        )
        .first()
    )

    if portfolio is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found",
        )

    return portfolio


def get_holding_or_404(
    portfolio_id: int,
    holding_id: int,
    db: Session,
) -> Holding:
    """
    Retrieves one holding belonging to the specified portfolio.

    The portfolio ownership check should be performed before calling
    this function.
    """

    holding = (
        db.query(Holding)
        .filter(
            Holding.id == holding_id,
            Holding.portfolio_id == portfolio_id,
        )
        .first()
    )

    if holding is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Holding not found",
        )

    return holding


def build_holding_response(
    holding: Holding,
    stock: Stock,
) -> HoldingResponse:
    """
    Converts a Holding and its related Stock into the response returned
    by the API.

    Keeping response construction in one helper prevents duplicated code
    across the GET, POST, and PUT routes.
    """

    return HoldingResponse(
        id=holding.id,
        portfolio_id=holding.portfolio_id,
        stock_id=holding.stock_id,

        # Stock information.
        symbol=stock.symbol,
        company_name=stock.company_name,
        native_currency=stock.currency,

        # Position information.
        shares=holding.shares,

        # Original purchase information entered by the user.
        average_buy_price=holding.average_buy_price,
        purchase_currency=holding.purchase_currency,

        # Conversion information calculated by the backend.
        exchange_rate_at_purchase=holding.exchange_rate_at_purchase,
        average_buy_price_native=holding.average_buy_price_native,

        # Latest market information in the stock's native currency.
        latest_price=stock.latest_price,

        purchased_at=holding.purchased_at,
        created_at=holding.created_at,
    )


def calculate_native_purchase_values(
    *,
    average_buy_price,
    purchase_currency: str,
    stock_currency: str,
):
    """
    Converts the user's entered average purchase price into the stock's
    native quote currency.

    Example:
        User enters:
            average_buy_price = 185 EUR

        Stock trades in:
            USD

        Result:
            average_buy_price_native = converted USD value
            exchange_rate_at_purchase = EUR-to-USD rate

    The conversion happens in the backend so the frontend cannot provide
    or manipulate the exchange rate.
    """

    converted_price, exchange_rate = convert_currency(
        amount=average_buy_price,
        from_currency=purchase_currency,
        to_currency=stock_currency,
    )

    return converted_price, exchange_rate


# Issue #84 — Get all holdings for a portfolio
@router.get(
    "/api/portfolios/{portfolio_id}/holdings",
    response_model=list[HoldingResponse],
)
def get_holdings(
    portfolio_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Returns all holdings belonging to one user-owned portfolio.
    """

    # Verify that the portfolio exists and belongs to the current user.
    get_portfolio_or_404(
        portfolio_id=portfolio_id,
        user_id=current_user.id,
        db=db,
    )

    # Load every holding for the portfolio.
    holdings = (
        db.query(Holding)
        .filter(Holding.portfolio_id == portfolio_id)
        .order_by(Holding.created_at.desc())
        .all()
    )

    result: list[HoldingResponse] = []

    for holding in holdings:
        # Use the SQLAlchemy relationship when available instead of
        # performing a separate explicit Stock query for every holding.
        stock = holding.stock

        if stock is None:
            # A foreign-key constraint should normally prevent this.
            # Skipping the malformed row prevents the entire endpoint
            # from crashing if inconsistent data exists.
            continue

        result.append(
            build_holding_response(
                holding=holding,
                stock=stock,
            )
        )

    return result


# Issue #85 — Add holding to portfolio
@router.post(
    "/api/portfolios/{portfolio_id}/holdings",
    response_model=HoldingResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_holding(
    portfolio_id: int,
    body: HoldingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Adds a stock holding to a user-owned portfolio.

    Workflow:
    1. Verify portfolio ownership.
    2. Retrieve or create the Stock record.
    3. Read the stock's native market currency.
    4. Convert the user-entered purchase price into that currency.
    5. Save both the original and converted purchase values.
    """

    portfolio = get_portfolio_or_404(
        portfolio_id=portfolio_id,
        user_id=current_user.id,
        db=db,
    )

    # Retrieve or create the shared Stock record.
    #
    # This function should populate:
    # - symbol
    # - company_name
    # - latest_price
    # - currency
    stock = get_or_update_stock(
        db=db,
        symbol=body.symbol,
    )

    if not stock.currency:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"The native currency for {stock.symbol} "
                "is not available"
            ),
        )

    purchase_currency = body.purchase_currency.value

    # Convert the entered price into the stock's native quote currency.
    average_buy_price_native, exchange_rate = (
        calculate_native_purchase_values(
            average_buy_price=body.average_buy_price,
            purchase_currency=purchase_currency,
            stock_currency=stock.currency,
        )
    )

    holding = Holding(
        portfolio_id=portfolio.id,
        stock_id=stock.id,
        shares=body.shares,

        # Preserve what the user entered.
        average_buy_price=body.average_buy_price,
        purchase_currency=purchase_currency,

        # Save the conversion used at the time the holding was created.
        exchange_rate_at_purchase=exchange_rate,
        average_buy_price_native=average_buy_price_native,

        purchased_at=body.purchased_at,
    )

    try:
        db.add(holding)
        db.commit()
        db.refresh(holding)

    except IntegrityError as error:
        db.rollback()

        # This may occur if the database has a composite unique
        # constraint on portfolio_id and stock_id.
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                f"{stock.symbol} already exists in this portfolio. "
                "Update the existing holding instead."
            ),
        ) from error

    except Exception:
        db.rollback()
        raise

    return build_holding_response(
        holding=holding,
        stock=stock,
    )


# Issue #88 — Get holding by ID
@router.get(
    "/api/portfolios/{portfolio_id}/holdings/{holding_id}",
    response_model=HoldingResponse,
)
def get_holding(
    portfolio_id: int,
    holding_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Returns one holding belonging to a user-owned portfolio.
    """

    get_portfolio_or_404(
        portfolio_id=portfolio_id,
        user_id=current_user.id,
        db=db,
    )

    holding = get_holding_or_404(
        portfolio_id=portfolio_id,
        holding_id=holding_id,
        db=db,
    )

    stock = holding.stock

    if stock is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stock associated with this holding was not found",
        )

    return build_holding_response(
        holding=holding,
        stock=stock,
    )


# Issue #86 — Update holding
@router.put(
    "/api/portfolios/{portfolio_id}/holdings/{holding_id}",
    response_model=HoldingResponse,
)
def update_holding(
    portfolio_id: int,
    holding_id: int,
    body: HoldingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Partially updates an existing holding.

    Currency conversion is recalculated whenever either:
    - average_buy_price changes; or
    - purchase_currency changes.

    Updating only the number of shares does not require another
    exchange-rate request.
    """

    get_portfolio_or_404(
        portfolio_id=portfolio_id,
        user_id=current_user.id,
        db=db,
    )

    holding = get_holding_or_404(
        portfolio_id=portfolio_id,
        holding_id=holding_id,
        db=db,
    )

    stock = holding.stock

    if stock is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stock associated with this holding was not found",
        )

    if not stock.currency:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"The native currency for {stock.symbol} "
                "is not available"
            ),
        )

    # Update the number of shares independently because changing shares
    # does not change the purchase currency conversion.
    if body.shares is not None:
        holding.shares = body.shares

    if body.purchased_at is not None:
        holding.purchased_at = body.purchased_at

    # Determine whether conversion-related fields need recalculation.
    price_changed = body.average_buy_price is not None
    currency_changed = body.purchase_currency is not None

    if price_changed or currency_changed:
        # Use the new value when provided; otherwise preserve the
        # existing holding value.
        average_buy_price = (
            body.average_buy_price
            if body.average_buy_price is not None
            else holding.average_buy_price
        )

        purchase_currency = (
            body.purchase_currency.value
            if body.purchase_currency is not None
            else holding.purchase_currency
        )

        average_buy_price_native, exchange_rate = (
            calculate_native_purchase_values(
                average_buy_price=average_buy_price,
                purchase_currency=purchase_currency,
                stock_currency=stock.currency,
            )
        )

        # Preserve the values entered by the user.
        holding.average_buy_price = average_buy_price
        holding.purchase_currency = purchase_currency

        # Replace the stored conversion values with the newly calculated
        # values.
        holding.exchange_rate_at_purchase = exchange_rate
        holding.average_buy_price_native = average_buy_price_native

    try:
        db.commit()
        db.refresh(holding)

    except Exception:
        db.rollback()
        raise

    return build_holding_response(
        holding=holding,
        stock=stock,
    )


# Issue #87 — Delete holding
@router.delete(
    "/api/portfolios/{portfolio_id}/holdings/{holding_id}",
    status_code=status.HTTP_200_OK,
)
def delete_holding(
    portfolio_id: int,
    holding_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Deletes one holding from a user-owned portfolio.
    """

    get_portfolio_or_404(
        portfolio_id=portfolio_id,
        user_id=current_user.id,
        db=db,
    )

    holding = get_holding_or_404(
        portfolio_id=portfolio_id,
        holding_id=holding_id,
        db=db,
    )

    try:
        db.delete(holding)
        db.commit()

    except Exception:
        db.rollback()
        raise

    return {
        "message": "Holding deleted successfully",
    }