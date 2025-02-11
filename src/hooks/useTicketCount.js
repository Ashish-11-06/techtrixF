import { useMemo } from 'react';

const useTicketCounts = (tickets) => {
    return useMemo(() => {
        // Ensure tickets is an array
        if (!Array.isArray(tickets) || tickets.length === 0) {
            return { total: 0, inProgress: 0, resolved: 0, closed: 0, open: 0 };
        }

        const total = tickets.length;
        const inProgress = tickets.filter(ticket => ticket.status === 'InProgress').length;
        const open = tickets.filter(ticket => ticket.status === 'Open').length;
        const resolved = tickets.filter(ticket => ticket.status === 'Resolved').length;
        const closed = tickets.filter(ticket => ticket.status === 'Closed').length; // Case-sensitive match for "Closed"

        //console.log(tickets); // Debugging: log tickets
        return { total, inProgress, resolved, closed, open };
    }, [tickets]); // Recompute only when tickets changes
};

export default useTicketCounts;