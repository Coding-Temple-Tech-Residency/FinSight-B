from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from services.market_data_service import get_or_update_stock, save_daily_history

from models.user import User
from models.stock import Stock
from models.market_data import MarketData

from schemas.stock import  StockResponse
from schemas.market_data import MarketDataResponse


router = APIRouter(
    prefix="/api/stocks",
    tags=["Stocks"]
)

print("Loading stock routes")

@router.get("/{symbol}", response_model=StockResponse)
def get_stock_by_symbol(
    symbol: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stock = get_or_update_stock(db, symbol)
    return stock


@router.get("/{symbol}/history", response_model=list[MarketDataResponse])
def get_stock_history(
    symbol: str,
    timeframe: str = "daily",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stock = get_or_update_stock(db, symbol)

    existing_history = db.query(MarketData).filter(
        MarketData.stock_id == stock.id,
        MarketData.timeframe == timeframe
    ).all()

    if existing_history:
        return existing_history

    return save_daily_history(
        db=db,
        stock=stock,
        symbol=symbol
    )
