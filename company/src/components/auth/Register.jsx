import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [companyName, setCompanyName] = useState('');
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
      const response = await axios.post('http://localhost:5000/api/register/company', {
        company_name: companyName,
        email,
        phone,
        password,
        address 
      });
      console.log('Registration success:', response.data);
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
        <div className="col-md-6">
          <h2 className="text-center">Register Company</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label">Company Name:</label>
              <input
                type="text"
                className="form-control"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email:</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone:</label>
              <input
                type="tel"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password:</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <h4>Address Information</h4>
            <div className="mb-3">
              <label className="form-label">Street:</label>
              <input
                type="text"
                name="street"
                className="form-control"
                value={address.street}
                onChange={handleAddressChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">City:</label>
              <input
                type="text"
                name="city"
                className="form-control"
                value={address.city}
                onChange={handleAddressChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">State:</label>
              <input
                type="text"
                name="state"
                className="form-control"
                value={address.state}
                onChange={handleAddressChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Zip Code:</label>
              <input
                type="text"
                name="zip_code"
                className="form-control"
                value={address.zip_code}
                onChange={handleAddressChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Country:</label>
              <input
                type="text"
                name="country"
                className="form-control"
                value={address.country}
                onChange={handleAddressChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Register
            </button>
          </form>
          <Link to="/login">
            <button className="btn btn-secondary w-100" style={{ marginTop: '20px' }}>
              Already Registered
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
