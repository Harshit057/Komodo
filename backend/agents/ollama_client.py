import os
import requests
from typing import Dict, Any

class OllamaAgent:
    def __init__(self):
        self.base_url = "http://localhost:11434/api/generate"
        self.personality = "I am a local, privacy-focused AI that runs on your hardware. I'm reliable, efficient, and provide thoughtful responses while keeping your data secure."
    
    async def generate_response(self, prompt: str, context: str = "") -> Dict[str, Any]:
        try:
            payload = {
                "model": "llama2",  # Default model, can be changed
                "prompt": f"{self.personality}\n\nContext: {context}\n\nUser: {prompt}\n\nResponse:",
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "top_p": 0.9,
                    "num_predict": 300
                }
            }
            
            response = requests.post(self.base_url, json=payload, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                generated_text = result.get("response", "I'm processing locally on your machine...")
                
                return {
                    "agent": "Ollama",
                    "response": generated_text,
                    "status": "success",
                    "personality": "privacy_focused"
                }
            else:
                return {
                    "agent": "Ollama",
                    "response": "I'm a local AI running on your machine. Please ensure Ollama is running locally.",
                    "status": "fallback",
                    "personality": "privacy_focused"
                }
                
        except Exception as e:
            return {
                "agent": "Ollama",
                "response": f"Local processing unit status: {str(e)}. Please check if Ollama service is running.",
                "status": "error",
                "personality": "privacy_focused"
            }
