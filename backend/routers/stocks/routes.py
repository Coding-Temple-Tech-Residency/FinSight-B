from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user

from services.market_data_service import fetch_trending_stocks
from services.market_data_service import fetch_daily_history, get_or_update_stock, save_daily_history

from models.user import User
from models.stock import Stock
from models.market_data import MarketData

from schemas.stock import  StockResponse
from schemas.market_data import MarketDataResponse
from schemas.trending import TrendingStocksResponse


router = APIRouter(
    prefix="/api/stocks",
    tags=["Stocks"]
)

print("Loading stock routes")

@router.get(
    "/trending",
    response_model=TrendingStocksResponse,
)
def get_trending_stocks(
    current_user: User = Depends(get_current_user),
):
    """
    Returns top gainers, top losers, and most actively traded stocks.

    The response is cached by the service layer to avoid consuming one
    Alpha Vantage request every time the frontend loads or rerenders.
    """

    return fetch_trending_stocks()

@router.get("/{symbol}", response_model=StockResponse)
def get_stock_by_symbol(
    symbol: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_or_update_stock(db, symbol)



@router.get("/{symbol}/history", response_model=list[MarketDataResponse])
def get_stock_history(
    symbol: str,
    timeframe: str = "daily",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    symbol = symbol.strip().upper()

    existing_stock = db.query(Stock).filter(
        Stock.symbol == symbol
    ).first()

    if existing_stock:
        existing_history = db.query(MarketData).filter(
            MarketData.stock_id == existing_stock.id,
            MarketData.timeframe == timeframe,
        ).all()

        if existing_history:
            return existing_history

    time_series = fetch_daily_history(symbol)
    stock = get_or_update_stock(db, symbol, time_series)

    return save_daily_history(
        db=db,
        stock=stock,
        time_series=time_series,
    )

