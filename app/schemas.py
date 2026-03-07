from pydantic import BaseModel, ConfigDict
from datetime import date as DateType
from typing import Optional, List, Dict
from uuid import UUID


class LearningEntryBase(BaseModel):
    date: DateType
    hours: float
    topic: str


class LearningEntryCreate(LearningEntryBase):
    pass


class LearningEntryUpdate(BaseModel):
    date: Optional[DateType] = None
    hours: Optional[float] = None
    topic: Optional[str] = None


class LearningEntryResponse(LearningEntryBase):
    id: UUID

    model_config = ConfigDict(from_attributes=True)


class TopicBase(BaseModel):
    name: str
    start_date: Optional[DateType] = None
    end_date: Optional[DateType] = None
    estimated_hours: Optional[float] = None


class TopicCreate(TopicBase):
    pass


class TopicResponse(TopicBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)


class SubTopicBase(BaseModel):
    topic_id: UUID
    name: str


class SubTopicCreate(SubTopicBase):
    pass


class SubTopicResponse(SubTopicBase):
    id: UUID
    completed: bool
    model_config = ConfigDict(from_attributes=True)


class ProjectBase(BaseModel):
    topic_id: UUID
    name: str
    description: Optional[str] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectResponse(ProjectBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)


class MonthlyGoalCreate(BaseModel):
    target_hours: float


class MonthlyGoalResponse(BaseModel):
    target: float
    completed: float
    percentage: float


class TopicBreakdownItem(BaseModel):
    topic: str
    hours: float
    percentage: Optional[float] = None


class StudyTimeResponse(BaseModel):
    mode: str
    data: Dict[str, float]


class PatternResponse(BaseModel):
    dominant_day: Optional[str] = None
    learning_type: Optional[str] = None
    consistency_type: Optional[str] = None


class InsightResponse(BaseModel):
    id: str
    message: str
    recommendation: str


class BadgeResponse(BaseModel):
    name: str
    unlocked_at: Optional[str] = None


class LearningOverview(BaseModel):
    tasks_completed: int
    points_earned: int


class DashboardData(BaseModel):
    daily_streak: int
    longest_streak: int
    velocity: float
    consistency: float

    overview: LearningOverview

    topic_breakdown: List[TopicBreakdownItem]

    study_time: Dict[str, float]

    pattern: PatternResponse

    productivity_score: float
    productivity_label: str

    insights: List[InsightResponse]

    badges: List[str]


class DashboardResponse(BaseModel):
    status: str
    data: DashboardData
