# Setup Instructions - Cobalt Dashboard

## Prerequisites
- Docker with `friendly_goldberg` container running
- Node.js 18+
- Ollama installed and running (for AI features)

## Quick Start

### 1. Frontend Setup
```bash
cd cobalt-dashboard
npm install
cp .env.example .env
npm run dev
```

The dashboard will be available at `http://localhost:5173/`

### 2. Backend Proxy Setup
Open a new terminal:
```bash
cd cobalt-dashboard/server
npm install
npm run dev
```

The backend proxy will run on `http://localhost:3001/`

### 3. Docker Container (MCP)
Ensure `friendly_goldberg` is running:
```bash
docker ps | grep friendly_goldberg
```

If not running, start it:
```bash
docker start friendly_goldberg
```

### 4. Ollama (Optional - for AI features)
Install Ollama from https://ollama.ai, then:
```bash
ollama pull llama3.2
ollama serve
```

## Environment Variables

Edit `.env`:
```env
VITE_USE_MOCK_DATA=true  # Set to false when ready for live data
VITE_BACKEND_URL=http://localhost:3001
VITE_JIRA_BASE_URL=https://rehrig.atlassian.net
VITE_JIRA_USER_EMAIL=your-email@example.com
VITE_JIRA_API_TOKEN=your-api-token
VITE_OLLAMA_URL=http://localhost:11434
```

## Features

### ✅ Dynamic Filters
- **Team Name** - Filterable list of teams
- **Assignee** - All ticket assignees with search
- **Project** - Project selection (HD, IT Ops, etc.)
- **Priority** - Highest, High, Medium, Low, Lowest
- **Request Type** - All request types with search

### ✅ AI Chat (Powered by Ollama)
- Click the blue chat button in bottom-right corner
- Ask questions like:
  - "Show me high priority tickets"
  - "Who has the most open tickets?"
  - "What are the most common request types?"

### ✅ Live Data Integration
When `VITE_USE_MOCK_DATA=false`, the dashboard will:
1. Connect to the backend proxy on port 3001
2. Proxy requests to the MCP Docker container (172.17.0.2:8080)
3. Fetch real Jira data from your HD project

## Troubleshooting

### Backend can't connect to Docker
Check the Docker container's IP:
```bash
docker inspect friendly_goldberg | grep IPAddress
```
Update `server/index.js` with the correct IP if different from `172.17.0.2`

### Ollama not responding
Ensure Ollama is running:
```bash
curl http://localhost:11434/api/version
```

### CORS errors
The backend proxy handles CORS. Ensure it's running on port 3001.
