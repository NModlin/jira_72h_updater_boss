import React from 'react';
import AssigneeChart from '../dashboard/AssigneeChart';
import TrendChart from '../dashboard/TrendChart';
import RequestTypeTable from '../dashboard/RequestTypeTable';
import TicketTable from '../dashboard/TicketTable';

const OpenTicketsView = () => {
    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AssigneeChart />
                <TrendChart />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <RequestTypeTable />
                </div>
                <div className="lg:col-span-2">
                    <TicketTable />
                </div>
            </div>
        </>
    );
};

export default OpenTicketsView;
