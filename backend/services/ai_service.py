from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from enums.insight_type import InsightType
from enums.sentiment import Sentiment

from models.ai_insight import AIInsight
from models.market_data import MarketData
from models.portfolio import Portfolio
from models.stock import Stock
from models.user import User

from schemas.ai_insight import (
    AIChatRequest,
    AIInsightCreate,
    AIInsightUpdate,
)

from services.openai_service import (
    generate_financial_insight,
    generate_general_chat_response,
)
from services.market_data_service import refresh_market_data
from services.openai_service import generate_financial_insight

def generate_general_ai_chat(
    db: Session,
    current_user: User,
    body: AIChatRequest,
) -> AIInsight:
    """
    Generates a portfolio-aware general chat response.

    Workflow:
    1. Validate the user message.
    2. Load all portfolios owned by the authenticated user.
    3. Refresh stock data for portfolio holdings.
    4. Build a compact portfolio context.
    5. Send the question and verified context to OpenAI.
    6. Save the generated response as a user-owned AI insight.
    """

    # Remove leading and trailing whitespace.
    clean_message = body.message.strip()

    if not clean_message:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty",
        )

    # Build trusted context from the logged-in user's portfolios.
    portfolio_context = build_user_portfolios_context(
        db=db,
        current_user=current_user,
    )

    # Generate a response that can use the user's real portfolio data.
    generated_response = generate_general_chat_response(
        message=clean_message,
        portfolio_context=portfolio_context,
    )

    # Store the response as a general insight.
    #
    # It can reference all user portfolios, so it is not attached to
    # one specific portfolio_id.
    insight = AIInsight(
        user_id=current_user.id,
        portfolio_id=None,
        stock_id=None,
        insight_type=InsightType.GENERAL,
        summary=generated_response,
        sentiment=Sentiment.NEUTRAL,
        source="openai",
        expires_at=None,
    )

    try:
        db.add(insight)
        db.commit()
        db.refresh(insight)

        return insight

    except Exception:
        db.rollback()
        raise


def create_ai_insight(
    db: Session,
    current_user: User,
    body: AIInsightCreate,
) -> AIInsight:
    """
    Creates and stores an AI insight using data provided in the request.

    This function is used for manually creating an insight record.
    The authenticated user's ID is assigned by the backend rather than
    accepted from the client, preventing users from creating insights
    for another account.
    """

    # If a portfolio ID was provided, verify that the portfolio exists
    # and belongs to the currently authenticated user.
    if body.portfolio_id is not None:
        portfolio = (
            db.query(Portfolio)
            .filter(
                Portfolio.id == body.portfolio_id,
                Portfolio.user_id == current_user.id,
            )
            .first()
        )

        if portfolio is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Portfolio not found",
            )

    # If a stock ID was provided, verify that the stock exists.
    # Stocks are shared reference data, so they are not owned by one user.
    if body.stock_id is not None:
        stock = (
            db.query(Stock)
            .filter(Stock.id == body.stock_id)
            .first()
        )

        if stock is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Stock not found",
            )

    # Create the database object using the authenticated user's ID.
    insight = AIInsight(
        user_id=current_user.id,
        portfolio_id=body.portfolio_id,
        stock_id=body.stock_id,
        insight_type=body.insight_type,
        summary=body.summary,
        sentiment=body.sentiment,
        source=body.source,
        expires_at=body.expires_at,
    )

    try:
        # Add the insight to the current database transaction.
        db.add(insight)

        # Persist the new row in the database.
        db.commit()

        # Reload database-generated values such as id and timestamps.
        db.refresh(insight)

        return insight

    except Exception:
        # Roll back the transaction so the SQLAlchemy session does not
        # remain in a failed state after a database error.
        db.rollback()
        raise


def get_user_ai_insights(
    db: Session,
    current_user: User,
) -> list[AIInsight]:
    """
    Returns all AI insights belonging to the authenticated user.

    Results are ordered with the newest insights first.
    """

    return (
        db.query(AIInsight)
        .filter(AIInsight.user_id == current_user.id)
        .order_by(AIInsight.created_at.desc())
        .all()
    )


