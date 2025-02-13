import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Table, notification, Row, Col, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addQuotaionProduct, updateQuotation } from '../../redux/slices/quotationSlice';
import { updateQuotationProduct, deleteQuotationProduct, addProduct } from '../../redux/slices/productSlice';
import ProductFormModal from '../Product/AddProduct';

const EditQuotationModal = ({ visible, quotation, onClose, products }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [productList, setProductList] = useState([]);
    const [addProductVisible, setAddProductVisible] = useState(false); // State for ProductFormModal visibility

    const [quotationProducts, setQuotationProducts] = useState();


    const { nonCustomerProducts: productsStorage } = useSelector((state) => state.products);

    useEffect(() => {
        if (quotation) {
            form.setFieldsValue({
                customerId: quotation.c_customerId,
                status: quotation.status,
                delivery: quotation.delivery,
                payment: quotation.payment,
                warrantyOrSupport: quotation.warrantyOrSupport,
                transport: quotation.transport,
                comments: quotation.comments
            });
            setProductList(products);
            setQuotationProducts(quotation.quotationProducts);
        }
    }, [quotation, form]);

    const handleFinish = async (values) => {
        try {
            // Ensure validity is an integer
            values.validity = parseInt(values.validity, 10);

            // First, update all products before updating the quotation
            for (const product of productList) {
                // Validate the product data
                if (product.quantity < 1) {
                    notification.error({ message: 'Quantity must be at least 1!' });
                    return;
                }

                if (product.price < 1) {
                    notification.error({ message: 'Price must be at least 1!' });
                    return;
                }

                // Dispatch the update action for each product
                await dispatch(updateQuotationProduct({
                    quotationId: quotation.quotationId,
                    productId: product.productId,
                    updatedProduct: product
                }));
            }

            // After updating products, update the quotation itself
            const updatedQuotationData = {
                ...quotation,
                ...values,
            };

            await dispatch(updateQuotation({ quotationId: quotation.quotationId, data: updatedQuotationData }));
            notification.success({ message: 'Quotation updated successfully!' });

            onClose(); // Close the modal
        } catch (error) {
            console.error('Error updating quotation:', error);
            notification.error({ message: 'Failed to update quotation.' });
        }
    };

    const handleDeleteProduct = (productId) => {
        // console.log('Deleting product:', productId);
        const foundProduct = quotationProducts.find(item => item.productId === productId);
        // console.log('Found Product:', foundProduct);
        // console.log('quotationProducts:', quotationProducts);
        const quotationProductId = foundProduct.quotationProductId;

        Modal.confirm({
            title: 'Are you sure you want to delete this product?',
            content: 'This action cannot be undone.',
            onOk: async () => {
                try {
                    await dispatch(deleteQuotationProduct(quotationProductId));
                    setProductList((prevProducts) => prevProducts.filter(prod => prod.productId !== productId));
                    notification.success({ message: 'Product deleted successfully!' });
                } catch (error) {
                    console.error('Error deleting product:', error);
                    notification.error({ message: 'Failed to delete product.' });
                }
            },
        });
    };

    const calculateTotalAmount = () => {
        return productList.reduce((total, product) => {
            const quantity = product.quantity ? product.quantity : 1;
            const gstAmount = (product.price * quantity * (product.gst / 100));
            const totalAmount = (product.price * quantity) + gstAmount;
            return total + totalAmount;
        }, 0).toFixed(2);
    };

    const handleInputChange = (productId, field, value) => {
        setProductList(prevProducts => prevProducts.map(prod => {
            if (prod.productId === productId) {
                return { ...prod, [field]: value ? parseFloat(value) : 0 };
            }
            return prod;
        }));
    };

    const productColumns = [
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
            render: (text, record) => (
                <Input.TextArea
                    value={record.brand}
                    onChange={(e) => setProductList(prevProducts => prevProducts.map(prod => prod.productId === record.productId ? { ...prod, brand: e.target.value } : prod))}
                    style={{ minHeight: '50px', maxHeight: '100px' }} // Set min and max height
                    autoSize={{ minRows: 2, maxRows: 4 }} // Automatically adjust height based on content
                />
            ),
        },
        {
            title: 'Model No',
            dataIndex: 'modelNo',
            key: 'modelNo',
            render: (text, record) => (
                <Input.TextArea
                    value={record.modelNo}
                    onChange={(e) => setProductList(prevProducts => prevProducts.map(prod => prod.productId === record.productId ? { ...prod, modelNo: e.target.value } : prod))}
                    style={{ minHeight: '50px', maxHeight: '100px' }} // Set min and max height
                    autoSize={{ minRows: 2, maxRows: 4 }} // Automatically adjust height based on content
                />
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text, record) => (
                <Input.TextArea
                    value={record.description}
                    onChange={(e) => setProductList(prevProducts => prevProducts.map(prod => prod.productId === record.productId ? { ...prod, description: e.target.value } : prod))}
                    style={{ minHeight: '50px', maxHeight: '100px' }} // Set min and max height
                    autoSize={{ minRows: 2, maxRows: 4 }} // Automatically adjust height based on content
                />
            ),
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 80,
            render: (text, record) => (
                <Input
                    type="text" // Change type to "text" to remove up/down arrows
                    value={record.quantity}
                    onChange={(e) => handleInputChange(record.productId, 'quantity', e.target.value)}
                />
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: 120,
            render: (text, record) => (
                <Input
                    type="text" // Change type to "text" to remove up/down arrows
                    value={record.price}
                    onChange={(e) => handleInputChange(record.productId, 'price', e.target.value)}
                />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 200,
            render: (_, product) => (
                <Button type="link" danger onClick={() => handleDeleteProduct(product.productId)}>
                    Delete
                </Button>
            ),
        },
    ];
    const handleAddProduct = () => {
        setAddProductVisible(true);
    };

    // console.log(quotation.c_customerId);

    const handleProductSelect = async (value) => {

        const selectedProduct = productsStorage.find(product => product.productId === value);

        const productData = {
            ...selectedProduct,
            customerId: quotation.c_customerId
        }

        dispatch(addProduct(productData))
            .unwrap() // Unwrap the promise to handle errors in a `catch` block
            .then((addedProduct) => {
                setProductList((prevProducts) => [...prevProducts, addedProduct]);
                if (quotation) {
                    const quotationProductsData = [{
                        quotationId: quotation.quotationId,
                        productId: addedProduct.productId,
                    }];


                    dispatch(addQuotaionProduct(quotationProductsData)).unwrap().then(() => {
                        dispatch(getQuotationById(quotation.quotationId)).unwrap().then((response) => {
                            setQuotationProducts(response.quotationProducts);
                        });
                    });
                }
            })
            .catch((error) => {
                setLoading(false);
                console.error("Error adding product:", error);
                // Handle error (e.g., show toast notification)
            });



        // const selectedProduct = productsStorage.find(product => product.productId === value);
        // if (selectedProduct) {
        //     const productWithKey = { ...selectedProduct, key: Date.now() }; // Add a unique key for rendering
        //     setAddedProducts(prev => [...prev, productWithKey]); // Add the selected product to addedProducts
        //     // console.log(addedProducts);
        //     notification.success({ message: 'Product added successfully!' });
        // }
    };

    return (
        <Modal
            title="Update Quotation"
            open={visible}
            onCancel={onClose}
            footer={null}
            centered
            width={900}
        >
            <Form form={form} onFinish={handleFinish} layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Delivery" name="delivery">
                            <Input placeholder="Enter delivery details" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Payment" name="payment">
                            <Input placeholder="Enter payment details" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Warranty/Support" name="warrantyOrSupport">
                            <Input placeholder="Enter warranty/support details" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Transport" name="transport">
                            <Input placeholder="Enter transport details" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={11} style={{ paddingRight: '10px' }}>
                        <Form.Item label="Comment" name="comments">
                            <Input.TextArea placeholder="Enter comment" rows={2} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Validity (in days)"
                            name="validity"
                            rules={[
                                {
                                    required: true, // Ensures the field is not empty
                                    message: 'Please enter validity in days!',
                                },
                                {
                                    validator: (_, value) => {
                                        if (value <= 0) {
                                            return Promise.reject('Validity cannot be negative/zero!');
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <Input type="number" placeholder="Enter validity in days" />
                        </Form.Item>
                    </Col>
                </Row>
                <h3>Products</h3>
                <Table
                    columns={productColumns}
                    dataSource={productList}
                    rowKey="productId"
                    pagination={false}
                    bordered
                    size="small"
                    summary={() => (
                        <Table.Summary.Row>
                            <Table.Summary.Cell colSpan={4} align="right">
                                <strong>Total Amount:</strong>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell>
                                <strong>{calculateTotalAmount()}</strong>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
                <Button
                    type="primary"
                    style={{ backgroundColor: '#08ba00', borderColor: 'blue', marginTop: '20px' }}
                    onClick={handleAddProduct} // Ensure you have this function defined
                >
                    Add New Product
                </Button>

                <Form.Item label="Select Existing Product">
                    <Select
                        showSearch
                        optionFilterProp="label"
                        placeholder="Select a product"
                        onChange={handleProductSelect}
                        style={{ width: '100%' }}
                        dropdownStyle={{ maxHeight: 500, overflowY: 'auto' }} // Control dropdown height
                    >
                        {productsStorage && productsStorage.length > 0 ? (
                            productsStorage.map(product => (
                                <Select.Option
                                    style={{ width: '100%', color: 'black', border: '1px', padding: '10px', }}
                                    key={product.productId}
                                    value={product.productId}
                                    label={`${product.brand} || ${product.modelNo} || ₹${product.description}`}>
                                    {product.brand} || {product.modelNo} || ₹{product.description}
                                </Select.Option>
                            ))
                        ) : (
                            <Select.Option value="">No products found</Select.Option>
                        )}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
                        Update Quotation
                    </Button>
                </Form.Item>
            </Form>
            <ProductFormModal
                visible={addProductVisible}
                onCancel={() => setAddProductVisible(false)}
                product={null} // No pre-filled product for new product
                customerId={quotation ? quotation.c_customerId : null}
                onAddProduct={(product) => {
                    setProductList((prevProducts) => [...prevProducts, product]);
                    setAddProductVisible(false);

                }}
                onUpdatedQuotaion={(response) => {
                    setQuotationProducts(response.quotationProducts);
                    // console.log('Quotation Products:', response.quotationProducts);
                }}
                quotation={quotation}
            />
        </Modal>
    );
};

export default EditQuotationModal;
