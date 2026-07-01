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