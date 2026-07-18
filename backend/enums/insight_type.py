from enum import Enum


class InsightType(str, Enum):
    """
    Defines the supported categories of AI insights.

    Using an Enum prevents inconsistent values such as:
    - "general"
    - "General"
    - "GENERAL_CHAT"
    - "chat"

    The API and database will always use one standardized value.
    """

    # A general user question that is not tied to a specific
    # portfolio or stock.
    GENERAL = "general"

    # General market analysis that is not tied to one user portfolio.
    MARKET = "market"

    # Analysis of one specific stock.
    STOCK = "stock"

    # Analysis of one user-owned portfolio.
    PORTFOLIO = "portfolio"

    # Analysis involving stocks saved to a user's watchlist.
    WATCHLIST = "watchlist"

    # Summary or interpretation of financial news.
    NEWS = "news"

    # Analysis of company earnings and estimates.
    EARNINGS = "earnings"