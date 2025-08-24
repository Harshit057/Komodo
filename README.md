# AI Multi-Agent Collaboration Lab

A cutting-edge platform where multiple specialized AI agents collaborate, debate, and solve complex problems in real-time. Each agent brings unique capabilities and personalities to deliver comprehensive solutions.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/python-3.8+-blue)
![Next.js](https://img.shields.io/badge/next.js-14+-black)

## 🌟 Features

### Multi-Agent Collaboration
- **OpenAI GPT-4**: Logical, analytical reasoning with structured problem-solving
- **HuggingFace Models**: Creative and innovative approaches with community-driven AI
- **Google Gemini**: Versatile, balanced perspectives with multimodal capabilities
- **Ollama Local**: Privacy-focused local processing for sensitive data
- **Stability AI**: Visual artist specializing in image generation and creative visualization

### Advanced Capabilities
- ✨ Real-time WebSocket communication
- 🎨 Image generation and visualization
- 🧠 Agent personality systems
- 📊 Live status monitoring
- 🔍 Individual agent testing
- 💾 Conversation memory with Pinecone vector storage
- 🛡️ Secure API key management
- 📱 Responsive, modern UI with Chakra UI

### Posh & Modern Interface
- Dark mode design with glassmorphism effects
- Elegant typography and animations
- Real-time conversation visualization
- Agent status dashboard
- Professional formal design language

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- API Keys for the services you want to use

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Start the backend server**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory with your API keys:

```env
OPENAI_API_KEY=your_openai_api_key
HUGGINGFACE_API_KEY=your_huggingface_token
GEMINIE_API_KEY=your_gemini_api_key
STABILITY_API_KEY=your_stability_api_key
PINECONE_API_KEY=your_pinecone_api_key
OLLAMA_KEY_PATH=path_to_ollama_key
```

### Ollama Setup (Optional)

For local AI processing:

1. Install Ollama from https://ollama.ai
2. Pull a model: `ollama pull llama2`
3. Ensure Ollama service is running on localhost:11434

### Pinecone Setup (Optional)

For conversation memory:

1. Create a Pinecone account
2. Create an index named `ai-agent-memory`
3. Set dimension to 384 with cosine metric

## 📖 API Documentation

### WebSocket Endpoints

#### `/ws/agents`
Real-time multi-agent collaboration endpoint. Send a message and receive responses from all active agents.

### REST Endpoints

#### `GET /`
Health check endpoint.

#### `GET /agents/status`
Returns status of all agents and active connections.

#### `POST /agent/{agent_name}`
Test individual agents:
- `/agent/openai`
- `/agent/huggingface`
- `/agent/gemini`
- `/agent/ollama`
- `/agent/stability`

Request body:
```json
{
  "text": "Your question or prompt",
  "context": "Optional context"
}
```

#### `POST /generate-image`
Generate images using Stability AI.

Request body:
```json
{
  "prompt": "Description of image to generate",
  "context": "Optional context"
}
```

## 🏗️ Architecture

### Backend (FastAPI)
- **FastAPI**: Modern, fast web framework
- **WebSockets**: Real-time bidirectional communication
- **Async/Await**: Concurrent agent processing
- **Pydantic**: Data validation and settings management

### Frontend (Next.js + Chakra UI)
- **Next.js**: React framework with SSR capabilities
- **Chakra UI**: Modern, accessible component library
- **WebSocket Client**: Real-time communication with backend
- **Responsive Design**: Works on desktop and mobile

### Agent System
Each agent has:
- **Unique Personality**: Specialized approach to problems
- **Error Handling**: Graceful fallbacks for API failures
- **Rate Limiting**: Respects API usage limits
- **Contextual Memory**: Maintains conversation context

## 🔒 Security Features

- Environment-based API key management
- CORS protection
- Input validation and sanitization
- Error handling without exposing sensitive data
- Optional local processing with Ollama

## 🎨 Customization

### Adding New Agents

1. Create agent client in `backend/agents/`
2. Add agent to main.py imports and initialization
3. Update frontend agent list in `agents.json`
4. Add personality colors and emojis

### Styling

The frontend uses Chakra UI with a custom theme. Modify:
- `frontend/pages/_app.js` for global theme
- Component files for specific styling
- CSS custom properties for advanced customization

## 🚀 Deployment

### Backend Deployment
```bash
# Production server
uvicorn main:app --host 0.0.0.0 --port 8000

# With Docker
docker build -t ai-multi-agent-backend .
docker run -p 8000:8000 ai-multi-agent-backend
```

### Frontend Deployment
```bash
# Build for production
npm run build
npm start

# Static export
npm run build && npm run export
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- 📧 Email: support@ai-multiagent-lab.com
- 💬 Discord: [Join our community]
- 📖 Documentation: [Full documentation]
- 🐛 Issues: [GitHub Issues]

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- HuggingFace for transformer models
- Google for Gemini API
- Stability AI for image generation
- Pinecone for vector storage
- The open-source community

---

**Built with ❤️ for the future of AI collaboration**
