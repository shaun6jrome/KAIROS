from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Baseline(Base):
    __tablename__ = "baselines"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    centroid = Column(JSON) 
    stats = Column(JSON) 

class ResponseLog(Base):
    __tablename__ = "responses"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    baseline_id = Column(Integer, ForeignKey("baselines.id"))
    query = Column(String)
    response = Column(String)
    response_length = Column(Integer)
    embedding = Column(JSON)
    
    baseline = relationship("Baseline")

class DriftEvent(Base):
    __tablename__ = "drift_events"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    severity = Column(String) # NOMINAL, WATCH, ALERT, CRITICAL
    drift_score = Column(Float)
    root_cause_classification = Column(String, nullable=True)
    evidence = Column(JSON, nullable=True)

class ProbeResult(Base):
    __tablename__ = "probe_results"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    category = Column(String) # hallucination, sycophancy, consistency, refusal, factual
    query = Column(String)
    expected = Column(String, nullable=True)
    actual_response = Column(String)
    score = Column(Float)

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    drift_event_id = Column(Integer, ForeignKey("drift_events.id"))
    message = Column(String)
    is_resolved = Column(Integer, default=0)
    
    drift_event = relationship("DriftEvent")
