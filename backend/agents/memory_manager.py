import os
from pinecone import Pinecone
from typing import Dict, Any, List
import json
import pandas as pd

class MemoryManager:
    def __init__(self):
        self.api_key = os.getenv("PINECONE_API_KEY")
        self.index_name = "ai-agent-memory"
        
        try:
            pc = Pinecone(api_key=self.api_key)
            
            # Check if index exists, create if not
            existing_indexes = [index.name for index in pc.list_indexes()]
            if self.index_name not in existing_indexes:
                pc.create_index(
                    name=self.index_name,
                    dimension=384,  # Sentence transformer dimension
                    metric="cosine",
                    spec={"serverless": {"cloud": "aws", "region": "us-east-1"}}
                )
            
            self.index = pc.Index(self.index_name)
        except Exception as e:
            print(f"Pinecone initialization failed: {e}")
            self.index = None
    
    async def store_conversation(self, session_id: str, messages: List[Dict], embeddings: List[float]) -> bool:
        try:
            if not self.index:
                return False
                
            vector_id = f"{session_id}_{len(messages)}"
            metadata = {
                "session_id": session_id,
                "timestamp": str(pd.Timestamp.now()),
                "message_count": len(messages),
                "last_message": messages[-1] if messages else {}
            }
            
            self.index.upsert([(vector_id, embeddings, metadata)])
            return True
        except Exception as e:
            print(f"Failed to store conversation: {e}")
            return False
    
    async def retrieve_similar_conversations(self, query_embedding: List[float], top_k: int = 5) -> List[Dict]:
        try:
            if not self.index:
                return []
                
            results = self.index.query(
                vector=query_embedding,
                top_k=top_k,
                include_metadata=True
            )
            
            return [match.metadata for match in results.matches]
        except Exception as e:
            print(f"Failed to retrieve conversations: {e}")
            return []
