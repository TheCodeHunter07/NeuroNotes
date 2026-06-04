from sqlalchemy.orm import relationship
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
    DateTime
)

from sqlalchemy.sql import func

from app.database.base import Base


class Note(Base):

    __tablename__ = "notes"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(String)

    content = Column(String)

    pinned = Column(
        Boolean,
        default=False
    )

    tag = Column(
        String(100),
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    owner = relationship(
    "User",
    back_populates="notes"
)