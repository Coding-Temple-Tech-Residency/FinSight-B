from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from dependencies import get_current_user
from models.user import User
from models.portfolio import Portfolio
from models.holdings import Holding
from models.stock import Stock
from schemas.holding import HoldingCreate, HoldingUpdate, HoldingResponse
from services.market_data_service import get_or_update_stock

# Group all holdings routes under /api/portfolios/{portfolio_id}/holdings
router = APIRouter(tags=["Holdings"])

# Helper function — verify portfolio belongs to current user
def get_portfolio_or_404(portfolio_id: int, user_id: int, db: Session):
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == portfolio_id,
        Portfolio.user_id == user_id
    ).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return portfolio

# Issue #84 — Get all holdings for a portfolio
@router.get("/api/portfolios/{portfolio_id}/holdings", response_model=list[HoldingResponse])
def get_holdings(
    portfolio_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify portfolio belongs to current user
    get_portfolio_or_404(portfolio_id, current_user.id, db)

    # Get all holdings for this portfolio
    holdings = db.query(Holding).filter(
        Holding.portfolio_id == portfolio_id
    ).all()

    # Build response with stock details
    result = []
    for holding in holdings:
        stock = db.query(Stock).filter(Stock.id == holding.stock_id).first()
        result.append(HoldingResponse(
            id=holding.id,
            portfolio_id=holding.portfolio_id,
            stock_id=holding.stock_id,
            symbol=stock.symbol,
            company_name=stock.company_name,
            shares=holding.shares,
            average_buy_price=holding.average_buy_price,
            latest_price=stock.latest_price,
            purchased_at=holding.purchased_at,
            created_at=holding.created_at
        ))
    return result

# Issue #85 — Add holding to portfolio
@router.post("/api/portfolios/{portfolio_id}/holdings", response_model=HoldingResponse, status_code=status.HTTP_201_CREATED)
def add_holding(
    portfolio_id: int,
    body: HoldingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify portfolio belongs to current user
    get_portfolio_or_404(portfolio_id, current_user.id, db)

    # Get or create stock from Alpha Vantage
    stock = get_or_update_stock(db, body.symbol)

    # Create holding
    holding = Holding(
        portfolio_id=portfolio_id,
        stock_id=stock.id,
        shares=body.shares,
        average_buy_price=body.average_buy_price,
        purchased_at=body.purchased_at
    )
    db.add(holding)
    db.commit()
    db.refresh(holding)

    return HoldingResponse(
        id=holding.id,
        portfolio_id=holding.portfolio_id,
        stock_id=holding.stock_id,
        symbol=stock.symbol,
        company_name=stock.company_name,
        shares=holding.shares,
        average_buy_price=holding.average_buy_price,
        latest_price=stock.latest_price,
        purchased_at=holding.purchased_at,
        created_at=holding.created_at
    )

# Issue #88 — Get holding by ID
@router.get("/api/portfolios/{portfolio_id}/holdings/{holding_id}", response_model=HoldingResponse)
def get_holding(
    portfolio_id: int,
    holding_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify portfolio belongs to current user
    get_portfolio_or_404(portfolio_id, current_user.id, db)

    # Get holding
    holding = db.query(Holding).filter(
        Holding.id == holding_id,
        Holding.portfolio_id == portfolio_id
    ).first()

    if not holding:
        raise HTTPException(status_code=404, detail="Holding not found")

    stock = db.query(Stock).filter(Stock.id == holding.stock_id).first()

    return HoldingResponse(
        id=holding.id,
        portfolio_id=holding.portfolio_id,
        stock_id=holding.stock_id,
        symbol=stock.symbol,
        company_name=stock.company_name,
        shares=holding.shares,
        average_buy_price=holding.average_buy_price,
        latest_price=stock.latest_price,
        purchased_at=holding.purchased_at,
        created_at=holding.created_at
    )

# Issue #86 — Update holding
@router.put("/api/portfolios/{portfolio_id}/holdings/{holding_id}", response_model=HoldingResponse)
def update_holding(
    portfolio_id: int,
    holding_id: int,
    body: HoldingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify portfolio belongs to current user
    get_portfolio_or_404(portfolio_id, current_user.id, db)

    # Get holding
    holding = db.query(Holding).filter(
        Holding.id == holding_id,
        Holding.portfolio_id == portfolio_id
    ).first()

    if not holding:
        raise HTTPException(status_code=404, detail="Holding not found")

    # Update only provided fields
    if body.shares is not None:
        holding.shares = body.shares
    if body.average_buy_price is not None:
        holding.average_buy_price = body.average_buy_price
    if body.purchased_at is not None:
        holding.purchased_at = body.purchased_at

    db.commit()
    db.refresh(holding)

    stock = db.query(Stock).filter(Stock.id == holding.stock_id).first()

    return HoldingResponse(
        id=holding.id,
        portfolio_id=holding.portfolio_id,
        stock_id=holding.stock_id,
        symbol=stock.symbol,
        company_name=stock.company_name,
        shares=holding.shares,
        average_buy_price=holding.average_buy_price,
        latest_price=stock.latest_price,
        purchased_at=holding.purchased_at,
        created_at=holding.created_at
    )

# Issue #87 — Delete holding
@router.delete("/api/portfolios/{portfolio_id}/holdings/{holding_id}", status_code=status.HTTP_200_OK)
def delete_holding(
    portfolio_id: int,
    holding_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify portfolio belongs to current user
    get_portfolio_or_404(portfolio_id, current_user.id, db)

    # Get holding
    holding = db.query(Holding).filter(
        Holding.id == holding_id,
        Holding.portfolio_id == portfolio_id
    ).first()

    if not holding:
        raise HTTPException(status_code=404, detail="Holding not found")

    db.delete(holding)
    db.commit()

    return {"message": "Holding deleted successfully"}