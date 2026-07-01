from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from models.user import User
from models.portfolio import Portfolio
from schemas.portfolio import PortfolioCreate, PortfolioResponse


router = APIRouter(
    prefix="/api/portfolios",
    tags=["Portfolios"]
)


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
        currency=body.currency
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