def get_ai_insight_by_id(
    db: Session,
    current_user: User,
    insight_id: int,
) -> AIInsight:
    """
    Returns one AI insight by ID.

    The ownership filter ensures that an authenticated user cannot
    access another user's insight by guessing its numeric ID.
    """

    insight = (
        db.query(AIInsight)
        .filter(
            AIInsight.id == insight_id,
            AIInsight.user_id == current_user.id,
        )
        .first()
    )

    if insight is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="AI insight not found",
        )

    return insight


def update_ai_insight(
    db: Session,
    current_user: User,
    insight_id: int,
    body: AIInsightUpdate,
) -> AIInsight:
    """
    Updates an existing AI insight owned by the authenticated user.

    Only fields explicitly included in the request body are changed.
    """

    # Reuse the ownership-protected lookup function.
    insight = get_ai_insight_by_id(
        db=db,
        current_user=current_user,
        insight_id=insight_id,
    )

    # exclude_unset=True prevents omitted fields from being overwritten
    # with their schema defaults.
    update_data = body.model_dump(exclude_unset=True)

    # Apply each provided field dynamically.
    for field, value in update_data.items():
        setattr(insight, field, value)

    # Explicitly update the modification timestamp.
    insight.updated_at = datetime.now(timezone.utc)

    try:
        db.commit()
        db.refresh(insight)

        return insight

    except Exception:
        db.rollback()
        raise


def delete_ai_insight(
    db: Session,
    current_user: User,
    insight_id: int,
) -> None:
    """
    Deletes an AI insight owned by the authenticated user.
    """

    # This lookup also verifies that the insight belongs to the user.
    insight = get_ai_insight_by_id(
        db=db,
        current_user=current_user,
        insight_id=insight_id,
    )

    try:
        db.delete(insight)
        db.commit()

    except Exception:
        db.rollback()
        raise


def build_stock_market_context(
    stock: Stock,
    market_records: list[MarketData],
) -> str:
    """
    Converts structured stock and market data into a compact text block
    that can be sent to the AI provider.

    Only recent stored market records are included. This reduces token
    usage, keeps the prompt focused, and avoids sending unnecessary data.
    """

    if not market_records:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No market data is available for this stock",
        )

    # Sort newest to oldest in case the database result order changes.
    sorted_records = sorted(
        market_records,
        key=lambda record: record.price_timestamp,
        reverse=True,
    )

    # Use only the five most recent daily records.
    recent_records = sorted_records[:5]

    # Start the context with basic stock information.
    context_lines = [
        f"Symbol: {stock.symbol}",
        f"Company: {stock.company_name}",
        f"Latest stored price: {stock.latest_price}",
        "Recent daily market data:",
    ]

    # Add one readable line per daily market-data record.
    for record in recent_records:
        context_lines.append(
            (
                f"- Date: {record.price_timestamp.date()}, "
                f"Open: {record.open_price}, "
                f"High: {record.high_price}, "
                f"Low: {record.low_price}, "
                f"Close: {record.close_price}, "
                f"Volume: {record.volume}"
            )
        )

    return "\n".join(context_lines)


