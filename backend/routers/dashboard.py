from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
import models, database

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/alerts")
def get_alerts(db: Session = Depends(database.get_db), limit: int = 50):
    alerts = db.query(models.Alert).order_by(models.Alert.timestamp.desc()).limit(limit).all()
    return alerts

@router.get("/drift-history")
def get_drift_history(db: Session = Depends(database.get_db), limit: int = 100):
    events = db.query(models.DriftEvent).order_by(models.DriftEvent.timestamp.desc()).limit(limit).all()
    return events

@router.get("/probe-results")
def get_probe_results(db: Session = Depends(database.get_db), limit: int = 100):
    results = db.query(models.ProbeResult).order_by(models.ProbeResult.timestamp.desc()).limit(limit).all()
    return results

@router.get("/probe-summary")
def get_probe_summary(db: Session = Depends(database.get_db)):
    # Group by category and get average score
    summary = db.query(
        models.ProbeResult.category,
        func.avg(models.ProbeResult.score).label("average_score")
    ).group_by(models.ProbeResult.category).all()
    return [{"category": s.category, "score": float(s.average_score) if s.average_score else 0.0} for s in summary]

@router.get("/overview")
def get_overview(db: Session = Depends(database.get_db)):
    # Get current status (based on the latest drift event)
    latest_event = db.query(models.DriftEvent).order_by(models.DriftEvent.timestamp.desc()).first()
    status = latest_event.severity if latest_event else "NOMINAL"
    
    # Active alerts count
    active_alerts = db.query(models.Alert).filter(models.Alert.is_resolved == 0).count()
    
    return {
        "status": status,
        "active_alerts": active_alerts
    }
