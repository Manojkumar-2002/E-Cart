import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; 
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const { token } = useAuth(); 
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart,successMessage} = useCart(); 


    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                });
                setProduct(response.data);
            } catch (err) {
                setError(err.response ? err.response.data.error : 'Failed to fetch product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, token]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="container">
            {successMessage && <div className="alert alert-success">{successMessage}</div>} {/* Success message */}
            {product && (
                <div className="card text-center">
                    <div className="card-body">
                        <h5 className="card-title">{product.product_name}</h5>
                        <p className="card-text">{product.description}</p>
                        <p className="card-text">${product.price}</p>
                        <button className="btn btn-success">Buy</button>
                        <button className="btn btn-warning" onClick={()=>addToCart(product._id)}>Add to Cart</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
