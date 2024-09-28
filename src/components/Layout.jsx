// src/components/Layout.js
import React from 'react';
import { Layout } from 'antd';
import { useLocation } from 'react-router-dom';
import CustomHeader from './Header/Header'; // Updated header import
import Sidebar from './Navbar/Navbar'; // Sidebar component

const { Content, Sider } = Layout;

const LayoutComponent = ({ children }) => {
    const location = useLocation();
    const hideSidebarRoutes = ['/login', '/forgot-password', '/register'];
    const isSidebarHidden = hideSidebarRoutes.includes(location.pathname);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Fixed Header with higher z-index */}
            <CustomHeader />
            <Layout style={{ marginTop: 64 }}> {/* Ensure content starts below the header */}
                {!isSidebarHidden && (
                    <Sider width={200} style={{ position: 'fixed', top: 64, left: 0, height: 'calc(100% - 64px)', background: '#fff', zIndex: 1 }}>
                        <Sidebar />
                    </Sider>
                )}
                <Layout style={{ marginLeft: isSidebarHidden ? 0 : 200 }}>
                    <Content style={{ padding: '10px', background: '#fff', marginTop: 0 }}> {/* Reset marginTop to 0 */}
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default LayoutComponent;
