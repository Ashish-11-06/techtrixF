import React, { useState } from 'react';
import { Modal, Descriptions, Badge, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { DollarOutlined, ReloadOutlined } from '@ant-design/icons';
import UpdateTicketModal from './UpdateTicketModal'; // Importing the update ticket modal
import QuotationFormModal from '../Quotation/CreateQuotation';
import { useEffect } from 'react';
import { updateTicket } from '../../redux/slices/ticketSlice';

const TicketDetailsModal = ({ visible, ticket, onClose, onCreateQuotation, users }) => {
    const [isQuotationModalVisible, setQuotationModalVisible] = useState(false); // State to manage quotation modal visibility
    const [isUpdateModalVisible, setUpdateModalVisible] = useState(false); // State to manage update ticket modal visibility
    
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [createdById, setCreatedBy] = useState(''); // State variable to store createdById

    // Effect to run when the ticket is available
    useEffect(() => {
        if (ticket) {
            setCreatedBy(ticket.createdById); // Set createdById from ticket
        }
    }, [ticket]);

    // Function to update createdById field of the ticket
    const updateCreatedBy = () => {
        if (ticket) {
            // Update createdById variable
            setCreatedBy('new'); // Set createdById to 'new'
            message.success('Ticket createdById updated successfully!'); // Notify user
        }
    };
    
    console.log(users);
    const user = users.find((user) => user.userId === createdById); // Adjust based on your user object structure
    const createdByName = user ? `${user.firstName} ${user.lastName}` : createdById; // Display user name or fallback text


    // Function to open the create quotation modal
    const handleCreateQuotationClick = () => {
        setQuotationModalVisible(true); // Open the create quotation modal
    };

    const onUpdateTicket = (updatedTicket) => {
        dispatch(updateTicket(updatedTicket)); // Dispatch the update action
        message.success('Ticket updated successfully!');
    };

    // Function to close the create quotation modal
    const handleQuotationModalClose = () => {
        setQuotationModalVisible(false); // Close the create quotation modal
    };

    // Function to open the update ticket modal and pass the ticket data
    const handleUpdateTicketClick = () => {
        setUpdateModalVisible(true); // Open the update ticket modal
    };

    // Function to close the update ticket modal
    const handleUpdateModalClose = () => {
        setUpdateModalVisible(false); // Close the update ticket modal
    };

    const handleCreateQuotation = (quotationData) => {
        message.success('Quotation created successfully!');
        setIsCreateModalVisible(false); // Close the modal after creation
    };

    const handleCreateModalClose = () => {
        setIsCreateModalVisible(false);
    };

    return (
        <>
            {/* Main Ticket Details Modal */}
            <Modal
                title="Ticket Details"
                visible={visible}
                onCancel={onClose}
                footer={null}
                centered
                width={900}
            >
                {ticket ? (
                    <>
                        <Descriptions
                            bordered
                            size="middle"
                            title="Detailed Information"
                            column={2}
                            labelStyle={{ padding: '10px 24px' }}
                            contentStyle={{ padding: '10px 24px' }}
                        >
                            <Descriptions.Item label="Ticket ID" span={1}>{ticket.ticketId}</Descriptions.Item>
                            <Descriptions.Item label="title" span={1}>{ticket.title}</Descriptions.Item>
                            {ticket.customerId && (
                                <Descriptions.Item label="Customer ID" span={1}>{ticket.customerId}</Descriptions.Item>
                            )}
                            <Descriptions.Item label="Created By" span={1}>{createdByName}</Descriptions.Item>
                            <Descriptions.Item label="Remark" span={2}>{ticket.description}</Descriptions.Item>
                            <Descriptions.Item label="status" span={1}>
                                <Badge status={ticket.status === 'Resolved' ? 'success' : 'processing'} text={ticket.status} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Created Date" span={1}>{new Date(ticket.createdDate).toLocaleString()}</Descriptions.Item>
                            <Descriptions.Item label="Resolved" span={1}>{ticket.isResolved ? 'Yes' : 'No'}</Descriptions.Item>
                            <Descriptions.Item label="Is Chargeable" span={1}>{ticket.isChargeable ? 'Yes' : 'No'}</Descriptions.Item>
                      {/* <Descriptions.Item label="Isqqq" span={1}>{ticket.isQuotationCreated ? 'Yes' : 'No'}</Descriptions.Item> */}
                            <Descriptions.Item label="Assigned To" span={1}>{ticket.assignedTo ? ticket.assignedTo : 'Not Assigned'}</Descriptions.Item>
                           
                           {ticket.isChargeable && (
                            <Descriptions.Item label="is Quoatation Created" span={1}>{ticket.isQuotationCreated ? 'Created' : 'Not created'}</Descriptions.Item>
                           )}
                            
                        </Descriptions>
                        {ticket.status !== 'closed' && (
                        <div style={{ marginTop: '20px', textAlign: 'right' }}>
                            {/* Update Ticket Button */}
                          
                                <Button 
                                    type="primary" 
                                    onClick={handleUpdateTicketClick} 
                                    style={{ marginRight: '10px' }}
                                    icon={<ReloadOutlined />}
                                >
                                    Update Ticket
                                </Button>
                                 {/* Render the Create Quotation button if isChargeable is true */}
                            {!ticket.isQuotationCreated && ticket.isChargeable &&(
                                <Button 
                                    type="primary" 
                                    onClick={() => setIsCreateModalVisible(true)}  // Open the Create Quotation modal
                                    icon={<DollarOutlined />}
                                >
                                    Create Quotation
                                </Button>
                            )}
                        </div>


                            )}

                           
                    </>
                ) : (
                    <p>No ticket details available</p>
                )}
            </Modal>

            {/* Create Quotation Modal */}
            <QuotationFormModal 
                ticketId={ticket && ticket.ticketId} 
                defaultCustomer={ticket && ticket.customerId} 
                title="Create Quotation"
                visible={isCreateModalVisible}
                onCreate={handleCreateQuotation}
                onClose={handleCreateModalClose} 
                footer={null}
                centered
            />

            {/* Update Ticket Modal */}
            <UpdateTicketModal
                ticketData={ticket} // Pass the current ticket data for updating
                isVisible={isUpdateModalVisible}
                onUpdate={(updatedTicket) => {
                    onUpdateTicket(updatedTicket);
                    handleUpdateModalClose();
                    onClose(); // Close the TicketDetailsModal 
                }}
                onCancel={handleUpdateModalClose}
                onClose={onClose}
            />
        </>
    );
};

export default TicketDetailsModal;
