import { useMemo } from 'react';

const useQuotationCounts = (quotations) => {
    return useMemo(() => {
        // Ensure quotations is an array
        if (!Array.isArray(quotations) || quotations.length === 0) return { totalQuote: 0, pending: 0, approved: 0, closed: 0, open: 0 };

        let totalQuote = quotations.length;
        let pending = quotations.filter(quotations => quotations.status === 'Pending').length;
        let approved = quotations.filter(quotations => quotations.status === 'Approved').length;
        let rejected = quotations.filter(quotations => quotations.status === 'Rejected').length;

        return { totalQuote, pending, approved, closed, rejected, open };
    }, [quotations]);
};

export default useQuotationCounts;