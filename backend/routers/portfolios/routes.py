from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from services.portfolio_service import get_portfolio_summary
from database import get_db
from dependencies import get_current_user
from models.user import User
from models.portfolio import Portfolio
from schemas.portfolio import PortfolioCreate, PortfolioResponse, PortfolioUpdate


router = APIRouter(
    prefix="/api/portfolios",
    tags=["Portfolios"]
)

print("Loading portfolio routes")

@router.post("", response_model=PortfolioResponse, status_code=status.HTTP_201_CREATED)
def create_portfolio(
    body: PortfolioCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    portfolio = Portfolio(
        user_id=current_user.id,
        name=body.name,
        description=body.description,
        currency=body.currency.value
    )

    db.add(portfolio)
    db.commit()
    db.refresh(portfolio)

    return portfolio


@router.get("", response_model=list[PortfolioResponse])
def get_portfolios(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Portfolio).filter(
        Portfolio.user_id == current_user.id
    ).all()


@router.get("/{portfolio_id}", response_model=PortfolioResponse)
def get_portfolio(
    portfolio_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == portfolio_id,
        Portfolio.user_id == current_user.id
    ).first()

    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    return portfolio

@router.put("/{portfolio_id}", response_model=PortfolioResponse)
def update_portfolio(
    portfolio_id: int,
    body: PortfolioUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Updates a portfolio owned by the authenticated user.

    Currency is intentionally not editable because FinSight currently
    supports USD portfolios only.
    """

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

    # Update only fields that were actually included in the request.
    update_data = body.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(portfolio, field, value)


    try:
        db.commit()
        db.refresh(portfolio)
        return portfolio

    except Exception:
        db.rollback()
        raise

@router.delete("/{portfolio_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_portfolio(
    portfolio_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == portfolio_id,
        Portfolio.user_id == current_user.id
    ).first()

    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    db.delete(portfolio)
    db.commit()

    return {"message": "Portfolio deleted successfully"}

@router.get("/{portfolio_id}/summary")
def get_summary(
    portfolio_id: int,
    target_currency: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Returns a portfolio summary in its stored currency or in a requested target currency.

    Example:
        GET /api/portfolios/9/summary?target_currency=GBP
    """

    return get_portfolio_summary(
        db=db,
        current_user=current_user,
        portfolio_id=portfolio_id,
        target_currency=target_currency,
    )