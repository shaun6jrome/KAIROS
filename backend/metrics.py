import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from scipy.stats import entropy

def calculate_cosine_drift(centroid: list[float], response_embedding: list[float]) -> float:
    """
    Calculate the cosine similarity drift between the baseline centroid and a new response.
    Returns a drift score where 0 = identical, and higher = more drifted (1 - cosine_similarity).
    """
    if not centroid or not response_embedding:
        return 0.0
        
    c = np.array(centroid).reshape(1, -1)
    r = np.array(response_embedding).reshape(1, -1)
    
    sim = cosine_similarity(c, r)[0][0]
    
    # We want a distance metric (drift), so 1 - similarity
    # similarity of 1 -> drift of 0
    # similarity of 0 -> drift of 1
    # similarity of -1 -> drift of 2
    drift = float(1.0 - sim)
    
    # Ensure it's non-negative due to floating point inaccuracies
    return max(0.0, drift)


def calculate_length_zscore(response_text: str, mean_length: float, std_length: float) -> float:
    """
    Calculate the z-score of the response length compared to the baseline distribution.
    Returns the absolute z-score as a drift metric.
    """
    if std_length == 0:
        return 0.0 # Avoid division by zero if all baseline responses had exactly the same length
        
    length = len(response_text)
    z_score = abs(length - mean_length) / std_length
    
    return float(z_score)

def calculate_kl_divergence(baseline_dist: list[float], current_dist: list[float]) -> float:
    """
    Calculate the KL divergence between two probability distributions (e.g. response lengths).
    Returns a float representing the divergence. Higher = more drifted.
    """
    # Add a small epsilon to avoid log(0) or division by zero
    epsilon = 1e-10
    
    p = np.array(baseline_dist) + epsilon
    q = np.array(current_dist) + epsilon
    
    # Normalize to create valid probability distributions
    p = p / np.sum(p)
    q = q / np.sum(q)
    
    kl_div = entropy(p, q)
    return float(kl_div)
