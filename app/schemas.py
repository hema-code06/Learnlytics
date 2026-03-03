from pydantic import BaseModel, EmailStr, Field
from datetime import date as DateType
from typing import Optional
from uuid import UUID


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class LearningEntryBase(BaseModel):
    date: DateType
    hours: float
    topic: str
    notes: str | None = None


class LearningEntryCreate(LearningEntryBase):
    pass


class LearningEntryUpdate(BaseModel):
    date: Optional[DateType] = None
    hours: Optional[float] = None
    topic: Optional[str] = None
    notes: Optional[str] = None


class LearningEntryResponse(LearningEntryBase):
    id: UUID

    class Config:
        from_attributes = True
