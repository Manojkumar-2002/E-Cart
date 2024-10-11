import React, { useEffect } from 'react';
import { useProduct } from './context/ProductContext';
import { useAuth } from './context/AuthContext'; // Import AuthContext to get id
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { getProductsByCompany, products, loading, error } = useProduct();
  const { id } = useAuth(); // Get company ID (this is the id passed to the context)
  const navigate = useNavigate();

  // Fetch products by company ID on component mount
  useEffect(() => {
    if (id) {
      getProductsByCompany(id); // Use the id from AuthContext
    }
  }, []); // Add id and the function as dependencies

  const handleCardClick = (id) => {
    navigate(`/product/${id}`); 
};

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {products.length === 0 ? (
        <p className="text-center">No products found.</p>
      ) : (
        <div className="container mt-4">
          <div className="row">
            {products.map((product) => (
              <div className="col-md-4 mb-4" key={product._id}>
                <div className="card text-center parent-cont" onClick={() => handleCardClick(product._id)}> {/* Centering text in the card */}
                  <div className="card-body">
                    <h5 className="card-title">{product.product_name}</h5>
                    <p className="card-text">Price: ₹{product.price}</p>
                    <p className="card-text">Description: {product.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
