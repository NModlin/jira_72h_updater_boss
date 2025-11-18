const fetch = require('node-fetch');

class JiraService {
  constructor(jiraUrl, userEmail, apiToken, teamEmails, statuses, hoursThreshold) {
    this.jiraUrl = jiraUrl.replace(/\/$/, ''); // Remove trailing slash
    this.userEmail = userEmail;
    this.apiToken = apiToken;
    this.teamEmails = teamEmails || [];
    this.statuses = statuses || ['In Progress', 'Open', 'Waiting for Support', 'Waiting for Customer'];
    this.hoursThreshold = hoursThreshold || 72;
  }

  getAuthHeader() {
    const auth = Buffer.from(`${this.userEmail}:${this.apiToken}`).toString('base64');
    return `Basic ${auth}`;
  }

  buildJQL() {
    // Build assignee clause
    let assigneeClause;
    if (this.teamEmails.length === 1) {
      assigneeClause = `assignee = "${this.teamEmails[0]}"`;
    } else {
      const emailList = this.teamEmails.map(email => `"${email}"`).join(', ');
      assigneeClause = `assignee in (${emailList})`;
    }

    // Build status clause
    let statusClause;
    if (this.statuses.length === 1) {
      statusClause = `status = "${this.statuses[0]}"`;
    } else {
      const statusList = this.statuses.map(status => `"${status}"`).join(', ');
      statusClause = `status in (${statusList})`;
    }

    // Build time clause
    const timeClause = `updated <= -${this.hoursThreshold}h`;

    // Combine all clauses
    const jql = `${assigneeClause} AND ${timeClause} AND ${statusClause}`;

    console.log('Generated JQL:', jql);
    return jql;
  }

  async testConnection() {
    const url = `${this.jiraUrl}/rest/api/3/myself`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': this.getAuthHeader(),
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid credentials. Please check your email and API token.');
      } else if (response.status === 404) {
        throw new Error('Invalid Jira URL. Please check the URL and try again.');
      } else {
        throw new Error(`Connection failed: ${response.status} ${response.statusText}`);
      }
    }

    return await response.json();
  }

  async getStaleTickets() {
    const jql = this.buildJQL();
    const url = `${this.jiraUrl}/rest/api/3/search/jql`;

    const body = {
      jql: jql,
      fields: ['summary', 'status', 'updated', 'assignee'],
      maxResults: 100
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': this.getAuthHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = new Error(`Jira API error: ${response.status} ${response.statusText}`);
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    
    // Transform the response into a simpler format
    return data.issues.map(issue => ({
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status.name,
      updated: issue.fields.updated,
      assignee: issue.fields.assignee ? issue.fields.assignee.displayName : 'Unassigned'
    }));
  }
}

module.exports = JiraService;

