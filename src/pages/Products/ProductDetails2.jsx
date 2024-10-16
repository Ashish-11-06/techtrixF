import React from 'react';
import { Modal, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const ProductDetailModal = ({ visible, product, onClose }) => {
    return (
        <Modal
            title="Product Details"
            visible={visible}
            onCancel={onClose}
            footer={null}
        >
            <Title level={2}>{product.brand} - {product.modelNo}</Title>
            <Paragraph><strong>Product ID:</strong> {product.id}</Paragraph>
            {/* Add more product details here */}
            <Paragraph><strong>Brand:</strong> {product.brand}</Paragraph>
            <Paragraph><strong>description:</strong> {product.description}</Paragraph>
            <Paragraph><strong>price:</strong> ₹ {product.price}</Paragraph>
            <Paragraph><strong>quantity:</strong> {product.quantity}</Paragraph>
            <Paragraph><strong>warrantyMonths:</strong> {product.warrantyMonths}</Paragraph>
            <Paragraph><strong>Model No:</strong> {product.modelNo}</Paragraph>
            <Paragraph><strong>hsnCode:</strong> {product.hsnCode}</Paragraph>
            <Paragraph><strong>Created Date:</strong> {new Date(product.created_date).toLocaleDateString()}</Paragraph> 
            {/* Add additional fields as necessary */}
        </Modal>
    );
};

export default ProductDetailModal;
