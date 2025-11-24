import { mockTickets, assigneeData, trendData, requestTypeData } from '../data/mockData';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const JiraService = {
    getTickets: async () => {
        if (USE_MOCK_DATA) return mockTickets;

        try {
            const response = await fetch(`${BACKEND_URL}/api/jira/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jql: 'project = HD AND status != Done',
                    fields: ['summary', 'status', 'priority', 'assignee', 'reporter', 'created']
                })
            });
            const data = await response.json();
            return data.issues || [];
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
            return mockTickets;
        }
    },

    getAssigneeStats: async () => {
        if (USE_MOCK_DATA) return assigneeData;
        // TODO: Calculate from actual ticket data
        return assigneeData;
    },

    getTrendStats: async () => {
        if (USE_MOCK_DATA) return trendData;
        // TODO: Calculate from actual ticket data
        return trendData;
    },

    getRequestTypeStats: async () => {
        if (USE_MOCK_DATA) return requestTypeData;
        // TODO: Calculate from actual ticket data
        return requestTypeData;
    },

    // Extract unique values for filters
    getUniqueReporters: async () => {
        const tickets = await JiraService.getTickets();
        return [...new Set(tickets.map(t => t.reporter))].sort();
    },

    getUniqueRequestTypes: async () => {
        const tickets = await JiraService.getTickets();
        return [...new Set(tickets.map(t => t.requestType || 'Unknown'))].sort();
    }
};
