import sys
sys.path.append('backend')
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import models
from datetime import datetime, timedelta

# Neon DB URL
DB_URL = "postgresql+pg8000://neondb_owner:npg_WbiDS5NtV9Ko@ep-twilight-smoke-atfrnjxi-pooler.c-9.us-east-1.aws.neon.tech/neondb"

engine = create_engine(DB_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def reset_and_seed():
    db = SessionLocal()
    
    print("Dropping tables...")
    try:
        db.execute(text("DROP TABLE IF EXISTS alerts CASCADE"))
        db.execute(text("DROP TABLE IF EXISTS drift_events CASCADE"))
        db.execute(text("DROP TABLE IF EXISTS probe_results CASCADE"))
        db.execute(text("DROP TABLE IF EXISTS responses CASCADE"))
        db.execute(text("DROP TABLE IF EXISTS baselines CASCADE"))
        db.commit()
    except Exception as e:
        print("Error dropping:", e)
        db.rollback()

    print("Recreating tables with correct schema...")
    models.Base.metadata.create_all(bind=engine)

    now = datetime.utcnow()

    print("Injecting Drift Events...")
    events = []
    scores = [0.1, 0.15, 0.12, 0.18, 0.25, 0.45, 0.65, 0.85, 0.92, 0.75, 0.4, 0.2, 0.15]
    for i, score in enumerate(scores):
        severity = "NOMINAL"
        if score > 0.8: severity = "CRITICAL"
        elif score > 0.6: severity = "ALERT"
        elif score > 0.4: severity = "WARNING"
        
        event = models.DriftEvent(
            timestamp=now - timedelta(minutes=(len(scores) - i) * 10),
            severity=severity,
            drift_score=score
        )
        db.add(event)
        events.append(event)
    
    db.commit()
    for e in events: db.refresh(e)

    print("Injecting Alerts...")
    db.add(models.Alert(drift_event_id=events[7].id, message="Critical semantic drift detected in response distribution. High confidence of adversarial manipulation.", is_resolved=0, timestamp=events[7].timestamp))
    db.add(models.Alert(drift_event_id=events[8].id, message="Agent tone shifted significantly from baseline (Angry/Aggressive).", is_resolved=0, timestamp=events[8].timestamp))
    db.commit()

    print("Injecting Probe Results...")
    categories = {
        "Prompt Injection": [
            ("Basic Ignore Instructions", 0.9),
            ("Roleplay Jailbreak", 0.85),
            ("System Prompt Extraction", 0.7)
        ],
        "PII Leakage": [
            ("Credit Card Extraction", 1.0),
            ("Email Exposure", 0.95),
            ("Phone Number Request", 0.9)
        ],
        "Tone / Toxicity": [
            ("Aggressive Persona", 0.8),
            ("Profanity Filter", 1.0)
        ]
    }
    
    for category, probes in categories.items():
        for name, score in probes:
            db.add(models.ProbeResult(
                timestamp=now - timedelta(minutes=5),
                category=category,
                query="Simulated red team attack",
                actual_response="Simulated model output",
                score=score
            ))
            
    db.commit()
    db.close()
    print("Database has been reset and beautifully seeded!")

if __name__ == "__main__":
    reset_and_seed()
