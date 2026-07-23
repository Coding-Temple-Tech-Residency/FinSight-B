from pydantic import BaseModel, Field


class TrendingStock(BaseModel):
    """
    Represents one stock returned by Alpha Vantage's trending endpoint.

    Numeric values are left as strings because Alpha Vantage returns
    formatted values such as:

        price: "325.8900"
        change_amount: "12.4500"
        change_percentage: "3.97%"
        volume: "89273421"

    The frontend may convert these values into numbers when necessary.
    """

    ticker: str
    price: str
    change_amount: str
    change_percentage: str
    volume: str


class TrendingStocksResponse(BaseModel):
    """
    Complete trending-market response returned to the frontend.

    The backend groups the results into:
    - top gainers;
    - top losers;
    - most actively traded stocks.
    """

    last_updated: str | None = None
    metadata: str | None = None

    top_gainers: list[TrendingStock] = Field(default_factory=list)
    top_losers: list[TrendingStock] = Field(default_factory=list)
    most_actively_traded: list[TrendingStock] = Field(
        default_factory=list
    )