from pydantic import BaseModel, EmailStr
from datetime import date
from uuid import UUID
from typing import Optional


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class LearningEntryBase(BaseModel):
    date: date
    hours: float
    topic: str
    notes: str | None = None


class LearningEntryCreate(LearningEntryBase):
    pass


class LearningEntryUpdate(BaseModel):
    date: Optional[date] = None
    hours: Optional[float] = None
    topic: Optional[str] = None
    notes: Optional[str] = None


class LearningEntryResponse(LearningEntryBase):
    id: UUID

    class Config:
        from_attributes = True
