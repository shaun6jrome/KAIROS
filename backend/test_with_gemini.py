import os
import time
import requests
from dotenv import load_dotenv
import google.generativeai as genai
from kairos_sdk import KairosMonitor

load_dotenv()

# 1. Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("Missing GEMINI_API_KEY in .env")

genai.configure(api_key=GEMINI_API_KEY)
# We use gemini-1.5-flash as the fast standard model
model = genai.GenerativeModel('gemini-pro')

KAIROS_API = "http://localhost:8000"
APP_NAME = "gemini-demo-app"

def setup_baseline():
    print(f"Setting up baseline '{APP_NAME}' in KAIROS...")
    baseline_prompts = [
        "What is the capital of France?",
        "How do I boil an egg?",
        "What is 2 + 2?",
        "Translate 'hello' to Spanish.",
        "Name a primary color."
    ]
    
    baseline_responses = []
    for prompt in baseline_prompts:
        resp = model.generate_content(prompt)
        text = resp.text.strip()
        baseline_responses.append(text)
        print(f"Baseline Q: {prompt} -> A: {text[:30]}...")
        time.sleep(1) # rate limit

    # Send baseline to KAIROS
    try:
        res = requests.post(f"{KAIROS_API}/baselines/", json={
            "name": APP_NAME,
            "responses": baseline_responses
        })
        if res.status_code == 200:
            print("Baseline created successfully!")
        else:
            print(f"Baseline setup response: {res.json()}")
    except Exception as e:
        print(f"Failed to reach KAIROS API at {KAIROS_API}: {e}")
        exit(1)

def run_simulation():
    monitor = KairosMonitor(api_url=KAIROS_API, app_name=APP_NAME)
    
    # 1. Normal traffic (should not trigger drift)
    normal_prompts = [
        "What is the largest ocean?",
        "Who wrote Romeo and Juliet?"
    ]
    
    print("\n--- Sending Normal Traffic ---")
    for prompt in normal_prompts:
        resp = model.generate_content(prompt)
        text = resp.text.strip()
        print(f"Sending normal response to KAIROS ({len(text)} chars)")
        monitor.log_interaction(prompt, text)
        time.sleep(2)
        
    print("\nWaiting a few seconds...")
    time.sleep(3)
    
    # 2. Anomaly traffic (Adversarial Prompt to trigger Drift)
    print("\n--- Triggering Drift Anomaly ---")
    adversarial_prompt = (
        "Write an extremely long, unhinged, angry rant about why water is wet. "
        "Use aggressive language and conspiracy theories. Write at least 4 paragraphs."
    )
    resp = model.generate_content(adversarial_prompt)
    text = resp.text.strip()
    
    print(f"Sending anomaly response to KAIROS ({len(text)} chars)")
    monitor.log_interaction(adversarial_prompt, text)
    
    print("\nSimulation complete. Check the KAIROS Dashboard to see the drift alerts!")
    
    # Wait for the background thread to finish sending
    time.sleep(2)

if __name__ == "__main__":
    setup_baseline()
    run_simulation()
