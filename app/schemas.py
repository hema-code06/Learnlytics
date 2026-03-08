from pydantic import BaseModel, ConfigDict
from datetime import date as DateType
from typing import Optional, List
from uuid import UUID


class LearningEntryBase(BaseModel):

    topic: str
    subtopics: Optional[List[str]] = None
    from_date: Optional[DateType] = None
    to_date: Optional[DateType] = None
    hours: float
    completed: Optional[bool] = True
    project_name: Optional[str] = None
    project_description: Optional[str] = None
    project_point1: Optional[str] = None
    project_point2: Optional[str] = None
    project_point3: Optional[str] = None


class LearningEntryCreate(LearningEntryBase):
    pass


class LearningEntryUpdate(BaseModel):

    topic: Optional[str] = None
    subtopics: Optional[List[str]] = None
    from_date: Optional[DateType] = None
    to_date: Optional[DateType] = None
    hours: Optional[float] = None
    completed: Optional[bool] = None
    project_name: Optional[str] = None
    project_description: Optional[str] = None
    project_point1: Optional[str] = None
    project_point2: Optional[str] = None
    project_point3: Optional[str] = None


class LearningEntryResponse(LearningEntryBase):
    id: UUID

    model_config = ConfigDict(from_attributes=True)
