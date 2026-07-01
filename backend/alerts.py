import requests
from sqlalchemy.orm import Session
from . import models
import os

def trigger_alert(db: Session, drift_event: models.DriftEvent):
    """
    Generate an alert for a drift event and trigger webhook.
    """
    message = f"[{drift_event.severity}] Drift detected! Score: {drift_event.drift_score:.2f}"
    if drift_event.root_cause_classification:
        message += f" | Root Cause: {drift_event.root_cause_classification}"
        
    alert = models.Alert(
        drift_event_id=drift_event.id,
        message=message
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    
    # Trigger webhook
    webhook_url = os.environ.get("KAIROS_WEBHOOK_URL")
    if webhook_url:
        try:
            payload = {
                "text": message,
                "severity": drift_event.severity,
                "score": drift_event.drift_score
            }
            requests.post(webhook_url, json=payload, timeout=5)
        except Exception as e:
            print(f"Failed to trigger webhook: {e}")
            
    return alert
