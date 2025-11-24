import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// MCP Docker container connection
const MCP_BASE_URL = 'http://172.17.0.2:8080'; // Docker bridge network IP

app.use(cors());
app.use(express.json());

// Proxy endpoint for Jira search
app.post('/api/jira/search', async (req, res) => {
    try {
        const response = await fetch(`${MCP_BASE_URL}/api/jira/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching from MCP:', error);
        res.status(500).json({ error: 'Failed to fetch Jira data' });
    }
});

// Get unique request types from Jira
app.get('/api/jira/request-types', async (req, res) => {
    try {
        const response = await fetch(`${MCP_BASE_URL}/api/jira/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jql: 'project = HD',
                fields: ['issuetype', 'customfield_10010']
            })
        });

        const data = await response.json();
        const requestTypes = [...new Set(data.issues?.map(issue =>
            issue.fields?.customfield_10010?.requestType?.name || issue.fields?.issuetype?.name
        ).filter(Boolean))].sort();

        res.json(requestTypes);
    } catch (error) {
        console.error('Error fetching request types:', error);
        res.status(500).json({ error: 'Failed to fetch request types' });
    }
});

// Proxy endpoint for getting ticket details
app.get('/api/jira/ticket/:issueKey', async (req, res) => {
    try {
        const response = await fetch(`${MCP_BASE_URL}/api/jira/ticket/${req.params.issueKey}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching ticket:', error);
        res.status(500).json({ error: 'Failed to fetch ticket details' });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', mcpUrl: MCP_BASE_URL });
});

app.listen(PORT, () => {
    console.log(`Backend proxy server running on http://localhost:${PORT}`);
    console.log(`Proxying requests to MCP container at ${MCP_BASE_URL}`);
});
