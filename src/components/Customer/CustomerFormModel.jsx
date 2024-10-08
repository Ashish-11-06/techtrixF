import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch, Button, Row, Col } from 'antd';

const CustomerFormModal = ({ visible, onCancel, onFinish, initialValues, mode, customerId }) => {
    const [form] = Form.useForm(); // Create form instance

    // Reset the form when the modal opens in "add" mode
    useEffect(() => {
        if (visible && mode === 'add') {
            form.resetFields(); // Reset all fields if it's in "add" mode
        } else if (visible && mode === 'edit') {
            form.setFieldsValue(initialValues); // Set the form fields to the initial values for editing
        }
    }, [visible, mode, initialValues, form]);

    return (
        <Modal
            title={mode === 'edit' ? 'Edit Customer' : 'Add Customer'}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={800} // Set the modal width
            centered // Center the modal vertically // Optional: adjust the top position of the modal
        >
            <Form
                form={form} // Assign form instance
                onFinish={(values) => {
                    // Pass the customer ID if it's an edit operation
                    const finalValues = mode === 'edit' ? { ...values, customerId } : values;
                    onFinish(finalValues);
                    form.resetFields(); // Reset form after submit
                }}
                style={{ maxWidth: '100%' }} // Make the form take the full width of the modal
            >
                <Row gutter={24}> {/* Set gutter for spacing between columns */}
                    <Col span={12}> {/* First column */}
                        <Form.Item label="First Name" name="FirstName" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}> {/* Second column */}
                        <Form.Item label="Last Name" name="LastName" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Email" name="Email" rules={[{ required: true, type: 'email' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Phone" name="PhoneNumber" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Address" name="Address">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="City" name="City">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="State" name="StateCode">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Zip Code" name="ZipCode">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Country Code" name="CountryCode">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Active" name="IsActive" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Premium Customer" name="isPremium" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>
                <Button type="primary" htmlType="submit">
                    {mode === 'edit' ? 'Update' : 'Add'}
                </Button>
            </Form>
        </Modal>
    );
};

export default CustomerFormModal;
