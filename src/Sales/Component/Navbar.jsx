import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import { AppstoreOutlined, UserOutlined, MailOutlined, DollarOutlined } from '@ant-design/icons';

const SalesNavbar = () => {
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState(location.pathname);

    const getMenuKey = () => {
        const { pathname } = location;

        // Normalize the pathname to lowercase for consistent comparison
        const normalizedPath = pathname.toLowerCase();

        // Map multiple paths or queries to the same key
        if (normalizedPath === '/tickets' || normalizedPath === '/ticketsservice') {
            return '/Tickets';
        }
        return pathname; // Default to the pathname
    };

    useEffect(() => {
        setSelectedKey(getMenuKey());
    }, [location]);

    const handleClick = (e) => {
        setSelectedKey(e.key);
    };

    return (
        <div
            style={{
                background: 'linear-gradient(to left, #a1c4fd, #c2e9fb)',
                padding: '10px',
                marginTop: '10px',
                minHeight: '100vh', // Ensures full vertical height
            }}
        >
            <Menu
                mode="vertical"
                className="navbar"
                selectedKeys={[selectedKey]}
                onClick={handleClick}
                theme="light"
                style={{ border: 'none' }} // Remove default border for a cleaner look
            >
                <Menu.Item key="/" icon={<AppstoreOutlined />}>
                    <Link to="/">Home</Link>
                </Menu.Item>

                <Menu.Item key="/Tickets" icon={<MailOutlined />}>
                    <Link to="/Tickets">Tickets</Link>
                </Menu.Item>

                <Menu.Item key="/Quotations" icon={<DollarOutlined />}>
                    <Link to="/Quotations">Quotations</Link>
                </Menu.Item>

                <Menu.Item key="/ProfilePage" icon={<UserOutlined />}>
                    <Link to="/ProfilePage">My profile</Link>
                </Menu.Item>
            </Menu>
        </div>
    );
};

export default SalesNavbar;
