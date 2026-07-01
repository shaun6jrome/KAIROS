from sentence_transformers import SentenceTransformer
import numpy as np

# Load model globally so it's only loaded once on startup
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_embedding(text: str) -> list[float]:
    """
    Generate an embedding for a given text.
    Returns a list of floats representing the embedding vector.
    """
    # The model outputs a numpy array, we convert it to a list for JSON serialization
    embedding = model.encode(text)
    return embedding.tolist()

def get_embeddings(texts: list[str]) -> list[list[float]]:
    """
    Generate embeddings for a list of texts.
    Returns a list of lists of floats.
    """
    embeddings = model.encode(texts)
    return embeddings.tolist()
