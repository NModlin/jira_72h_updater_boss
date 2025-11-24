export const mockTickets = [
    { id: 'HD-52568', issue: 'Maintenance office computer needs Microsoft Office', priority: 'Low', reporter: 'Abigail Cross', summary: 'Maintenance office computer needs Microsoft Office containing Excel and Word', status: 'To Do', created: '2023-11-01', assignee: 'Abigail Cross' },
    { id: 'HD-52563', issue: 'Post Incident for Incident HD-52561', priority: 'Highest', reporter: 'Marc Viggiano', summary: 'Post Incident for Incident HD-52561', status: 'To Do', created: '2023-11-02', assignee: 'Marc Viggiano' },
    { id: 'HD-52560', issue: 'New hire locked out of company phone', priority: 'Low', reporter: 'Mitch Viggiano', summary: 'New hire locked out of my company phone and need to reset and license & key phone number is 215-990-1973', status: 'To Do', created: '2023-11-03', assignee: 'Mitch Viggiano' },
    { id: 'HD-52559', issue: 'Andrew Irving Jr needs an email set up', priority: 'Low', reporter: 'Leonardo G', summary: 'Andrew Irving Jr needs an email set up', status: 'To Do', created: '2023-11-04', assignee: 'Leonardo G' },
    { id: 'HD-52575', issue: 'I need a raised desk/support for the wall', priority: 'Low', reporter: 'Nathan Hebert', summary: 'I need a raised desk/support for the wall', status: 'To Do', created: '2023-11-05', assignee: 'Nathan Hebert' },
    { id: 'HD-52572', issue: 'Tatiana Chaves entered her current password', priority: 'Medium', reporter: 'Douglas Campbell', summary: 'Tatiana Chaves entered her current password, and it gives her an invalid password message. He is currently locked out.', status: 'To Do', created: '2023-11-06', assignee: 'Douglas Campbell' },
    { id: 'HD-52558', issue: 'Validation Xpress product code', priority: 'Low', reporter: 'Sara Howard', summary: 'Validation Xpress product code', status: 'To Do', created: '2023-11-07', assignee: 'Sara Howard' },
];

export const assigneeData = [
    { name: 'Abigail Cross', fresh: 2, almostStale: 5, stale: 10, spoiled: 36 },
    { name: 'Marc Viggiano', fresh: 5, almostStale: 2, stale: 8, spoiled: 20 },
    { name: 'Mitch Viggiano', fresh: 1, almostStale: 4, stale: 5, spoiled: 15 },
    { name: 'Leonardo G', fresh: 3, almostStale: 1, stale: 4, spoiled: 8 },
    { name: 'Nathan Hebert', fresh: 2, almostStale: 0, stale: 3, spoiled: 6 },
    { name: 'Douglas Campbell', fresh: 1, almostStale: 2, stale: 1, spoiled: 4 },
    { name: 'Sara Howard', fresh: 0, almostStale: 1, stale: 2, spoiled: 3 },
];

export const trendData = [
    { month: 'May', tickets: 11 },
    { month: 'Jun', tickets: 1 },
    { month: 'Aug', tickets: 9 },
    { month: 'Feb', tickets: 1 },
    { month: 'Apr', tickets: 1 },
    { month: 'Jan', tickets: 1 },
    { month: 'Jul', tickets: 5 },
    { month: 'Aug', tickets: 10 },
    { month: 'Sep', tickets: 11 },
    { month: 'Oct', tickets: 31 },
    { month: 'Nov', tickets: 73 },
];

export const requestTypeData = [
    { type: 'Post Incident Review', count: 42, avgDays: 169.97 },
    { type: 'Computer, Phone or Software Request', count: 30, avgDays: 21.76 },
    { type: 'Application Issue or Broken', count: 24, avgDays: 20.75 },
    { type: 'PC / Hardware / Device Issue', count: 12, avgDays: 26.50 },
    { type: 'Enabled request', count: 11, avgDays: 18.41 },
    { type: 'I need something else', count: 11, avgDays: 21.00 },
    { type: 'New Hire Onboarding', count: 7, avgDays: 15.71 },
];
