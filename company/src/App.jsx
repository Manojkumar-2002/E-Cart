import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Home from './components/Home';
import Navbar from './components/inc/Navbar';
import { AuthProvider } from './components/context/AuthContext';
import Register from './components/auth/Register';
import { ProductProvider } from './components/context/ProductContext';
import AddProduct from './components/products/AddProduct';
import Profile from './components/profile/Profile';
import { ProfileProvider } from './components/context/ProfileContext';
import { OrderProvider } from './components/context/OrderContext';
import Orders from './components/orders/Orders';
import ProductDetail from './components/products/ProductDetail';


const App = () => {
  return (
    <>
      <Router>
        <AuthProvider>
          <ProductProvider>
            <ProfileProvider>
              <OrderProvider>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/addProduct" element={<AddProduct />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/product/:productId" element={<ProductDetail />} />
                </Routes>
              </OrderProvider>
            </ProfileProvider>
          </ProductProvider>
        </AuthProvider>
      </Router>
    </>
  );
};

export default App;
