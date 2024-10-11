// src/context/OrderContext.js
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const OrderContext = createContext();

export const useOrder = () => {
    return useContext(OrderContext);
};

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch orders by company ID
    const getOrdersByCompanyId = async (companyId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:5000/api/orders/company/${companyId}`);
            setOrders(response.data); // Assuming response.data is the array of orders
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    // Update an existing order
    const updateOrder = async (orderId, updateData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put(`http://localhost:5000/api/orders/${orderId}`, updateData);
            setOrders((prevOrders) => 
                prevOrders.map((order) => (order._id === orderId ? { ...order, ...updateData } : order))
            );
            return response.data.message; // Assuming the response contains a message
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <OrderContext.Provider
            value={{
                orders,
                error,
                loading,
                getOrdersByCompanyId,
                updateOrder,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};
