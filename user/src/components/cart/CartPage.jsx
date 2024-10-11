import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';

const CartPage = () => {
    const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart, clearCart, loading, error } = useCart();
    const { user } = useAuth();
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const { addOrder, loading: orderLoading, error: orderError, orders } = useOrder();

    if (loading) {
        return <p className="text-center cart-text-color">Loading cart...</p>; // Centered loading text with primary color
    }

    if (error) {
        return <p className="text-danger text-center">Error: {error}</p>; // Centered error message with danger color
    }

    console.log("cart",cartItems);

    const handleClearCart = async () => {
        try {
            await clearCart(user.id);
            setSuccessMessage('Cart cleared successfully!');
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
        } catch (err) {
            setErrorMessage('Failed to clear cart'); // Changed error message for clarity
            setTimeout(() => {
                setErrorMessage(null);
            }, 3000);
        }
    };

    const handlePlaceOrder = async () => {
        try {
            await addOrder(); // Call the addOrder function from OrderContext
            setSuccessMessage('Order placed successfully!');
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
        } catch (err) {
            setErrorMessage('Failed to place order'); // Optional: Customize error handling
            setTimeout(() => {
                setErrorMessage(null);
            }, 3000);
        }
    };


    return (
        <div className="container mt-5 parent-cont">
            <h1 className="text-center mb-4 cart-text-color">Your Cart</h1> {/* Changed header color */}
            {cartItems.length === 0 ? (
                <div className="text-center cart-text-color">
                    <p>Your cart is empty.</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th className="text-light parent">Product</th>
                                <th className="text-light parent">Quantity</th>
                                <th className="text-light parent">Price</th>
                                <th className="text-light parent">Total</th>
                                <th className="text-light parent">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map(item => (
                                <tr key={item._id}>
                                    <td>{item.product_details.product_name}</td>
                                    <td>{Number(item.quantity)}</td>
                                    <td>${Number(item.product_details.price).toFixed(2)}</td>
                                    <td>${Number(item.total_price).toFixed(2)}</td>
                                    <td>
                                        <div className="btn-group" role="group">
                                            <button
                                                className="btn btn-outline-secondary btn-sm"
                                                onClick={() => decreaseQuantity(item._id)}
                                                disabled={item.quantity === 1}
                                            >
                                                -
                                            </button>
                                            <button
                                                className="btn btn-outline-secondary btn-sm"
                                                onClick={() => increaseQuantity(item._id)}
                                            >
                                                +
                                            </button>
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => removeFromCart(item._id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {cartItems.length > 0 && (
                <div className="justify-content-center text-center mt-0">
                    <h3 className="text-success bg-white">
                        Total: ${cartItems.reduce((total, item) => total + item.total_price, 0).toFixed(2)}
                    </h3>
                    <div className='row mt-4'>
                        <div className="col-md-6">
                            <button className="btn btn-danger" onClick={handleClearCart}>Clear Cart</button> {/* Button to clear cart */}
                        </div>
                        <div className="col-md-6">
                            <button className="btn btn-primary" onClick={handlePlaceOrder}>{orderLoading ? 'Placing Order...' : 'Place Order'}</button> {/* Button to place order */}
                        </div>

                    </div>
                </div>
            )}
            {successMessage && <p className="cart-text-color text-center">{successMessage}</p>} {/* Success message */}
            {errorMessage && <p className="text-danger text-center">{errorMessage}</p>} {/* Error message */}
        </div>
    );
};

export default CartPage;
