import React, { useEffect } from "react";
import { useOrder } from "../context/OrderContext";

const Orders = () => {
  const { getOrders, orders, loading, error } = useOrder();

  useEffect(() => {
    getOrders(); // Fetch orders when the component mounts
  }, []); // Added getOrders to the dependency array

  console.log(orders);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto my-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 mb-4" // Added mb-4 for margin
            >
              <h4 className="text-center font-semibold">Products</h4>
              {order.products.map((product, index) => (
                <div key={index} className="text-gray-600 text-center"> {/* Centered product text */}
                  <p>Product Name: {product.product_name}</p>
                  <p>Price: ₹{product.price}</p>
                  <p>
                    Quantity: {product.quantity} | Total Price: ₹{product.total_price}
                  </p>
                  <hr />
                </div>
              ))}
              <p className="text-lg font-semibold text-center">Order ID: {order._id}</p>
              <p className="text-gray-700 text-center">Total Price: ₹{order.total_price}</p>
              <p className="text-gray-700 text-center">Status: {order.status}</p>
              <p className="text-md font-medium mt-2 text-center">Shipping Address:</p>
              <p className="text-center">
                {order.user_address?.street}, {order.user_address?.city}{" "}
                {order.user_address?.state} {order.user_address?.zip_code}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
