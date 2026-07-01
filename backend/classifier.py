import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.environ.get("GEMINI_API_KEY", ""))
model = genai.GenerativeModel('gemini-1.5-flash')

def classify_root_cause(input_drift: bool, model_drift: bool, drift_score: float, sample_response: str) -> str:
    """
    Use Gemini as a judge to provide a plain English summary of the root cause of the drift.
    """
    if not os.environ.get("GEMINI_API_KEY"):
        return "Root cause classification unavailable (GEMINI_API_KEY not set)."
        
    prompt = f"""
    You are an AI diagnostic system. A behavioral drift has been detected in an LLM application.
    
    Diagnostic results:
    - Overall Drift Score: {drift_score:.3f} (Higher means more severe drift)
    - Input Distribution Shift Detected: {input_drift}
    - Model Canary Output Drift Detected: {model_drift}
    
    Sample drifted response:
    "{sample_response}"
    
    Based on these diagnostics, write a concise, plain English 2-3 sentence summary of what likely changed and why the drift alert fired.
    Classify the primary root cause as either "Input Shift", "Model Update", or "Unknown Degradation".
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Failed to generate root cause report: {str(e)}"
