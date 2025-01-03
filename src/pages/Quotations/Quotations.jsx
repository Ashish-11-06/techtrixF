import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuotations, getQuotationById } from '../../redux/slices/quotationSlice';
import { fetchTickets } from '../../redux/slices/ticketSlice'; // Action to fetch tickets
import { Layout, Table, Button, Empty, message, Spin, Typography, Input } from 'antd';
import CreateQuotationFormModal from '../../components/Quotation/CreateQuotation';
import QuotationDetailsModal from '../../components/Quotation/QuotationDetails';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useLocation } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;

const Quotations = () => {
    const dispatch = useDispatch();
    const { quotations = [], loading, error } = useSelector((state) => state.quotations);
    const { tickets = [] } = useSelector((state) => state.tickets); // Get tickets from Redux state

    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
    const [selectedQuotation, setSelectedQuotation] = useState(null);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        dispatch(fetchQuotations());
        dispatch(fetchTickets()); // Fetch tickets
    }, [dispatch, useLocation()]);

    useEffect(() => {
        if (error) {
            message.error(`Failed to load quotations: ${error}. Please check backend connectivity.`);
        }
    }, [error]);

    const handleViewClick = async (record) => {
        try {
            const { payload } = await dispatch(getQuotationById(record.quotationId));
            setSelectedQuotation(payload);
            setIsDetailsModalVisible(true);
        } catch (error) {
            // console.error('Error fetching quotation:', error);
        }
    };

    const handleCreateModalClose = () => {
        setIsCreateModalVisible(false);
        dispatch(fetchQuotations());
    };

    const handleDetailsModalClose = () => {
        setIsDetailsModalVisible(false);
        setSelectedQuotation(null);
        dispatch(fetchQuotations());
    };

    const handleCreateQuotationSuccess = () => {
        dispatch(fetchQuotations());
    };

    // Search function
    const handleSearch = (value) => {
        setSearchText(value);
    };

    // console.log(tickets);
    // Map tickets to quotations
    const quotationsWithTickets = Array.isArray(quotations) ? quotations.map((quotation) => {
        const matchedTicket = tickets.find((ticket) => ticket.ticketId === quotation.ticketId);
        return { ...quotation, ticket: matchedTicket }; // Add ticket details to quotation
    }) : [];


    // Filter quotations based on search text
    const filteredQuotations = quotationsWithTickets.filter((quotation) => {
        const c_companyName = quotation.c_companyName || 'N/A'
        return (
            quotation.comments.toLowerCase().includes(searchText.toLowerCase()) ||
            c_companyName.toLowerCase().includes(searchText.toLowerCase()) ||
            quotation.finalAmount.toString().includes(searchText) ||
            quotation.status.toLowerCase().includes(searchText.toLowerCase()) ||
            moment(quotation.quotationDate).format('DD-MM-YYYY').includes(searchText) ||
            quotation.quot_ID.toLowerCase().includes(searchText.toLowerCase())
        );
    });

    const columns = [
        {
            title: 'Quotation ID',
            dataIndex: 'quot_ID',
            key: 'quot_ID',
        },
        {
            title: 'Company name',
            dataIndex: 'c_companyName',
            key: 'c_companyName',
        },
        {
            title: 'Comments',
            dataIndex: 'comments',
            key: 'comments',
        },
        {
            title: 'Final Amount',
            dataIndex: 'finalAmount',
            key: 'finalAmount',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'Pending', value: 'Pending' },
                { text: 'Approved', value: 'Approved' },
                { text: 'Rejected', value: 'Rejected' },
            ],
            onFilter: (value, record) => record.status.includes(value),
        },
        {
            title: 'Created Date',
            dataIndex: 'quotationDate',
            key: 'quotationDate',
            render: (text) => moment(text).format('DD-MM-YYYY'),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button type="primary" onClick={() => handleViewClick(record)}>
                    View Details
                </Button>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh', background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)' }}>
            <Content style={{ padding: '20px' }}>
                <div className="quotation-list-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <Title level={4} style={{ margin: 0 }}>Quotation List</Title>
                        <Button type="primary" style={{ padding: '0 20px' }} onClick={() => setIsCreateModalVisible(true)}>
                            Create Quotation
                        </Button>
                    </div>
                    <Input
                        placeholder="Search Quotations"
                        value={searchText}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ marginBottom: '16px', width: '300px' }}
                        prefix={<SearchOutlined />}
                    />
                    {loading === 'loading' ? (
                        <Spin tip="Loading..." />
                    ) : !filteredQuotations || filteredQuotations.length === 0 ? (
                        <Empty description="No Quotations Available" />
                    ) : (
                        <Table
                            dataSource={filteredQuotations}
                            columns={columns}
                            rowKey="quotationId"
                            pagination={false}
                        />
                    )}

                    {/* Quotation Details Modal */}
                    <QuotationDetailsModal
                        visible={isDetailsModalVisible}
                        onClose={handleDetailsModalClose}
                        quotation={selectedQuotation}
                    />

                    {/* Create Quotation Form Modal */}
                    <CreateQuotationFormModal
                        visible={isCreateModalVisible}
                        onClose={handleCreateModalClose}
                        onSuccess={handleCreateQuotationSuccess}
                    />
                </div>
            </Content>
        </Layout>
    );
};

export default Quotations;
