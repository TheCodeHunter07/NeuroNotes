from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.note_model import Note
from app.models.user_model import User

from app.schemas.note_schema import NoteCreate

from app.services.jwt_handler import get_current_user

router = APIRouter()

@router.post("/notes")
def create_note(
    note: NoteCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    user = db.query(User).filter(
        User.email == current_user
    ).first()

    new_note = Note(
    title=note.title,
    content=note.content,
    pinned=note.pinned,
    tag=note.tag,
    user_id=user.id
)
    db.add(new_note)

    db.commit()

    db.refresh(new_note)

    return {
        "message": "Note created successfully"
    }
@router.get("/notes")
def get_notes(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    user = db.query(User).filter(
        User.email == current_user
    ).first()

    notes = db.query(Note).filter(
        Note.user_id == user.id
    ).all()

    return notes
@router.delete("/notes/{note_id}")
def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    user = db.query(User).filter(
        User.email == current_user
    ).first()

    note = db.query(Note).filter(
        Note.id == note_id,
        Note.user_id == user.id
    ).first()

    if not note:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )

    db.delete(note)

    db.commit()

    return {
        "message": "Note deleted successfully"
    }
@router.put("/notes/{note_id}")
def update_note(
    note_id: int,
    note: NoteCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    user = db.query(User).filter(
        User.email == current_user
    ).first()
    if not user:
      raise HTTPException(
        status_code=404,
        detail="User not found"
    )

    existing_note = db.query(Note).filter(
        Note.id == note_id,
        Note.user_id == user.id
    ).first()

    if not existing_note:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )

    existing_note.title = note.title
    existing_note.content = note.content
    existing_note.pinned = note.pinned
    existing_note.tag = note.tag

    db.commit()
    db.refresh(existing_note)

    return {
        "message": "Note updated successfully"
    }
