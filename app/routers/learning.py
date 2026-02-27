from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from .. import models, schemas
from ..database import get_db
from ..auth import get_current_user

router = APIRouter()


@router.post("/", response_model=schemas.LearningEntryResponse)
def create_entry(
    entry: schemas.LearningEntryCreate,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    new_entry = models.LearningEntry(
        user_id=user_id,
        date=entry.date,
        hours=entry.hours,
        topic=entry.topic,
        notes=entry.notes
    )

    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)

    return new_entry


@router.get("/heatmap")
def get_heatmap(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):

    results = db.query(
        models.LearningEntry.date,
        func.sum(models.LearningEntry.hours)
    ).filter(
        models.LearningEntry.user_id == user_id
    ).group_by(
        models.LearningEntry.date
    ).all()

    return results