def generate_stock_ai_insight(
    db: Session,
    current_user: User,
    symbol: str,
) -> AIInsight:
    """
    Generates and stores an AI insight for a stock.

    Workflow:
    1. Normalize the requested symbol.
    2. Refresh the stock and its daily market data.
    3. Read the most recent market records from the database.
    4. Convert those records into a concise AI context.
    5. Ask the AI provider to generate a financial insight.
    6. Save the generated insight for the authenticated user.
    """

    # Normalize symbols so values such as " aapl " and "AAPL"
    # are treated consistently.
    clean_symbol = symbol.strip().upper()

    if not clean_symbol:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Stock symbol is required",
        )

    # Refreshing market data centralizes all Alpha Vantage work:
    # - fetch daily time-series data
    # - create or update the Stock row
    # - save new MarketData rows
    #
    # This avoids duplicating market-data logic inside the AI service.
    stock = refresh_market_data(
        db=db,
        symbol=clean_symbol,
    )

    # Retrieve the five newest daily records for prompt generation.
    market_records = (
        db.query(MarketData)
        .filter(
            MarketData.stock_id == stock.id,
            MarketData.timeframe == "daily",
        )
        .order_by(MarketData.price_timestamp.desc())
        .limit(5)
        .all()
    )

    # Convert database records into a small, readable prompt context.
    market_context = build_stock_market_context(
        stock=stock,
        market_records=market_records,
    )

    # Ask the AI provider to generate a concise financial explanation.
    generated_summary = generate_financial_insight(
        symbol=stock.symbol,
        market_context=market_context,
    )

    # Save the generated result as a user-owned stock insight.
    insight = AIInsight(
        user_id=current_user.id,
        portfolio_id=None,
        stock_id=stock.id,
        insight_type=InsightType.STOCK,
        summary=generated_summary,

        # This is a safe placeholder until sentiment is generated
        # separately by the AI or derived from another data source.
        sentiment=Sentiment.NEUTRAL,

        # Store the provider name so the origin of the insight is clear.
        source="openai",

        # Generated insights expire after 24 hours so stale commentary
        # can be replaced with an updated insight later.
        expires_at=datetime.now(timezone.utc) + timedelta(hours=24),
    )

    try:
        db.add(insight)
        db.commit()
        db.refresh(insight)

        return insight

    except Exception:
        db.rollback()
        raise

def build_portfolio_context(
    portfolio: Portfolio,
) -> str:
    """
    Converts a portfolio and its holdings into a compact text context
    that can be safely sent to the AI provider.

    The function does not accept financial data from the client.
    It builds the context from database records owned by the
    authenticated user.
    """

    if not portfolio.holdings:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The portfolio does not contain any holdings",
        )

    context_lines = [
        f"Portfolio name: {portfolio.name}",
        f"Portfolio currency: {portfolio.currency}",
        f"Portfolio description: {portfolio.description or 'None'}",
        "Holdings:",
    ]

    for holding in portfolio.holdings:
        context_lines.append(
            (
                f"- Symbol: {holding.symbol}, "
                f"Company: {holding.company_name}, "
                f"Shares: {holding.shares}, "
                f"Average buy price: {holding.average_buy_price}"
            )
        )

    return "\n".join(context_lines)

def build_user_portfolios_context(
    db: Session,
    current_user: User,
) -> str:
    """
    Builds a compact summary of every portfolio owned by the
    authenticated user.

    The generated context is based only on trusted database records.
    The frontend does not provide holdings, prices, or ownership data.

    This allows the AI chat to answer questions such as:
    - Which portfolio is most concentrated?
    - Am I diversified?
    - Which holdings have the largest unrealized gains or losses?
    - What risks should I review?

    The function intentionally avoids sending unnecessary personal
    information such as the user's password, email, or authentication
    details to the AI provider.
    """

    # Load only portfolios owned by the authenticated user.
    portfolios = (
        db.query(Portfolio)
        .filter(Portfolio.user_id == current_user.id)
        .order_by(Portfolio.created_at.asc())
        .all()
    )

    # The user may use the general chat before creating a portfolio.
    if not portfolios:
        return (
            "The authenticated user currently has no portfolios "
            "stored in FinSight."
        )

    context_lines = [
        f"Number of user portfolios: {len(portfolios)}",
        "User portfolio data:",
    ]

    for portfolio in portfolios:
        context_lines.extend(
            [
                "",
                f"Portfolio name: {portfolio.name}",
                f"Currency: {portfolio.currency}",
                (
                    "Description: "
                    f"{portfolio.description or 'No description provided'}"
                ),
                f"Number of holdings: {len(portfolio.holdings)}",
            ]
        )

        if not portfolio.holdings:
            context_lines.append(
                "- This portfolio currently contains no holdings."
            )
            continue

        portfolio_cost_basis = 0.0
        portfolio_current_value = 0.0

        context_lines.append("Holdings:")

        for holding in portfolio.holdings:
            """
            This example assumes Holding has a symbol field.

            If your Holding model instead contains stock_id and a
            relationship named stock, replace:

                holding.symbol

            with:

                holding.stock.symbol
            """

            symbol = holding.symbol.strip().upper()

            # Refresh and cache current market information.
            # This gives the AI more recent data than the original
            # purchase values stored on the holding.
            stock = refresh_market_data(
                db=db,
                symbol=symbol,
            )

            shares = float(holding.shares)
            average_buy_price = float(holding.average_buy_price)
            latest_price = float(stock.latest_price)

            cost_basis = shares * average_buy_price
            current_value = shares * latest_price
            unrealized_gain_loss = current_value - cost_basis

            portfolio_cost_basis += cost_basis
            portfolio_current_value += current_value

            context_lines.append(
                (
                    f"- Symbol: {stock.symbol}; "
                    f"Shares: {shares}; "
                    f"Average buy price: {average_buy_price:.2f}; "
                    f"Latest stored price: {latest_price:.2f}; "
                    f"Cost basis: {cost_basis:.2f}; "
                    f"Current value: {current_value:.2f}; "
                    f"Unrealized gain/loss: "
                    f"{unrealized_gain_loss:.2f}"
                )
            )

        total_gain_loss = (
            portfolio_current_value - portfolio_cost_basis
        )

        context_lines.extend(
            [
                (
                    "Portfolio total cost basis: "
                    f"{portfolio_cost_basis:.2f}"
                ),
                (
                    "Portfolio estimated current value: "
                    f"{portfolio_current_value:.2f}"
                ),
                (
                    "Portfolio estimated unrealized gain/loss: "
                    f"{total_gain_loss:.2f}"
                ),
            ]
        )

    return "\n".join(context_lines)

