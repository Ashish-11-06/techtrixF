import React from 'react';
import { useSelector } from 'react-redux';
import Customers from '../../pages/Customers/Customers.jsx';
import QuotationList from '../../pages/Quotations/Quotations.jsx';
import InvoiceList from '../../pages/Invoices/InvoiceList.jsx';

const SalesDashboard2 = () => {
    const customers = useSelector((state) => state.customers.allCustomers);
    const quotations = useSelector((state) => state.quotations.salesQuotations);
    const invoices = useSelector((state) => state.invoices.salesInvoices);

    return (
        <div className="dashboard-container">
            <h1>Sales Dashboard</h1>
            <section>
                <h2>Customer Management</h2>
                <Customers users={customers} />
            </section>
            <section>
                <h2>Quotations</h2>
                <QuotationList quotations={quotations} />
            </section>
            <section>
                <h2>Invoices</h2>
                <InvoiceList invoices={invoices} />
            </section>
        </div>
    );
};

export default SalesDashboard2;
