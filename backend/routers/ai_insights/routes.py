from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from models.user import User
from schemas.ai_insight import (
    AIInsightCreate,
    AIInsightResponse,
    AIInsightUpdate,
)
from services.ai_service import (
    create_ai_insight,
    delete_ai_insight,
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
def create_insight(
    body: AIInsightCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_ai_insight(
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
    return get_user_ai_insights(
        db=db,
        current_user=current_user,
    )


@router.get(
    "/{insight_id}",
    response_model=AIInsightResponse,
)
def get_insight(
    insight_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
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
    delete_ai_insight(
        db=db,
        current_user=current_user,
        insight_id=insight_id,
    )