import React, { useState }from 'react';
import { useProducts } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';


const Products = () => {
    const { products, loading, error } = useProducts();
    const [cartError, setCartError] = useState(null);
    const navigate = useNavigate();
    const { addToCart, successMessage} = useCart();

    const handleCardClick = (id) => {
        navigate(`/products/${id}`); 
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="container parent-cont">
            <div className="row">
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
                {Array.isArray(products) && products.length > 0 ? (
                    products.map(product => (
                        <div key={product._id} className="col-md-4 col-lg-3 d-flex justify-content-center mb-2 p-0">
                            <div className="card text-center mb-0" style={{ width: '18rem' }} >
                                <div className="card-body parent rounded">
                                    <h5 className="card-title link-infom text-color" onClick={() => handleCardClick(product._id)}>{product.product_name}</h5>
                                    <p className="card-text text-color">${product.price}</p>
                                    <div className="d-flex justify-content-between ">
                                        <button className="btn btn-success ">Buy</button>
                                        <button className="btn btn-warning " onClick={() => addToCart(product._id)}>Add to Cart</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No products available.</p>
                )}
            </div>
        </div>
    );
};

export default Products;
