from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from models.ai_insight import AIInsight
from models.portfolio import Portfolio
from models.stock import Stock
from models.user import User
from schemas.ai_insight import AIInsightCreate, AIInsightUpdate


def create_ai_insight(
    db: Session,
    current_user: User,
    body: AIInsightCreate,
) -> AIInsight:
    if body.portfolio_id is not None:
        portfolio = db.query(Portfolio).filter(
            Portfolio.id == body.portfolio_id,
            Portfolio.user_id == current_user.id,
        ).first()

        if portfolio is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Portfolio not found",
            )

    if body.stock_id is not None:
        stock = db.query(Stock).filter(
            Stock.id == body.stock_id
        ).first()

        if stock is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Stock not found",
            )

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

    db.add(insight)
    db.commit()
    db.refresh(insight)

    return insight


def get_user_ai_insights(
    db: Session,
    current_user: User,
) -> list[AIInsight]:
    return db.query(AIInsight).filter(
        AIInsight.user_id == current_user.id
    ).order_by(
        AIInsight.created_at.desc()
    ).all()


def get_ai_insight_by_id(
    db: Session,
    current_user: User,
    insight_id: int,
) -> AIInsight:
    insight = db.query(AIInsight).filter(
        AIInsight.id == insight_id,
        AIInsight.user_id == current_user.id,
    ).first()

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
    insight = get_ai_insight_by_id(
        db=db,
        current_user=current_user,
        insight_id=insight_id,
    )

    update_data = body.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(insight, field, value)

    insight.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(insight)

    return insight


def delete_ai_insight(
    db: Session,
    current_user: User,
    insight_id: int,
) -> None:
    insight = get_ai_insight_by_id(
        db=db,
        current_user=current_user,
        insight_id=insight_id,
    )

    db.delete(insight)
    db.commit()