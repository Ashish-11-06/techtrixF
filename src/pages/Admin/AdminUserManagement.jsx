import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Card, Typography, Button, Table, Modal } from 'antd';
import { fetchUsers } from '../../redux/slices/userSlice';
import CreateUserForm from '../../components/User/CreateUserForm';

const { Content } = Layout;
const { Title } = Typography;

const AdminUserManagement = () => {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.users.users);
    const status = useSelector((state) => state.users.status);
    const error = useSelector((state) => state.users.error);
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUser , setSelectedUser ] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'));
    const userRole = user.role;

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

     // Filter users to exclude those with the role of "Admin"
     const filteredUsers = users.filter(user => user.role === userRole);

    const columns = [
        {
            title: 'User  ID',
            dataIndex: 'userId',
            key: 'userid',
        },
        {
            title: 'Full Name',
            key: 'fullName',
            render: (record) => `${record.firstName} ${record.lastName}`,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive) => (isActive ? 'Active' : 'Inactive'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button onClick={() => handleEdit(record)}>Edit</Button>
            ),
        },
    ];

    const showModal = () => {
        setSelectedUser (null);
        setIsModalVisible(true);
    };

    const handleEdit = (user) => {
        setSelectedUser (user);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedUser (null);
    };

    return (
        <Layout style={{ minHeight: '100vh', background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)' }}>
        <Content style={{ padding: '20px' }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                }}
            >
                <Title level={4} style={{ margin: 0 }}>
                    User Management
                </Title>
                <Button type="primary" 
                onClick={() => {
                    console.log('clicked');
                    setSelectedUser(null);
                    showModal();
                }}
                >Create User</Button>
            </div>
            <Card bordered={false}>
                    <Table
                        columns={columns}
                        dataSource={filteredUsers}
                        rowKey="userId"
                        loading={status === 'loading'}
                        pagination={{ pageSize: 10 }}
                    />
                </Card>
                <Modal
                    title={selectedUser  ? "Edit User" : "Create User"}
                    open={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <CreateUserForm user={selectedUser } onClose={handleCancel} />
                </Modal>
            </Content>
        </Layout>
    );
};

export default AdminUserManagement;