from pydantic import BaseModel


class StockSearchResult(BaseModel):
    """
    One matching asset returned by the stock-search endpoint.
    """

    symbol: str
    name: str
    asset_type: str | None = None
    region: str | None = None
    market_open: str | None = None
    market_close: str | None = None
    timezone: str | None = None
    currency: str | None = None
    match_score: float | None = None