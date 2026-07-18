from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from models.user import User
from schemas.market_data import MarketDataResponse
from services.market_data_service import get_stock_market_history


router = APIRouter(
    prefix="/api/market-data",
    tags=["Market Data"],
)


@router.get(
    "/{symbol}",
    response_model=list[MarketDataResponse],
)
def get_market_history(
    symbol: str,
    timeframe: str = "daily",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_stock_market_history(
        db=db,
        symbol=symbol,
        timeframe=timeframe,
    )