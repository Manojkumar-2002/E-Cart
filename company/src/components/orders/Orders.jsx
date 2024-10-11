// src/YourComponent.js
import React, { useEffect } from 'react';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
    const { orders, loading, error, getOrdersByCompanyId, updateOrder } = useOrder();
    const { id } = useAuth();

    useEffect(() => {
        getOrdersByCompanyId(id);
    }, []);

    const handleUpdateOrder = async (orderId, updateData) => {
        const message = await updateOrder(orderId, updateData);
        if (message) {
            console.log(message);
        }
    };

    if (loading) return <p className="text-center text-lg text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-600">{error}</p>;

    return (
        <div className="container mx-auto parent-cont mb-4 ">
            <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Orders</h2>
            <div className="">
                {orders.map((order) => (
                    <div key={order._id} className="bg-white shadow-md rounded-lg p-4">
                        <div className="mb-4 text-center">
                            <h4 className="text-lg font-semibold text-gray-800">Order ID: {order._id}</h4>
                            <h4 className="text-md font-semibold text-gray-600">Total Price: ₹{order.total_price}</h4>
                            <h4 className="text-md font-semibold text-gray-600">Status: {order.status}</h4>
                        </div>
                        <div className="mb-4">
                            {order.products.map((product, index) => (
                                <div key={index} className="text-gray-800 p-2 border rounded-md shadow-sm bg-gray-50">
                                    <p className="font-medium text-center">Product Name: {product.product_name}</p>
                                    <p className="text-center">Price: ₹{product.price}</p>
                                    <p className="text-center">Quantity: {product.quantity} | Total Price: ₹{product.total_price}</p>
                                </div>
                            ))}
                        </div>
                        
                        <div className="row mx-auto text-center">
                            
                            <div className='col-md-6'><button 
                                className="btn btn-danger px-4 py-2 rounded hover:bg-red-600 transition" 
                                onClick={() => handleUpdateOrder(order._id, { status: 'Cancelled' })}
                            >
                                Cancel Order
                            </button></div>
                           <div className='col-md-6'> <button 
                                className="btn btn-primary px-4 py-2 rounded hover:bg-green-600 transition" 
                                onClick={() => handleUpdateOrder(order._id, { status: 'Shipped' })}
                            >
                                Accept Order
                            </button></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
