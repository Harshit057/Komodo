import os
import requests
from typing import Dict, Any

class HuggingFaceAgent:
    def __init__(self):
        self.api_key = os.getenv("HUGGINGFACE_API_KEY")
        self.base_url = "https://api-inference.huggingface.co/models"
        self.personality = "I am a creative and diverse AI that draws from a vast community of models. I bring innovative perspectives and love exploring unconventional solutions."
    
    async def generate_response(self, prompt: str, context: str = "") -> Dict[str, Any]:
        try:
            headers = {"Authorization": f"Bearer {self.api_key}"}
            
            # Use a conversational model
            model_url = f"{self.base_url}/microsoft/DialoGPT-large"
            
            payload = {
                "inputs": f"{self.personality}\n\nContext: {context}\n\nUser: {prompt}",
                "parameters": {
                    "max_new_tokens": 300,
                    "temperature": 0.8,
                    "return_full_text": False
                }
            }
            
            response = requests.post(model_url, headers=headers, json=payload)
            
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    generated_text = result[0].get("generated_text", "I'm processing your request...")
                else:
                    generated_text = "I'm ready to help with creative solutions!"
                    
                return {
                    "agent": "HuggingFace",
                    "response": generated_text,
                    "status": "success",
                    "personality": "creative_innovative"
                }
            else:
                return {
                    "agent": "HuggingFace", 
                    "response": "I'm currently warming up my models. Let me provide a creative perspective on your query shortly!",
                    "status": "fallback",
                    "personality": "creative_innovative"
                }
                
        except Exception as e:
            return {
                "agent": "HuggingFace",
                "response": f"My creative circuits are experiencing a hiccup: {str(e)}",
                "status": "error",
                "personality": "creative_innovative"
            }
