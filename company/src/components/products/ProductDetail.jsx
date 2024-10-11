// src/components/ProductDetail.js
import React, { useEffect, useState } from 'react';
import { useProduct } from '../context/ProductContext';
import { useParams, useNavigate } from 'react-router-dom';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai'; // Add icons for edit and delete

const ProductDetail = () => {
    const { productId } = useParams(); // Get productId from the URL parameters
    const { product, getProduct, updateProduct, deleteProduct, loading, error } = useProduct();
    const [updatedData, setUpdatedData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        getProduct(productId);
    }, [productId]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        await updateProduct(productId, updatedData);
        navigate('/'); // Redirect to the products list after update
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(productId);
            navigate('/');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData((prev) => ({ ...prev, [name]: value }));
    };

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!product) return <p className="text-center text-gray-500">Product not found</p>;

    return (
        <div className="parent-cont">
            <div className="mx-auto rounded-lg text-center">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">Product Details</h2>

                <div className="border border-gray-200 rounded-lg p-6 mb-6">
                    <h3 className="text-2xl font-semibold mb-2">{product.product_name}</h3>
                    <p className="text-lg  mb-1">
                        Price: <span className="text-green-600 font-bold">₹{product.price}</span>
                    </p>
                    <p className="text-lg ">
                        Description: <span className="font-semibold">{product.description}</span>
                    </p>
                </div>

                <form onSubmit={handleUpdate} className="mb-6">
                    <h3 className="text-2xl font-semibold mb-4">Update Product</h3>
                    <div className="mb-4">
                        <label className="block font-medium mb-2" htmlFor="product_name">
                            Product Name
                        </label>
                        <input
                            type="text"
                            name="product_name"
                            defaultValue={product.product_name}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-medium mb-2" htmlFor="price">
                            Price
                        </label>
                        <input
                            type="number"
                            name="price"
                            defaultValue={product.price}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg "
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-600 font-medium mb-2" htmlFor="description">
                            Description
                        </label>
                        <input
                            type="text"
                            name="description"
                            defaultValue={product.description}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                    </div>
                    <div className='mt-2 justify-content-between mx-auto'>
                    
                    <button
                        onClick={handleDelete}
                        className="flex items-center btn btn-danger text-white rounded-lg"
                    >
                        <AiFillDelete className="mr-2" /> Delete
                    </button>
                    <button
                        type="submit"
                        className="flex items-center btn btn-primary text-white  rounded-lg"
                    >
                        <AiFillEdit className="mr-2" /> Update
                    </button>
                    </div>
                </form>


            </div>
        </div>
    );
};

export default ProductDetail;
