from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import timedelta, datetime
from uuid import UUID

from .. import models, schemas
from ..database import get_db
from ..auth import get_current_user

router = APIRouter()


@router.post("/", response_model=schemas.LearningEntryResponse)
def create_entry(
    entry: schemas.LearningEntryCreate,
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user)
):
    new_entry = models.LearningEntry(
        user_id=user_id,
        **entry.model_dump()
    )

    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)

    return new_entry


@router.get("/", response_model=list[schemas.LearningEntryResponse])
def get_entries(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):

    results = db.query(models.LearningEntry).filter(
        models.LearningEntry.user_id == user_id
    ).order_by(models.LearningEntry.date.desc()).all()

    return results


@router.put("/{entry_id}", response_model=schemas.LearningEntryResponse)
def update_entry(
    entry_id: UUID,
    updated_data: schemas.LearningEntryUpdate,
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user)
):
    entry = db.query(models.LearningEntry).filter(
        models.LearningEntry.id == entry_id,
        models.LearningEntry.user_id == user_id
    ).first()

    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found!")

    for key, value in updated_data.model_dump(exclude_unset=True).items():
        setattr(entry, key, value)

    db.commit()
    db.refresh(entry)

    return entry


@router.delete("/{entry_id}")
def delete_entry(
    entry_id: UUID,
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user)
):
    entry = db.query(models.LearningEntry).filter(
        models.LearningEntry.id == entry_id,
        models.LearningEntry.user_id == user_id
    ).first()

    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found!")

    db.delete(entry)
    db.commit()

    return {"message": "Entry deleted successfully"}


@router.get("/heatmap")
def get_heatmap(
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user)
):
    results = db.query(
        models.LearningEntry.date,
        func.sum(models.LearningEntry.hours).label("total_hours")
    ).filter(
        models.LearningEntry.user_id == user_id
    ).group_by(
        models.LearningEntry.date
    ).all()

    if not results:
        return []

    data_dict = {r.date: r.total_hours for r in results}
    start = min(data_dict.keys())
    end = max(data_dict.keys())

    filled = []
    current = start

    while current <= end:
        filled.append({
            "date": current,
            "total_hours": data_dict.get(current, 0)
        })
        current += timedelta(days=1)

    return filled


@router.get("/analytics/streak")
def get_weekly_streak(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    results = db.query(
        extract("year", models.LearningEntry.date).label("year"),
        extract("week", models.LearningEntry.date).label("week")
    ).filter(
        models.LearningEntry.user_id == user_id
    ).group_by("year", "week").order_by("year", "week").all()

    if not results:
        return {"weekly_streak": 0}
    weeks = [(int(r.year), int(r.week)) for r in results]

    streak = 1
    max_streak = 1

    for i in range(1, len(weeks)):
        prev = weeks[i-1]
        curr = weeks[i]

        if (curr[0] == prev[0] and curr[1] == prev[1] + 1):
            streak += 1
        else:
            streak = 1

        max_streak = max(max_streak, streak)
    return {"weekly_streak": max_streak}


@router.get("/analytics/velocity")
def get_learning_velocity(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    four_weeks_ago = datetime.utcnow().date() - timedelta(weeks=4)

    results = db.query(
        func.sum(models.LearningEntry.hours)
    ).filter(
        models.LearningEntry.user_id == user_id,
        models.LearningEntry.date >= four_weeks_ago
    ).scalar()

    total_hours = results or 0
    velocity = total_hours/4

    return {
        "weekly_average_hours_last_4_weeks": round(velocity, 2)
    }


@router.get("/analytics/consistency")
def get_consistency_score(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    thirty_days_ago = datetime.utcnow().date() - timedelta(days=30)
    results = db.query(
        func.count(func.distinct(models.LearningEntry.date))
    ).filter(
        models.LearningEntry.user_id == user_id,
        models.LearningEntry.date >= thirty_days_ago
    ).scalar()

    active_days = results or 0
    score = (active_days / 30)*100

    return {
        "Consistency_score_percent": round(score, 2)
    }


@router.get("/analytics/velocity-trend")
def get_velocity_trend(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    results = db.query(
        extract("year", models.LearningEntry.date).label("year"),
        extract("week", models.LearningEntry.date).label("week"),
        func.sum(models.LearningEntry.hours).label("total_hours")
    ).filter(
        models.LearningEntry.user_id == user_id
    ).group_by(
        "year", "week"
    ).order_by(
        "year", "week"
    ).all()

    data = [
        {
            "week": f"{int(r.year)}-W{int(r.week)}",
            "hours": float(r.total_hours)
        }
        for r in results
    ]

    return data
