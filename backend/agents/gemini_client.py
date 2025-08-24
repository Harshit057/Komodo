import os
import requests
from typing import Dict, Any

class GeminiAgent:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
        self.personality = "I am a versatile and intuitive AI with multimodal capabilities. I excel at understanding context, providing balanced perspectives, and generating both text and visual insights."
    
    async def generate_response(self, prompt: str, context: str = "") -> Dict[str, Any]:
        try:
            headers = {"Content-Type": "application/json"}
            
            payload = {
                "contents": [{
                    "parts": [{
                        "text": f"{self.personality}\n\nContext: {context}\n\nUser: {prompt}\n\nPlease provide a balanced and insightful response:"
                    }]
                }],
                "generationConfig": {
                    "temperature": 0.7,
                    "topK": 40,
                    "topP": 0.95,
                    "maxOutputTokens": 500
                }
            }
            
            url = f"{self.base_url}?key={self.api_key}"
            response = requests.post(url, headers=headers, json=payload)
            
            if response.status_code == 200:
                result = response.json()
                generated_text = result["candidates"][0]["content"]["parts"][0]["text"]
                
                return {
                    "agent": "Gemini",
                    "response": generated_text,
                    "status": "success",
                    "personality": "versatile_balanced"
                }
            else:
                return {
                    "agent": "Gemini",
                    "response": "I'm accessing my multimodal capabilities to provide you with a comprehensive response.",
                    "status": "fallback",
                    "personality": "versatile_balanced"
                }
                
        except Exception as e:
            return {
                "agent": "Gemini",
                "response": f"My neural pathways are recalibrating: {str(e)}",
                "status": "error",
                "personality": "versatile_balanced"
            }
