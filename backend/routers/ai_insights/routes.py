from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from models.user import User
from schemas.ai_insight import (
    AIChatRequest,
    AIInsightResponse,
    AIInsightUpdate,
)
from services.ai_service import (
    delete_ai_insight,
    generate_general_ai_chat,
    generate_portfolio_ai_insight,
    generate_stock_ai_insight,
    get_ai_insight_by_id,
    get_user_ai_insights,
    update_ai_insight,
)


router = APIRouter(
    prefix="/api/ai-insights",
    tags=["AI Insights"],
)


@router.post(
    "",
    response_model=AIInsightResponse,
    status_code=status.HTTP_201_CREATED,
)
def general_chat(
    body: AIChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Sends a general financial question to the AI assistant.

    This endpoint:
    - requires authentication;
    - generates an OpenAI response;
    - stores the response under the authenticated user;
    - does not associate the response with a portfolio or stock.
    """

    return generate_general_ai_chat(
        db=db,
        current_user=current_user,
        body=body,
    )


@router.get(
    "",
    response_model=list[AIInsightResponse],
)
def get_insights(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Returns all AI insights owned by the authenticated user.
    """

    return get_user_ai_insights(
        db=db,
        current_user=current_user,
    )


@router.post(
    "/generate/portfolio/{portfolio_id}",
    response_model=AIInsightResponse,
    status_code=status.HTTP_201_CREATED,
)
def generate_portfolio_insight(
    portfolio_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Generates a summary for one user-owned portfolio.

    No request body is required because portfolio information is loaded
    securely from the database using portfolio_id and current_user.id.
    """

    return generate_portfolio_ai_insight(
        db=db,
        current_user=current_user,
        portfolio_id=portfolio_id,
    )


@router.post(
    "/generate/stock/{symbol}",
    response_model=AIInsightResponse,
    status_code=status.HTTP_201_CREATED,
)
def generate_stock_insight(
    symbol: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Generates an insight for one stock symbol.

    Market data is loaded by the backend and is not accepted directly
    from the frontend.
    """

    return generate_stock_ai_insight(
        db=db,
        current_user=current_user,
        symbol=symbol,
    )


# Static routes such as /generate/portfolio/... and /generate/stock/...
# are intentionally declared before /{insight_id}. This avoids route
# ambiguity where FastAPI might otherwise attempt to treat "generate"
# as an insight ID.


@router.get(
    "/{insight_id}",
    response_model=AIInsightResponse,
)
def get_insight(
    insight_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Returns one insight only when it belongs to the current user.
    """

    return get_ai_insight_by_id(
        db=db,
        current_user=current_user,
        insight_id=insight_id,
    )


@router.put(
    "/{insight_id}",
    response_model=AIInsightResponse,
)
def update_insight(
    insight_id: int,
    body: AIInsightUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Updates a user-owned AI insight.
    """

    return update_ai_insight(
        db=db,
        current_user=current_user,
        insight_id=insight_id,
        body=body,
    )


@router.delete(
    "/{insight_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_insight(
    insight_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Deletes a user-owned AI insight.

    A successful deletion returns HTTP 204 with no response body.
    """

    delete_ai_insight(
        db=db,
        current_user=current_user,
        insight_id=insight_id,
    )