def generate_portfolio_ai_insight(
    db: Session,
    current_user: User,
    portfolio_id: int,
) -> AIInsight:
    """
    Generates and stores an AI summary for a user-owned portfolio.

    Workflow:
    1. Verify that the portfolio exists and belongs to the user.
    2. Load the portfolio's holdings.
    3. Refresh market data for each holding.
    4. Build a portfolio context using holdings and current prices.
    5. Send the context to OpenAI.
    6. Save the generated summary in ai_insights.
    """

    # Verify ownership so users cannot generate summaries for
    # another user's portfolio.
    portfolio = (
        db.query(Portfolio)
        .filter(
            Portfolio.id == portfolio_id,
            Portfolio.user_id == current_user.id,
        )
        .first()
    )

    if portfolio is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found",
        )

    if not portfolio.holdings:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The portfolio does not contain any holdings",
        )

    context_lines = [
        f"Portfolio name: {portfolio.name}",
        f"Currency: {portfolio.currency}",
        f"Number of holdings: {len(portfolio.holdings)}",
        "Portfolio holdings:",
    ]

    for holding in portfolio.holdings:
        # Refresh the stock price and daily history before generating
        # the summary, so the AI receives recent stored information.
        stock = refresh_market_data(
            db=db,
            symbol=holding.symbol,
        )

        shares = float(holding.shares)
        average_buy_price = float(holding.average_buy_price)
        latest_price = float(stock.latest_price)

        cost_basis = shares * average_buy_price
        current_value = shares * latest_price
        unrealized_gain_loss = current_value - cost_basis

        context_lines.append(
            (
                f"- {stock.symbol}: "
                f"{shares} shares, "
                f"average buy price {average_buy_price:.2f}, "
                f"latest price {latest_price:.2f}, "
                f"cost basis {cost_basis:.2f}, "
                f"current value {current_value:.2f}, "
                f"unrealized gain/loss {unrealized_gain_loss:.2f}"
            )
        )

    portfolio_context = "\n".join(context_lines)

    generated_summary = generate_financial_insight(
        portfolio_name=portfolio.name,
        market_context=portfolio_context,
    )

    insight = AIInsight(
        user_id=current_user.id,
        portfolio_id=portfolio.id,
        stock_id=None,
        insight_type=InsightType.PORTFOLIO,
        summary=generated_summary,
        sentiment=Sentiment.NEUTRAL,
        source="openai",
        expires_at=datetime.now(timezone.utc) + timedelta(hours=24),
    )

    try:
        db.add(insight)
        db.commit()
        db.refresh(insight)

        return insight

    except Exception:
        db.rollback()
        raise