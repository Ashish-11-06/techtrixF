// src/components/Header/Header.js
import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { Layout, Typography, Space, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/slices/loginSlice'; // Adjust the path as necessary
import { LogoutOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Text } = Typography;

const CustomHeader = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Retrieve and parse user data from localStorage
    const user = JSON.parse(localStorage.getItem('user')); // Get user from local storage
    const userName = user ? user.firstName : ''; // Adjust based on the actual field name in your user object
    // console.log(user); // Log the user object for debugging

    const [isHovered, setIsHovered] = useState(false);

 

    // Function to handle logout
    const handleLogout = () => {
        dispatch(logoutUser()); // Dispatch the logout action to Redux
        navigate('/login');
    };

   const buttonStyle = {
        backgroundColor: isHovered ? 'darkred' : 'orangered', // Change color on hover
        borderColor: isHovered ? 'darkred' : 'red', // Change border color on hover
        color: 'white', // Text color
        borderRadius: '15px', // Optional: add border radius
    };

    return (
        <Header style={{ 
            background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)',
            padding: '0 16px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            position: 'fixed', 
            width: '100%', 
            zIndex: 10 // Ensure header stays above all other content
        }}>
            <Text strong style={{ fontSize: '18px' }}>
                TickTool
            </Text>
            {user && ( // Conditionally render Space if user exists
                <Space>
                    Welcome,
                    <Link 
                        to="/ProfilePage" // Link to the profile page
                        style={{ textDecoration: 'none', color: '', fontWeight: 'bold' }} // Custom styling
                    >
                        {userName}
                    </Link>
                    ji! {/* Display the logged-in user's name */}
                    <Button 
                        type="danger" 
                        icon={<LogoutOutlined />} 
                        style={buttonStyle} // Custom red color
                        onClick={handleLogout}
                        onMouseEnter={() => setIsHovered(true)} // Set hover state to true
                        onMouseLeave={() => setIsHovered(false)} // Set hover state to false
                    />
                </Space>
            )}
        </Header>
    );
};

export default CustomHeader;
