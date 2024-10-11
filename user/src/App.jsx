import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/inc/Navbar';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Home from './components/Home';
import { AuthProvider } from './components/context/AuthContext';
import { ProductProvider } from './components/context/ProductContext';
import ProductDetail from './components/products/ProductDetail';
import { CartProvider } from './components/context/CartContext';
import CartPage from './components/cart/CartPage';
import { ProfileProvider } from './components/context/ProfileContext';
import Profile from './components/profile/Profile';
import { OrderProvider } from './components/context/OrderContext';
import Orders from './components/orders/Orders';



const App = () => {
  return (
    <>
      <Router>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <OrderProvider>
              <ProfileProvider>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/cart/" element={<CartPage />} />
                  <Route path="/profile" element={<Profile/>} />
                  <Route path="/orders" element={<Orders/>} />
                </Routes>
              </ProfileProvider>
              </OrderProvider>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </Router>
    </>
  );
};

export default App;
