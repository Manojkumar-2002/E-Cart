import React, { createContext, useState, useContext, useEffect} from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; 

const CartContext = createContext();

 

export const CartProvider = ({ children }) => {
    const { token, user } = useAuth(); 
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const fetchCart = async () => {
        if (!user || !user.id) return; // Ensure user and ID are present
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/cart/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCartItems(response.data);
        } catch (err) {
            setError(err.response ? err.response.data.error : 'Failed to fetch cart');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);
    

    const addToCart = async (productId, quantity = 1) => {
        if (!user || !user.id) return;
        setLoading(true);
        try {
            await axios.post(
                `http://localhost:5000/api/cart/add`,
                { user_id: user.id, product_id: productId, quantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSuccessMessage('Product added to cart successfully!'); 
            setTimeout(() => {
                setSuccessMessage(null); 
            }, 3000);
            // Fetch the updated cart after adding an item
            await fetchCart(); 
        } catch (err) {
            setError(err.response ? err.response.data.error : 'Failed to add to cart');
        } finally {
            setLoading(false);
        }
    };

    const increaseQuantity = async (cartItemId) => {
        try {
            await axios.put(`http://localhost:5000/api/cart/increase/${cartItemId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Fetch the updated cart after increasing the quantity
            await fetchCart();
        } catch (err) {
            setError(err.response ? err.response.data.error : 'Failed to increase quantity');
        }
    };

    const decreaseQuantity = async (cartItemId) => {
        const item = cartItems.find(item => item._id === cartItemId);
        if (item.quantity <= 1) return; // Prevent decreasing quantity below 1
        try {
            await axios.put(`http://localhost:5000/api/cart/decrease/${cartItemId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Fetch the updated cart after decreasing the quantity
            await fetchCart();
        } catch (err) {
            setError(err.response ? err.response.data.error : 'Failed to decrease quantity');
        }
    };

    const removeFromCart = async (cartItemId) => {
        try {
            await axios.delete(`http://localhost:5000/api/cart/delete/${cartItemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Fetch the updated cart after removing an item
            await fetchCart();
        } catch (err) {
            setError(err.response ? err.response.data.error : 'Failed to remove from cart');
        }
    };

    const clearCart = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/cart/clear/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCartItems([]); // Reset cartItems to empty
            // Fetch the updated cart after clearing
            await fetchCart();
        } catch (err) {
            setError(err.response ? err.response.data.error : 'Failed to clear cart');
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                fetchCart,
                addToCart,
                increaseQuantity,
                decreaseQuantity,
                removeFromCart,
                clearCart,
                loading,
                error,
                successMessage
            }}
        >
            {children}
        </CartContext.Provider>
    );
}; 

export const useCart = () => useContext(CartContext);
