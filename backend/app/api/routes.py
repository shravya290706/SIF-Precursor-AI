import io
from typing import Any

import pandas as pd
from fastapi import APIRouter, File, HTTPException, UploadFile, status

from ..services.classifier import load_artifacts, predict_narrative
from .schemas import AnalyzeRequest, AnalyzeResponse, BulkResponse, EvidenceItem, HealthResponse


router = APIRouter()

try:
    MODEL, VECTORIZER = load_artifacts()
except Exception:
    MODEL = None
    VECTORIZER = None


def _ensure_model_loaded():
    if MODEL is None or VECTORIZER is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Classifier model is not available.",
        )


def _confidence(probability: float) -> str:
    if probability >= 0.80 or probability <= 0.20:
        return "HIGH"
    if probability >= 0.60 or probability <= 0.40:
        return "MEDIUM"
    return "LOW"


def _analyze_text(narrative: str) -> dict[str, Any]:
    if not narrative or not narrative.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Narrative must not be empty.")

    _ensure_model_loaded()
    result = predict_narrative(narrative, MODEL, VECTORIZER)
    positive_probability = result["positive_probability"]
    prediction = "SIF_POTENTIAL" if positive_probability >= 0.50 else "NOT_APPARENT"
    evidence = [
        EvidenceItem(term=item["term"], weight=item["contribution"])
        for item in result["evidence"]
        if item["term"].lower() in narrative.lower()
    ]
    return {
        "prediction": prediction,
        "probability": positive_probability,
        "confidence": _confidence(positive_probability),
        "evidence": evidence,
    }


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Check backend health",
    description="Returns service status and whether the persisted classifier artifacts loaded.",
)
def health() -> HealthResponse:
    return HealthResponse(status="ok", model_loaded=MODEL is not None and VECTORIZER is not None)


@router.post(
    "/api/analyze",
    response_model=AnalyzeResponse,
    summary="Analyze one safety report",
    description="Classifies one narrative and returns probability, confidence, and coefficient-based evidence terms.",
)
def analyze(request: AnalyzeRequest) -> AnalyzeResponse:
    return AnalyzeResponse(**_analyze_text(request.narrative))


@router.post(
    "/api/analyze/bulk",
    response_model=BulkResponse,
    summary="Analyze reports from a CSV upload",
    description="Analyzes a CSV with a required narrative_text column and optional report metadata columns.",
)
async def analyze_bulk(file: UploadFile = File(...)) -> BulkResponse:
    try:
        contents = await file.read()
        frame = pd.read_csv(io.BytesIO(contents), keep_default_na=False)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid CSV upload.") from exc

    if "narrative_text" not in frame.columns:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="CSV must contain narrative_text column.")
    if frame.empty:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="CSV contains no reports.")

    analyzed_reports = []
    for row_number, row in frame.iterrows():
        narrative = str(row["narrative_text"])
        if not narrative.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"narrative_text is empty at row {row_number + 2}.",
            )
        analysis = _analyze_text(narrative)
        report: dict[str, Any] = {
            column: row[column]
            for column in frame.columns
            if column in {"osha_id", "event_title", "location", "activity"}
        }
        report["prediction"] = analysis["prediction"]
        report["probability"] = analysis["probability"]
        report["confidence"] = analysis["confidence"]
        report["evidence"] = [item.model_dump() for item in analysis["evidence"]]
        analyzed_reports.append(report)

    probabilities = [report["probability"] for report in analyzed_reports]
    sif_count = sum(report["prediction"] == "SIF_POTENTIAL" for report in analyzed_reports)
    return BulkResponse(
        total_reports=len(analyzed_reports),
        sif_potential_count=sif_count,
        not_apparent_count=len(analyzed_reports) - sif_count,
        average_probability=sum(probabilities) / len(probabilities),
        analyzed_reports=analyzed_reports,
    )