from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from models.user import User
from models.stock import Stock
from models.market_data import MarketData
from schemas.stock import StockCreate, StockResponse
from schemas.market_data import MarketDataResponse


router = APIRouter(
    prefix="/api/stocks",
    tags=["Stocks"]
)


@router.get("/{symbol}", response_model=StockResponse)
def get_stock_by_symbol(
    symbol: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stock = db.query(Stock).filter(
        Stock.symbol == symbol.upper()
    ).first()

    if not stock:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stock not found"
        )

    return stock


@router.get("/{symbol}/history", response_model=list[MarketDataResponse])
def get_stock_history(
    symbol: str,
    timeframe: str = "daily",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stock = db.query(Stock).filter(
        Stock.symbol == symbol.upper()
    ).first()

    if not stock:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stock not found"
        )

    return db.query(MarketData).filter(
        MarketData.stock_id == stock.id,
        MarketData.timeframe == timeframe
    ).all()
