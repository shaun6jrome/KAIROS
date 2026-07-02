import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import embeddings

def check_input_drift(recent_queries: list[str], baseline_queries: list[str], threshold: float = 0.2) -> tuple[bool, float, str]:
    """
    Check if the input queries have shifted compared to the baseline distribution.
    Returns (is_drifted, confidence_score, evidence_summary)
    """
    if not recent_queries or not baseline_queries:
        return False, 0.0, "Insufficient data for input drift check."
        
    recent_embs = embeddings.get_embeddings(recent_queries)
    baseline_embs = embeddings.get_embeddings(baseline_queries)
    
    recent_centroid = np.mean(recent_embs, axis=0).reshape(1, -1)
    baseline_centroid = np.mean(baseline_embs, axis=0).reshape(1, -1)
    
    similarity = cosine_similarity(baseline_centroid, recent_centroid)[0][0]
    drift_score = 1.0 - similarity
    
    is_drifted = drift_score > threshold
    confidence = min(drift_score / (threshold * 2), 1.0) # Scale confidence
    
    evidence = f"Input distribution shifted by {drift_score:.3f} (Threshold: {threshold})."
    
    return is_drifted, float(confidence), evidence

def check_model_drift(canary_query: str, expected_response_emb: list[float], model_function, threshold: float = 0.1) -> tuple[bool, float, str]:
    """
    Run a fixed canary query through the model and check if the output has drifted.
    Returns (is_drifted, confidence_score, evidence_summary)
    """
    try:
        # Simulate model call
        actual_response = model_function(canary_query)
        actual_emb = embeddings.get_embedding(actual_response)
        
        c = np.array(expected_response_emb).reshape(1, -1)
        r = np.array(actual_emb).reshape(1, -1)
        
        similarity = cosine_similarity(c, r)[0][0]
        drift_score = 1.0 - similarity
        
        is_drifted = drift_score > threshold
        confidence = min(drift_score / (threshold * 2), 1.0)
        
        evidence = f"Model canary response drifted by {drift_score:.3f} (Threshold: {threshold})."
        return is_drifted, float(confidence), evidence
    except Exception as e:
        return False, 0.0, f"Error running canary check: {str(e)}"
