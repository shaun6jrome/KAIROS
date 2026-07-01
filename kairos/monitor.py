import requests
import functools
import json

class KairosMonitor:
    def __init__(self, api_url="http://localhost:8000"):
        self.api_url = api_url

    def wrap(self, llm_function, baseline="v1-baseline"):
        """
        Wraps an LLM function. Intercepts the query and response, sends to KAIROS API,
        and returns the original response unchanged.
        """
        @functools.wraps(llm_function)
        def wrapper(query, *args, **kwargs):
            # Call the original LLM
            response = llm_function(query, *args, **kwargs)
            
            # Fire-and-forget to KAIROS backend (in a real SDK, this would be async/backgrounded)
            try:
                payload = {
                    "baseline_name": baseline,
                    "query": query,
                    "response": response
                }
                requests.post(f"{self.api_url}/analyze/", json=payload, timeout=2)
            except Exception as e:
                # Never break the user's application if KAIROS is down
                pass
                
            return response
        return wrapper

# Global instance for the 2-line integration
_monitor = KairosMonitor()

def wrap(llm_function, baseline="v1-baseline"):
    return _monitor.wrap(llm_function, baseline=baseline)
