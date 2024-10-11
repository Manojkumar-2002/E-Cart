import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";  // Assuming you have an AuthContext for user authentication
import { useCart } from "./CartContext";  // Assuming you have a CartContext for managing products in the cart

const OrderContext = createContext();

export const useOrder = () => {
  return useContext(OrderContext);
};

export const OrderProvider = ({ children }) => {
  const { user } = useAuth(); // Get user details from AuthContext
  const { cartItems, clearCart } = useCart(); // Get cart items from CartContext
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);

  
  const groupProductsByCompany = (products) => {
    const grouped = products.reduce((acc, product) => {
      const { company_id, product_id, quantity, total_price } = product;
      const {price, product_name} = product.product_details;
      if (!acc[company_id]) {
        acc[company_id] = {
          company_id: company_id,
          products: [],
          total_price: 0
        };
      }
      acc[company_id].products.push({
        product_id,
        product_name,
        price,
        quantity,
        total_price
      });
      acc[company_id].total_price += total_price;
      return acc;
    }, {});
    return Object.values(grouped); // Return an array of company-based orders
  };

  // Function to create the order and send to backend
  const addOrder = async () => {
    if (!user) {
      setError("User must be logged in to place an order.");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const groupedOrders = groupProductsByCompany(cartItems);

    try {
      setLoading(true);
      setError(null);

      const requests = groupedOrders.map(async (order) => {
        const orderData = {
          user_id: user.id,
          company_id: order.company_id,
          products: order.products,
          total_price: order.total_price
        };
        const response = await axios.post("http://localhost:5000/api/orders/add", orderData);
        return response.data;
      });

      const createdOrders = await Promise.all(requests);
      setOrders((prevOrders) => [...prevOrders, ...createdOrders]);
      clearCart(); // Clear the cart after successful order placement
    } catch (err) {
      setError(err.response?.data?.error || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  const getOrders = async () => {
    if (!user) {
      setError("User must be logged in to retrieve orders.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`http://localhost:5000/api/orders/${user.id}`);
      setOrders(response.data);
      console.log(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to retrieve orders.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderContext.Provider value={{ addOrder, orders, loading, error, getOrders}}>
      {children}
    </OrderContext.Provider>
  );
};
