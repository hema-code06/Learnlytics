from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from app.models import LearningEntry, MonthlyGoal


from app.analytics.engine import (
    calculate_daily_streak,
    calculate_consistency_score,
    study_time,
    topic_breakdown,
    weekly_learning_pattern,
    monthly_average_performance,
    detect_achievements,
    smart_insights
)

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/learning", tags=["Learning"])


# CREATE ENTRY
@router.post("/", response_model=schemas.LearningEntryResponse)
def create_entry(entry: schemas.LearningEntryCreate, db: Session = Depends(get_db)):

    new_entry = models.LearningEntry(**entry.model_dump())

    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)

    return new_entry


# GET ENTRY
@router.get("/", response_model=list[schemas.LearningEntryResponse])
def get_entries(db: Session = Depends(get_db)):

    return db.query(models.LearningEntry).order_by(
        models.LearningEntry.created_at.desc()
    ).all()


# MONTHLY GOAL


# SET
@router.post("/goal")
def set_monthly_goal(target_hours: float, db: Session = Depends(get_db)):

    current_month = datetime.utcnow().strftime("%Y-%m")

    goal = db.query(MonthlyGoal).filter(
        MonthlyGoal.month == current_month
    ).first()

    if goal:
        goal.target_hours = target_hours
    else:
        goal = MonthlyGoal(
            month=current_month,
            target_hours=target_hours
        )
        db.add(goal)

    db.commit()

    return {"message": "Goal saved"}


# GET
@router.get("/goal")
def get_monthly_goal(db: Session = Depends(get_db)):

    current_month = datetime.utcnow().strftime("%Y-%m")

    goal = db.query(MonthlyGoal).filter(
        MonthlyGoal.month == current_month
    ).first()

    if not goal:
        return {"target_hours": 0}

    return {"target_hours": goal.target_hours}


# ANALYTICS
@router.get("/analytics/dashboard")
def get_dashboard(db: Session = Depends(get_db)):

    entries = db.query(LearningEntry).order_by(
        LearningEntry.created_at.asc()
    ).all()

    if not entries:
        return {"data": {}}

    total_hours = sum(e.hours for e in entries)

    # analytics
    daily_streak = calculate_daily_streak(entries)
    consistency = calculate_consistency_score(entries)

    topic_data = topic_breakdown(entries)

    study_daily = study_time(entries, "daily")
    study_week = study_time(entries, "weekly")
    study_month = study_time(entries, "monthly")

    weekly_pattern = weekly_learning_pattern(entries)

    avg_performance = monthly_average_performance(entries)

    insights = smart_insights(entries)

    badges = detect_achievements(entries)

    return {
        "data": {
            "total_hours": total_hours,
            "daily_streak": daily_streak,
            "consistency_score": consistency,

            "study_time": {
                "daily": study_daily,
                "weekly": study_week,
                "monthly": study_month
            },

            "topic_breakdown": topic_data,

            "weekly_pattern": weekly_pattern,

            "average_performance": avg_performance,

            "insights": insights,

            "achievements": badges
        }
    }


# STUDY TIME
@router.get("/analytics/study-time")
def get_study_time(mode: str = "daily", db: Session = Depends(get_db)):

    entries = db.query(LearningEntry).all()

    return study_time(entries, mode)


# TOPIC BREAKDOWN
@router.get("/analytics/topics")
def get_topic_breakdown(db: Session = Depends(get_db)):

    entries = db.query(LearningEntry).all()

    return topic_breakdown(entries)


# WEEKLY PATTERN
@router.get("/analytics/pattern")
def get_weekly_pattern(db: Session = Depends(get_db)):

    entries = db.query(LearningEntry).all()

    return weekly_learning_pattern(entries)


# SMART INSIGHTS
@router.get("/analytics/insights")
def get_insights(db: Session = Depends(get_db)):

    entries = db.query(LearningEntry).all()

    return smart_insights(entries)


# ACHIEVEMENTS
@router.get("/analytics/achievements")
def get_achievements(db: Session = Depends(get_db)):

    entries = db.query(LearningEntry).all()

    return detect_achievements(entries)
