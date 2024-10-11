import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Adjust the path as needed

const ProductContext = createContext();

export const useProduct = () => {
  return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
  const { token } = useAuth(); // Get token from AuthContext
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to get products by company_id
  const getProductsByCompany = async (companyId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/products/company/${companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      setProducts(response.data);
      console.log(response.data);
      setError(null);
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  // Function to add a new product
  const addProduct = async (productData) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/products/add', productData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      setProducts((prev) => [...prev, response.data]);
      setError(null);
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Error adding product');
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a product by product_id
  const deleteProduct = async (productId) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      setProducts((prev) => prev.filter((product) => product._id !== productId));
      setError(null);
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Error deleting product');
    } finally {
      setLoading(false);
    }
  };

  // Function to update a product by product_id
  const updateProduct = async (productId, updatedData) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/products/${productId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      setProducts((prev) =>
        prev.map((product) =>
          product._id === productId ? { ...product, ...updatedData } : product
        )
      );
      setError(null);
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Error updating product');
    } finally {
      setLoading(false);
    }
  };

  // Function to get a single product by product_id
  const getProduct = async (productId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      setProduct(response.data);
      setError(null);
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Error fetching product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        product,
        getProductsByCompany,
        addProduct,
        deleteProduct,
        updateProduct,
        getProduct,
        loading,
        error,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
