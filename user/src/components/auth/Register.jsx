import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip_code: '',
    country: ''
  });

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/register/user', {
        name,
        email,
        phone,
        password,
        address
      });
      console.log('Registration success:', response.data);

      // Clear all input fields after successful registration
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setAddress({
        street: '',
        city: '',
        state: '',
        zip_code: '',
        country: ''
      });

      // Redirect to login page
      navigate('/login');
      
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({ ...prevAddress, [name]: value }));
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6"> {/* Adjusted width for larger form */}
          <div className="card p-4 shadow">
            <h2 className="text-center mb-4">Register User</h2>
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name:</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email:</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone:</label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password:</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <h4 className="mb-3 text-center">Address Information</h4>
              <div className="mb-3">
                <label htmlFor="street" className="form-label">Street:</label>
                <input
                  type="text"
                  className="form-control"
                  id="street"
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="city" className="form-label">City:</label>
                <input
                  type="text"
                  className="form-control"
                  id="city"
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="state" className="form-label">State:</label>
                <input
                  type="text"
                  className="form-control"
                  id="state"
                  name="state"
                  value={address.state}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="zip_code" className="form-label">Zip Code:</label>
                <input
                  type="text"
                  className="form-control"
                  id="zip_code"
                  name="zip_code"
                  value={address.zip_code}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="country" className="form-label">Country:</label>
                <input
                  type="text"
                  className="form-control"
                  id="country"
                  name="country"
                  value={address.country}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Register</button>
            </form>
            <div className="text-center mt-3">
              <Link to="/login">
                <button className="btn btn-secondary w-100">Already Registered</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
