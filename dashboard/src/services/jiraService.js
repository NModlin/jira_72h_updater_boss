import { mockTickets, assigneeData, trendData, requestTypeData } from '../data/mockData';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const JiraService = {
    getTickets: async () => {
        // 1. Electron Mode
        if (window.electronAPI) {
            // Use a broad query to get all open tickets for the dashboard
            // We ignore the stored JQL (which is for stale ticket notifications)
            const tickets = await window.electronAPI.fetchTickets('project = HD AND status not in (Done, Closed, Resolved) ORDER BY created DESC');
            return tickets || [];
        }

        // 2. Browser/Mock Mode
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

    getAssigneeStats: async (tickets) => {
        if (!tickets || tickets.length === 0) return assigneeData;

        // Calculate stats from actual tickets
        const stats = {};
        const now = new Date();

        tickets.forEach(ticket => {
            const assignee = ticket.assignee || 'Unassigned';
            if (!stats[assignee]) {
                stats[assignee] = { name: assignee, fresh: 0, almostStale: 0, stale: 0, spoiled: 0 };
            }

            const created = new Date(ticket.created);
            const hoursOld = (now - created) / (1000 * 60 * 60);

            if (hoursOld < 24) stats[assignee].fresh++;
            else if (hoursOld < 48) stats[assignee].almostStale++;
            else if (hoursOld < 72) stats[assignee].stale++;
            else stats[assignee].spoiled++;
        });

        return Object.values(stats);
    },

    getTrendStats: async (tickets) => {
        if (!tickets || tickets.length === 0) return trendData;

        // Group by month (simplified for now)
        const stats = {};
        tickets.forEach(ticket => {
            const date = new Date(ticket.created);
            const month = date.toLocaleString('default', { month: 'short' });
            if (!stats[month]) stats[month] = 0;
            stats[month]++;
        });

        return Object.entries(stats).map(([month, count]) => ({ month, tickets: count }));
    },

    getRequestTypeStats: async (tickets) => {
        if (!tickets || tickets.length === 0) return requestTypeData;

        const stats = {};
        tickets.forEach(ticket => {
            // Assuming requestType is available or derived from summary/labels
            const type = ticket.requestType || 'General Request';
            if (!stats[type]) stats[type] = { type, count: 0, totalDays: 0 };

            stats[type].count++;
            const created = new Date(ticket.created);
            const daysOpen = (new Date() - created) / (1000 * 60 * 60 * 24);
            stats[type].totalDays += daysOpen;
        });

        return Object.values(stats).map(s => ({
            type: s.type,
            count: s.count,
            avgDays: s.totalDays / s.count
        }));
    },

    // Extract unique values for filters
    getUniqueReporters: async (tickets) => {
        const data = tickets || await JiraService.getTickets();
        return [...new Set(data.map(t => t.reporter))].sort();
    },

    getUniqueRequestTypes: async (tickets) => {
        const data = tickets || await JiraService.getTickets();
        return [...new Set(data.map(t => t.requestType || 'Unknown'))].sort();
    }
};
