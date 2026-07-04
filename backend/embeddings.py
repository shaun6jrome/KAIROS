import os
import google.generativeai as genai

genai.configure(api_key=os.environ.get("GEMINI_API_KEY", ""))

def get_embedding(text: str) -> list[float]:
    """
    Generate an embedding for a given text using Gemini API.
    Returns a list of floats representing the embedding vector.
    """
    if not text:
        return []
    result = genai.embed_content(
        model="models/text-embedding-004",
        content=text
    )
    return result['embedding']

def get_embeddings(texts: list[str]) -> list[list[float]]:
    """
    Generate embeddings for a list of texts using Gemini API.
    Returns a list of lists of floats.
    """
    if not texts:
        return []
    result = genai.embed_content(
        model="models/text-embedding-004",
        content=texts
    )
    return result['embedding']
