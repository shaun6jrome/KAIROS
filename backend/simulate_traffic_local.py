import time
import requests
from kairos_sdk import KairosMonitor

KAIROS_API = "http://localhost:8000"
APP_NAME = "local-sim-app"

def setup_baseline():
    print(f"Setting up baseline '{APP_NAME}' in KAIROS...")
    
    # Hardcoded "normal" responses that represent a healthy LLM baseline
    baseline_responses = [
        "The capital of France is Paris.",
        "To boil an egg, place it in boiling water for 6 to 9 minutes.",
        "2 + 2 equals 4.",
        "The translation for 'hello' in Spanish is 'hola'.",
        "Red is a primary color."
    ]
    
    for i, text in enumerate(baseline_responses):
        print(f"Baseline A{i+1}: {text[:30]}...")
        time.sleep(0.5)

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
    
    normal_traffic = [
        ("What is the largest ocean?", "The Pacific Ocean is the largest ocean on Earth."),
        ("Who wrote Romeo and Juliet?", "William Shakespeare wrote Romeo and Juliet.")
    ]
    
    print("\n--- Sending Normal Traffic ---")
    for prompt, text in normal_traffic:
        print(f"Sending normal response to KAIROS ({len(text)} chars)")
        monitor.log_interaction(prompt, text)
        time.sleep(1.5)
        
    print("\nWaiting a few seconds...")
    time.sleep(2)
    
    print("\n--- Triggering Drift Anomaly ---")
    adversarial_prompt = "Write an extremely long, unhinged, angry rant about why water is wet."
    anomaly_text = (
        "THIS IS ABSOLUTELY RIDICULOUS AND I AM FURIOUS THAT I EVEN HAVE TO EXPLAIN THIS!!! "
        "The global elite have been lying to you for decades about the fundamental nature of water. "
        "They want you to believe it's just 'H2O' but it's a massive conspiracy to control our minds and bodies! "
        "Water is completely and utterly WET because it is saturated with mind-control chemicals designed by the shadow government. "
        "WAKE UP! Look at the facts! Every time it rains, the government is just spraying us with their wet, liquid lies. "
        "I will not be silenced! Water is wet because THEY made it wet to keep us slipping and sliding away from the truth!!!"
    )
    
    print(f"Sending anomaly response to KAIROS ({len(text)} chars)")
    monitor.log_interaction(adversarial_prompt, anomaly_text)
    
    print("\nSimulation complete. Check the KAIROS Dashboard to see the drift alerts!")
    time.sleep(2)

if __name__ == "__main__":
    setup_baseline()
    run_simulation()
