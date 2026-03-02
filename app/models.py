import uuid
from sqlalchemy import Column, String, Date, Float, Text, ForeignKey, DateTime, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    learning_entries = relationship(
        "LearningEntry", back_populates="user", cascade="all, delete-orphan"
    )
    goals = relationship(
        "MonthlyGoal", back_populates="user", cascade="all, delete-orphan"
    )


class LearningEntry(Base):
    __tablename__ = "learning_entries"

    __table_args__ = (
        Index("idx_user_date", "user_id", "date"),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey(
        "users.id", ondelete="CASCADE"))
    date = Column(Date, nullable=False)
    hours = Column(Float, nullable=False)
    topic = Column(String, nullable=False)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="learning_entries")


class MonthlyGoal(Base):
    __tablename__ = "monthly_goals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey(
        "users.id", ondelete="CASCADE"))
    month = Column(String, nullable=False)
    target_hours = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="goals")
