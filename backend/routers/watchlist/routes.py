from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from dependencies import get_current_user
from models.user import User
from models.watchlist import Watchlist
from models.stock import Stock
from schemas.watchlist import WatchlistCreate, WatchlistUpdate, WatchlistResponse
from services.market_data_service import get_or_update_stock

# Group all watchlist routes under /api/watchlist
router = APIRouter(prefix="/api/watchlist", tags=["Watchlist"])

# Issue #80 — Get all watchlist items for current user
@router.get("", response_model=list[WatchlistResponse])
def get_watchlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get all watchlist items belonging to the logged in user
    items = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id
    ).all()

    # Build response with stock details
    result = []
    for item in items:
        stock = db.query(Stock).filter(Stock.id == item.stock_id).first()
        result.append(WatchlistResponse(
            id=item.id,
            user_id=item.user_id,
            stock_id=item.stock_id,
            symbol=stock.symbol,
            company_name=stock.company_name,
            alert_price=item.alert_price,
            latest_price=stock.latest_price,
            created_at=item.created_at,
            updated_at=item.updated_at
        ))
    return result

# Issue #81 — Add stock to watchlist
@router.post("", response_model=WatchlistResponse, status_code=status.HTTP_201_CREATED)
def add_to_watchlist(
    body: WatchlistCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get or create stock from Alpha Vantage
    stock = get_or_update_stock(db, body.symbol)

    # Check if stock already in user's watchlist
    existing = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id,
        Watchlist.stock_id == stock.id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Stock already in watchlist"
        )

    # Create watchlist item
    item = Watchlist(
        user_id=current_user.id,
        stock_id=stock.id,
        alert_price=body.alert_price
    )
    db.add(item)
    db.commit()
    db.refresh(item)

    return WatchlistResponse(
        id=item.id,
        user_id=item.user_id,
        stock_id=item.stock_id,
        symbol=stock.symbol,
        company_name=stock.company_name,
        alert_price=item.alert_price,
        latest_price=stock.latest_price,
        created_at=item.created_at,
        updated_at=item.updated_at
    )

# Issue #82 — Get watchlist item by symbol
@router.get("/{symbol}", response_model=WatchlistResponse)
def get_watchlist_item(
    symbol: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Find stock by symbol
    stock = db.query(Stock).filter(
        Stock.symbol == symbol.upper()
    ).first()

    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")

    # Find watchlist item
    item = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id,
        Watchlist.stock_id == stock.id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Stock not found in watchlist"
        )

    return WatchlistResponse(
        id=item.id,
        user_id=item.user_id,
        stock_id=item.stock_id,
        symbol=stock.symbol,
        company_name=stock.company_name,
        alert_price=item.alert_price,
        latest_price=stock.latest_price,
        created_at=item.created_at,
        updated_at=item.updated_at
    )

# Issue #83 — Remove stock from watchlist
@router.delete("/{symbol}", status_code=status.HTTP_200_OK)
def remove_from_watchlist(
    symbol: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Find stock by symbol
    stock = db.query(Stock).filter(
        Stock.symbol == symbol.upper()
    ).first()

    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")

    # Find watchlist item
    item = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id,
        Watchlist.stock_id == stock.id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Stock not found in watchlist"
        )

    db.delete(item)
    db.commit()

    return {"message": f"{symbol.upper()} removed from watchlist successfully"}