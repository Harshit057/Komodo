import os
import openai
from typing import Dict, Any

class OpenAIAgent:
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.personality = "I am a logical, analytical AI that provides structured and well-reasoned responses. I excel at breaking down complex problems and offering step-by-step solutions."
    
    async def generate_response(self, prompt: str, context: str = "") -> Dict[str, Any]:
        try:
            full_prompt = f"{self.personality}\n\nContext: {context}\n\nUser: {prompt}\n\nResponse:"
            
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": self.personality},
                    {"role": "user", "content": f"{context}\n\n{prompt}"}
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            return {
                "agent": "OpenAI",
                "response": response.choices[0].message.content,
                "status": "success",
                "personality": "logical_analytical"
            }
        except Exception as e:
            return {
                "agent": "OpenAI",
                "response": f"I apologize, but I encountered an error: {str(e)}",
                "status": "error",
                "personality": "logical_analytical"
            }
