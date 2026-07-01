from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import numpy as np

from .. import models, database, embeddings, metrics

router = APIRouter(prefix="/analyze", tags=["drift"])

class AnalyzeRequest(BaseModel):
    baseline_name: str
    query: str
    response: str

@router.post("/")
def analyze_response(request: AnalyzeRequest, db: Session = Depends(database.get_db)):
    baseline = db.query(models.Baseline).filter(models.Baseline.name == request.baseline_name).first()
    if not baseline:
        raise HTTPException(status_code=404, detail="Baseline not found")
        
    # Get embedding for response
    response_emb = embeddings.get_embedding(request.response)
    
    # Calculate drift metrics
    cosine_drift = metrics.calculate_cosine_drift(baseline.centroid, response_emb)
    length_zscore = metrics.calculate_length_zscore(
        request.response, 
        baseline.stats.get("mean_length", 0), 
        baseline.stats.get("std_length", 1)
    )
    
    # KL divergence requires the full current distribution, which is hard to do for a single response
    # We will just pass 0 for KL divergence on a single response, or we could retrieve the recent responses
    # and compute it. For now, 0.0 to keep it fast.
    aggregate_score = metrics.calculate_aggregate_drift_score(cosine_drift, length_zscore, 0.0)
    severity = metrics.classify_drift_severity(aggregate_score)
    
    # Log the response
    log_entry = models.ResponseLog(
        baseline_id=baseline.id,
        query=request.query,
        response=request.response,
        response_length=len(request.response),
        embedding=response_emb
    )
    db.add(log_entry)
    
    # Log drift event if severity is ALERT or CRITICAL
    if severity in ["ALERT", "CRITICAL"]:
        drift_event = models.DriftEvent(
            severity=severity,
            drift_score=aggregate_score
        )
        db.add(drift_event)
        
    db.commit()
    
    return {
        "drift_score": aggregate_score,
        "severity": severity,
        "metrics": {
            "cosine_drift": cosine_drift,
            "length_zscore": length_zscore
        }
    }
