from fastapi import APIRouter

from app.services.groq_service import generate_summary
from app.schemas.ai_schema import SummaryRequest

router = APIRouter()

@router.post("/summarize")
def summarize_note(data: SummaryRequest):

    note_content = data.content

    summary = generate_summary(
        note_content
    )

    return {
        "summary": summary
    }