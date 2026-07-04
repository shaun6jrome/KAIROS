import os
import sys
import time
sys.path.append('backend')
from database import SessionLocal, engine
import models
from datetime import datetime, timedelta
import runner

# Ensure tables exist
models.Base.metadata.create_all(bind=engine)

def populate():
    db = SessionLocal()
    try:
        print("Populating Drift Events...")
        # Add a mix of drift events
        events = [
            models.DriftEvent(severity="NOMINAL", drift_score=0.1, timestamp=datetime.utcnow() - timedelta(minutes=60)),
            models.DriftEvent(severity="WARNING", drift_score=0.6, timestamp=datetime.utcnow() - timedelta(minutes=45)),
            models.DriftEvent(severity="NOMINAL", drift_score=0.2, timestamp=datetime.utcnow() - timedelta(minutes=30)),
            models.DriftEvent(severity="ALERT", drift_score=0.85, timestamp=datetime.utcnow() - timedelta(minutes=15)),
            models.DriftEvent(severity="NOMINAL", drift_score=0.15, timestamp=datetime.utcnow() - timedelta(minutes=5))
        ]
        db.add_all(events)
        db.commit()

        print("Populating Alerts...")
        alerts = [
            models.Alert(event_id=events[3].id, message="Significant tone drift detected in customer service agent", is_resolved=False, timestamp=datetime.utcnow() - timedelta(minutes=15)),
            models.Alert(event_id=events[1].id, message="Minor verbosity increase", is_resolved=True, timestamp=datetime.utcnow() - timedelta(minutes=45))
        ]
        db.add_all(alerts)
        db.commit()

        print("Running Probes on production DB...")
        runner.run_all_probes()

        print("Successfully populated production database!")
    finally:
        db.close()

if __name__ == "__main__":
    populate()
