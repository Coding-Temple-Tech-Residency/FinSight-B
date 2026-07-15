from enum import Enum


class InsightType(str, Enum):
    MARKET = "market"
    STOCK = "stock"
    PORTFOLIO = "portfolio"
    WATCHLIST = "watchlist"
    NEWS = "news"
    EARNINGS = "earnings"