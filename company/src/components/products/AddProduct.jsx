import React, { useState } from 'react';
import { useProduct } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';

const AddProduct = () => {
    const { addProduct } = useProduct(); // Get addProduct function from context
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false); // State to manage loading
    const { id } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Resetting error and success messages
        setError(null);
        setSuccess(null);
        setLoading(true); // Set loading to true

        // Creating product data object
        const productData = {
            product_name: productName,
            price: parseFloat(price),
            description: description,
            company_id: id
        };

        try {
            await addProduct(productData); // Call the addProduct function
            setSuccess('Product added successfully!'); // Set success message
            // Resetting form fields
            setProductName('');
            setPrice('');
            setDescription('');
        } catch (err) {
            setError(err.message || 'An error occurred'); // Set error message
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="container mt-5 text-center parent-cont p-2">
            <h2>Add New Product</h2>
            {error && <p className="text-danger">{error}</p>}
            {success && <p className="text-success">{success}</p>}

            <form onSubmit={handleSubmit}>
                <div className='form-container'>
                    <div className="mb-3 row">
                        <label htmlFor="productName" className="form-label col-md-2"><strong>Product Name</strong></label>
                        <div className='col-md-10'>
                            <input
                                type="text"
                                id="productName"
                                className="form-control"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label htmlFor="price" className="form-label col-md-2"><strong>Price</strong></label>
                        <div className='col-md-10'>
                            <input
                                type="number"
                                id="price"
                                className="form-control"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label htmlFor="description" className="form-label col-md-2"><strong>Description</strong></label>
                        <div className='col-md-10'>
                            <textarea
                                id="description"
                                className="form-control"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                rows="3"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? 'Adding...' : 'Add Product'} {/* Change button text based on loading state */}
                        </button>
                    </div>
                </div>
            </form>

        </div>
    );
};

export default AddProduct;
