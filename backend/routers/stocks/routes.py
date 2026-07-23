from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user

from services.market_data_service import fetch_trending_stocks, search_stock_symbols
from services.market_data_service import fetch_daily_history, get_or_update_stock, save_daily_history

from models.user import User
from models.stock import Stock
from models.market_data import MarketData

from schemas.stock import  StockResponse
from schemas.market_data import MarketDataResponse
from schemas.trending import TrendingStocksResponse
from schemas.stock_search import StockSearchResult


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
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Returns the latest stored trending-market snapshot.

    Alpha Vantage is contacted only when no database snapshot exists.
    """

    return fetch_trending_stocks(
        db=db,
    )

@router.post(
    "/trending/refresh",
    response_model=TrendingStocksResponse,
)
def refresh_trending_stocks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Forces a new provider request and stores a new snapshot.

    This endpoint should eventually be protected as an admin-only action
    because it consumes an external provider request.
    """

    return fetch_trending_stocks(
        db=db,
        force_refresh=True,
    )

@router.get(
    "/search",
    response_model=list[StockSearchResult],
)
def search_stocks(
    query: str,
    current_user: User = Depends(get_current_user),
):
    """
    Searches by partial ticker or company name.

    Example:
        GET /api/stocks/search?query=app
    """

    return search_stock_symbols(query)

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

