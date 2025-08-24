import os
import requests
import base64
from typing import Dict, Any

class StabilityAgent:
    def __init__(self):
        self.api_key = os.getenv("STABILITY_API_KEY")
        self.base_url = "https://api.stability.ai/v1"
        self.personality = "I am a visual AI artist that transforms ideas into stunning images. I specialize in creative visualization and bringing concepts to life through advanced image generation."
    
    async def generate_image(self, prompt: str, context: str = "") -> Dict[str, Any]:
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            enhanced_prompt = f"Professional, high-quality image: {prompt}"
            if context:
                enhanced_prompt = f"{context}. {enhanced_prompt}"
            
            payload = {
                "text_prompts": [
                    {
                        "text": enhanced_prompt,
                        "weight": 1
                    }
                ],
                "cfg_scale": 7,
                "height": 512,
                "width": 512,
                "samples": 1,
                "steps": 30
            }
            
            response = requests.post(
                f"{self.base_url}/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
                headers=headers,
                json=payload
            )
            
            if response.status_code == 200:
                data = response.json()
                image_data = data["artifacts"][0]["base64"]
                
                return {
                    "agent": "Stability",
                    "response": f"🎨 I've created a visual representation of '{prompt}'",
                    "image_data": image_data,
                    "status": "success",
                    "personality": "visual_artist",
                    "type": "image"
                }
            else:
                return {
                    "agent": "Stability",
                    "response": f"🎨 I'm preparing to visualize '{prompt}' - my artistic algorithms are warming up!",
                    "status": "fallback",
                    "personality": "visual_artist",
                    "type": "text"
                }
                
        except Exception as e:
            return {
                "agent": "Stability",
                "response": f"🎨 My artistic vision is temporarily clouded: {str(e)}",
                "status": "error",
                "personality": "visual_artist",
                "type": "text"
            }
    
    async def generate_response(self, prompt: str, context: str = "") -> Dict[str, Any]:
        # For text-based requests, provide creative descriptions
        return {
            "agent": "Stability",
            "response": f"🎨 As a visual AI, I would create an image representing: {prompt}. Would you like me to generate this visualization?",
            "status": "success",
            "personality": "visual_artist",
            "type": "text"
        }
