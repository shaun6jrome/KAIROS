import requests
import threading

class KairosMonitor:
    def __init__(self, api_url: str, app_name: str):
        self.api_url = api_url.rstrip('/')
        self.app_name = app_name

    def log_interaction(self, prompt: str, response: str, metadata: dict = None):
        """Asynchronously logs an LLM interaction to KAIROS"""
        def _log():
            try:
                # The /analyze endpoint expects: baseline_name, query, response
                requests.post(f"{self.api_url}/analyze/", json={
                    "baseline_name": self.app_name,
                    "query": prompt,
                    "response": response
                })
            except Exception as e:
                print(f"KAIROS SDK Error: {e}")
                
        threading.Thread(target=_log, daemon=True).start()
