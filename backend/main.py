import os
import asyncio
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from agents.openai_client import OpenAIAgent
from agents.huggingface_client import HuggingFaceAgent
from agents.gemini_client import GeminiAgent
from agents.ollama_client import OllamaAgent
from agents.stability_client import StabilityAgent
from agents.memory_manager import MemoryManager

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "AI Multi-Agent Collaboration Lab backend is running."}

# Initialize agents
openai_agent = OpenAIAgent()
huggingface_agent = HuggingFaceAgent()
gemini_agent = GeminiAgent()
ollama_agent = OllamaAgent()
stability_agent = StabilityAgent()
memory_manager = MemoryManager()

# Store active connections
active_connections = []

class ConversationManager:
    def __init__(self):
        self.conversations = {}
    
    def add_message(self, session_id: str, message: dict):
        if session_id not in self.conversations:
            self.conversations[session_id] = []
        self.conversations[session_id].append(message)
    
    def get_context(self, session_id: str, max_messages: int = 10) -> str:
        if session_id not in self.conversations:
            return ""
        recent_messages = self.conversations[session_id][-max_messages:]
        return "\n".join([f"{msg['sender']}: {msg['text']}" for msg in recent_messages])

conversation_manager = ConversationManager()

# WebSocket endpoint for multi-agent collaboration
@app.websocket("/ws/agents")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    session_id = f"session_{len(active_connections)}"
    
    try:
        while True:
            data = await websocket.receive_text()
            if not data or not isinstance(data, str):
                await websocket.send_text("System: Invalid input.")
                continue
            
            # Add user message to conversation
            conversation_manager.add_message(session_id, {"sender": "User", "text": data})
            context = conversation_manager.get_context(session_id)
            
            # Get responses from all agents
            tasks = [
                openai_agent.generate_response(data, context),
                huggingface_agent.generate_response(data, context),
                gemini_agent.generate_response(data, context),
                ollama_agent.generate_response(data, context),
                stability_agent.generate_response(data, context)
            ]
            
            try:
                responses = await asyncio.gather(*tasks, return_exceptions=True)
                
                for response in responses:
                    if isinstance(response, Exception):
                        await websocket.send_text(f"System: Agent error: {str(response)}")
                        continue
                    
                    # Add agent response to conversation
                    conversation_manager.add_message(session_id, {
                        "sender": response["agent"], 
                        "text": response["response"]
                    })
                    
                    # Format response with personality indicator
                    personality_emoji = {
                        "logical_analytical": "🧠",
                        "creative_innovative": "🎨",
                        "versatile_balanced": "⚖️",
                        "privacy_focused": "🔒",
                        "visual_artist": "🖼️"
                    }
                    
                    emoji = personality_emoji.get(response.get("personality", ""), "🤖")
                    formatted_response = f"{response['agent']} {emoji}: {response['response']}"
                    
                    await websocket.send_text(formatted_response)
                    
                    # Small delay between agent responses for better UX
                    await asyncio.sleep(0.5)
                    
            except Exception as e:
                await websocket.send_text(f"System: Error processing agents: {str(e)}")
                continue
                
    except WebSocketDisconnect:
        if websocket in active_connections:
            active_connections.remove(websocket)
    except Exception as e:
        await websocket.send_text(f"System: Unexpected error: {str(e)}")
        if websocket in active_connections:
            active_connections.remove(websocket)

# REST endpoints for each agent (for testing and fallback)
@app.post("/agent/openai")
async def openai_endpoint(payload: dict):
    text = payload.get("text", "")
    context = payload.get("context", "")
    if not text:
        return {"error": "No text provided."}
    return await openai_agent.generate_response(text, context)

@app.post("/agent/huggingface")
async def huggingface_endpoint(payload: dict):
    text = payload.get("text", "")
    context = payload.get("context", "")
    if not text:
        return {"error": "No text provided."}
    return await huggingface_agent.generate_response(text, context)

@app.post("/agent/gemini")
async def gemini_endpoint(payload: dict):
    text = payload.get("text", "")
    context = payload.get("context", "")
    if not text:
        return {"error": "No text provided."}
    return await gemini_agent.generate_response(text, context)

@app.post("/agent/ollama")
async def ollama_endpoint(payload: dict):
    text = payload.get("text", "")
    context = payload.get("context", "")
    if not text:
        return {"error": "No text provided."}
    return await ollama_agent.generate_response(text, context)

@app.post("/agent/stability")
async def stability_endpoint(payload: dict):
    text = payload.get("text", "")
    context = payload.get("context", "")
    if not text:
        return {"error": "No text provided."}
    return await stability_agent.generate_response(text, context)

@app.post("/generate-image")
async def generate_image_endpoint(payload: dict):
    prompt = payload.get("prompt", "")
    context = payload.get("context", "")
    if not prompt:
        return {"error": "No prompt provided."}
    return await stability_agent.generate_image(prompt, context)

@app.get("/agents/status")
async def agents_status():
    """Check status of all agents"""
    return {
        "agents": [
            {"name": "OpenAI", "status": "ready", "personality": "logical_analytical"},
            {"name": "HuggingFace", "status": "ready", "personality": "creative_innovative"},
            {"name": "Gemini", "status": "ready", "personality": "versatile_balanced"},
            {"name": "Ollama", "status": "ready", "personality": "privacy_focused"},
            {"name": "Stability", "status": "ready", "personality": "visual_artist"}
        ],
        "active_connections": len(active_connections)
    }
