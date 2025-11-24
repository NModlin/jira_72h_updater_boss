import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

const FilterSection = ({ title, items, searchable = true }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItems, setSelectedItems] = useState(new Set());

    const filteredItems = searchable
        ? items.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
        : items;

    const toggleItem = (item) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(item)) {
            newSelected.delete(item);
        } else {
            newSelected.add(item);
        }
        setSelectedItems(newSelected);
    };

    const toggleAll = () => {
        if (selectedItems.size === items.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(items));
        }
    };

    return (
        <div className="border-b border-slate-200 pb-4">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between text-sm font-semibold text-slate-700 mb-3 hover:text-slate-900"
            >
                <span>{title}</span>
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isExpanded && (
                <div className="space-y-2">
                    <button
                        onClick={toggleAll}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                        {selectedItems.size === items.length ? 'Deselect All' : 'All'}
                    </button>

                    {searchable && (
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    )}

                    <div className="max-h-48 overflow-y-auto space-y-1">
                        {filteredItems.map((item) => (
                            <label
                                key={item}
                                className="flex items-center gap-2 text-sm text-slate-700 hover:bg-slate-50 px-2 py-1 rounded cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedItems.has(item)}
                                    onChange={() => toggleItem(item)}
                                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-xs">{item}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const FilterSidebar = () => {
    // Mock data - will be replaced with actual Jira data
    const teamNames = [
        'Data Analytics',
        'Infrastructure & Support',
        'Infrastructure Engineering',
        'IT Operations',
        'User Support'
    ];

    const assignees = [
        'Abigail Close',
        'Douglas Campbell',
        'Elvis Ngetich',
        'LaKara G',
        'Miles Matias',
        'Nathan Modlin',
        'Sofia Romero'
    ];

    const projects = [
        'Help Desk',
        'IT Operations'
    ];

    const priorities = [
        'Highest',
        'High',
        'Medium',
        'Low',
        'Lowest'
    ];

    const requestTypes = [
        'Post Incident Review',
        'Computer, Phone or Software Request',
        'Application Issue or Broken',
        'PC / Hardware / Device Issue',
        'Enabled request',
        'I need something else',
        'New Hire Onboarding'
    ];

    return (
        <div className="w-80 bg-white border-l border-slate-200 h-screen flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200">
                <h2 className="text-base font-semibold text-slate-800">Filters</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <FilterSection title="Team Name" items={teamNames} />
                <FilterSection title="Assignee" items={assignees} />
                <FilterSection title="Project" items={projects} searchable={false} />
                <FilterSection title="Priority" items={priorities} searchable={false} />
                <FilterSection title="Request Type" items={requestTypes} />
            </div>
        </div>
    );
};

export default FilterSidebar;
