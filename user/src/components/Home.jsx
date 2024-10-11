import React, { useEffect } from 'react';
import { useAuth } from './context/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import Products from './products/Products';

const Home = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login'); 
    }
  }, [token, navigate]);


  if (!token) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container mt-4'>
      <Products />
    </div>
  );
};

export default Home;
