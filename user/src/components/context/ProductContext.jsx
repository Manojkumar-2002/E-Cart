import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) return; // Exit if no token

      try {
        const response = await axios.get('http://localhost:5000/api/products/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched Products:", response.data); // Log fetched products
        setProducts(response.data);
      } catch (err) {
        console.error('Fetch Products Error:', err); // Log any fetch errors
        setError(err.response ? err.response.data.error : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  return (
    <ProductContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  return useContext(ProductContext);
};
