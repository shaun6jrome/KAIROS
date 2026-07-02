from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import numpy as np

import models, database, embeddings

router = APIRouter(prefix="/baselines", tags=["baselines"])

class BaselineCreate(BaseModel):
    name: str
    responses: list[str]

@router.post("/")
def create_baseline(baseline_data: BaselineCreate, db: Session = Depends(database.get_db)):
    # Check if exists
    db_baseline = db.query(models.Baseline).filter(models.Baseline.name == baseline_data.name).first()
    if db_baseline:
        raise HTTPException(status_code=400, detail="Baseline with this name already exists")
    
    if not baseline_data.responses:
        raise HTTPException(status_code=400, detail="Must provide at least one response to create baseline")

    # Embed responses
    embedded_responses = embeddings.get_embeddings(baseline_data.responses)
    
    # Calculate centroid
    np_embeddings = np.array(embedded_responses)
    centroid = np.mean(np_embeddings, axis=0).tolist()
    
    # Calculate length distribution stats
    lengths = [len(r) for r in baseline_data.responses]
    stats = {
        "mean_length": float(np.mean(lengths)),
        "std_length": float(np.std(lengths)),
        "num_responses": len(lengths)
    }
    
    new_baseline = models.Baseline(
        name=baseline_data.name,
        centroid=centroid,
        stats=stats
    )
    
    db.add(new_baseline)
    db.commit()
    db.refresh(new_baseline)
    
    return {"id": new_baseline.id, "name": new_baseline.name, "message": "Baseline captured successfully"}

@router.get("/")
def list_baselines(db: Session = Depends(database.get_db)):
    baselines = db.query(models.Baseline).all()
    return [{"id": b.id, "name": b.name, "created_at": b.created_at} for b in baselines]
