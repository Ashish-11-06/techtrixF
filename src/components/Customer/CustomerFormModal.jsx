import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch, Button, Row, Col, message } from 'antd';
import { useDispatch } from 'react-redux';
import { addCustomer, fetchCustomers, updateCustomer } from '../../redux/slices/customerSlice'; // Import your Redux actions
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CustomerFormModal = ({ visible, onCancel, initialValues, mode, customerId, onAddCustomer }) => {
    const [form] = Form.useForm(); // Create form instance
    const dispatch = useDispatch(); // Get the dispatch function
    const navigate = useNavigate(); // Get the navigate function

    const { customers } = useSelector((state) => state.customers);

    useEffect(() => {
    if (customers.length === 0 || !customers) {
        dispatch(fetchCustomers());
    }
    }, []);

    const existingCompanyNames = customers.map(customer => customer.companyName?.toLowerCase());
    const existingEmailIds = customers.map(customer => customer.email?.toLowerCase());

    // console.log(existingEmailIds);
    // console.log(existingCompanyNames);


    // Reset the form when the modal opens in "add" mode
    useEffect(() => {
        if (visible && mode === 'add') {
            form.resetFields(); // Reset all fields if it's in "add" mode
        } else if (visible && mode === 'edit') {
            form.setFieldsValue(initialValues); // Set the form fields to the initial values for editing
        }
    }, [visible, mode, initialValues, form]);

    const handleFormSubmit = (values) => {
        if (mode === 'edit') {
            // Update customer API call
            dispatch(updateCustomer({ customerId: customerId, updatedCustomer: values }))
                .then(() => {
                    message.success('Customer updated successfully!');
                    // Close the modal after successful update
                    onCancel();
                });
        } else {
            // Add customer API call
            dispatch(addCustomer(values))
                .then((resultAction) => {
                    if (addCustomer.fulfilled.match(resultAction)) {
                        const newCustomer = resultAction.payload;  // Get the newly added customer from the action payload
                        message.success('Customer added successfully!');
                        onCancel();  // Close modal

                        // Trigger the parent callback to inform about the new customer
                        if (onAddCustomer) {
                            onAddCustomer(newCustomer);
                        }
                    } else {
                        // console.log(resultAction);
                        message.error(resultAction.payload);
                    }
                });
        }
    };

    return (
        <Modal
            title={mode === 'edit' ? 'Edit Customer' : 'Add Customer'}
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={800} // Set the modal width
            centered // Center the modal vertically
        >
            <div style={{ border: '1px solid #d9d9d9', padding: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                <Form
                    form={form} // Assign form instance
                    onFinish={handleFormSubmit}
                    style={{ maxWidth: '100%' }} // Make the form take the full width of the modal
                >
                    <Row gutter={24}> {/* Set gutter for spacing between columns */}
                        <Col span={12}> {/* First column */}
                            <Form.Item
                                label="Company Name"
                                name="companyName"
                                rules={[
                                    { required: true, message: 'Please enter company name!' },
                                    ...(mode === 'edit'
                                        ? [] // Skip validator in edit mode
                                        : [
                                            {

                                                validator: (_, value) => {
                                                    if (value && existingCompanyNames.includes(value.toLowerCase())) {
                                                        return Promise.reject(new Error('This company name is already in use!'));
                                                    }
                                                    return Promise.resolve();
                                                }
                                            }
                                        ])
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Premium Customer" name="isPremium" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </Col>

                        <Col span={12}> {/* First column */}
                            <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Please enter first name!' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}> {/* Second column */}
                            <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Please enter last name!' }]}>
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="Address" name="address"
                                rules={[{ required: true, message: 'Please enter address!' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        {/* <Col span={12}>
                            <Form.Item label="Pin Code" name="zipCode"
                            rules={[
                                { required: true, message: 'Please input your zip code!' },
                                { pattern: /^[1-9][0-9]{5}$/, message: 'Pin code must be 6 digits and cannot start with 0.' },
                            ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col> */}



                        <Col span={12}>
                            <Form.Item label="Phone" name="phoneNumber"
                                rules={[
                                    { required: true, message: 'Please input phone number!' },
                                    { pattern: /^[0-9]{10}$/, message: 'Phone number must be 10 digits' },
                                ]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Please enter Email!' },
                                    { type: 'email', message: 'Please enter a valid email address!' }, // Email format validator
                                    ...(mode === 'edit'
                                        ? [] // Skip duplicate email check in edit mode
                                        : [
                                            {
                                                validator: (_, value) => {
                                                    if (value && existingEmailIds.includes(value.toLowerCase())) {
                                                        return Promise.reject(new Error('This Email is already in use!'));
                                                    }
                                                    return Promise.resolve();
                                                },
                                            },
                                        ]),
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                    </Row>
                    <div style={{ textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit">
                            {mode === 'edit' ? 'Update' : 'Add'}
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    );
};

export default CustomerFormModal;