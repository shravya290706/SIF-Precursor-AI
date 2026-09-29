from typing import Any, Literal

from pydantic import BaseModel, Field


PredictionLabel = Literal["SIF_POTENTIAL", "NOT_APPARENT"]
ConfidenceLevel = Literal["HIGH", "MEDIUM", "LOW"]


class HealthResponse(BaseModel):
    status: Literal["ok"]
    model_loaded: bool


class AnalyzeRequest(BaseModel):
    narrative: str = Field(..., description="Free-text safety report narrative")


class EvidenceItem(BaseModel):
    term: str
    weight: float


class AnalyzeResponse(BaseModel):
    prediction: PredictionLabel
    probability: float = Field(..., ge=0.0, le=1.0)
    confidence: ConfidenceLevel
    evidence: list[EvidenceItem]


class BulkResponse(BaseModel):
    total_reports: int
    sif_potential_count: int
    not_apparent_count: int
    average_probability: float = Field(..., ge=0.0, le=1.0)
    analyzed_reports: list[dict[str, Any]]