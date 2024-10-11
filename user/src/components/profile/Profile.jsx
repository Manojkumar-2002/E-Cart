import React, { useEffect, useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { Button, Card, Spinner, Alert, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { userProfile, loading, error, updateUserProfile } = useProfile();
    const [isEditing, setIsEditing] = useState(false);
    const { logout } = useAuth();
    const [updatedData, setUpdatedData] = useState({
        name: '',
        email: '',
        phone: '',
        address: {
            country: '',
            state: '',
            city: '',
            street: '',
            zip_code: ''
        }
    });

    useEffect(() => {
        if (userProfile) {
            setUpdatedData(userProfile); // Initialize updatedData with userProfile
        }
    }, []);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1]; // Get the field name after "address."
            setUpdatedData((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setUpdatedData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleUpdate = () => {
        updateUserProfile(updatedData);
        setIsEditing(false); // Exit editing mode after update
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Alert variant="danger">{error}</Alert>
            </div>
        );
    }

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Card style={{ width: '25rem' }} className="shadow">
                <Card.Body>
                    <Card.Title className="text-center">{isEditing ? 'Edit Profile' : userProfile?.name}</Card.Title>
                    
                    {isEditing ? (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="name" 
                                    value={updatedData.name} 
                                    onChange={handleChange} 
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    name="email" 
                                    value={updatedData.email} 
                                    onChange={handleChange} 
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="phone" 
                                    value={updatedData.phone} 
                                    onChange={handleChange} 
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Country</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="address.country" 
                                    value={updatedData.address.country} 
                                    onChange={handleChange} 
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>State</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="address.state" 
                                    value={updatedData.address.state} 
                                    onChange={handleChange} 
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>City</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="address.city" 
                                    value={updatedData.address.city} 
                                    onChange={handleChange} 
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Street</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="address.street" 
                                    value={updatedData.address.street} 
                                    onChange={handleChange} 
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Zip Code</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="address.zip_code" 
                                    value={updatedData.address.zip_code} 
                                    onChange={handleChange} 
                                />
                            </Form.Group>
                            <div className="d-grid gap-2">
                                <Button variant="primary" onClick={handleUpdate}>Update Profile</Button>
                                <Button variant="secondary" onClick={handleEditToggle}>Cancel</Button>
                            </div>
                        </Form>
                    ) : (
                        <>
                            <Card.Text className="text-center">
                                <strong>Email:</strong> {userProfile?.email}
                            </Card.Text>
                            <Card.Text className="text-center">
                                <strong>Phone:</strong> {userProfile?.phone}
                            </Card.Text>
                            <Card.Text className="text-center">
                                <strong>Country:</strong> {userProfile?.address.country}
                            </Card.Text>
                            <Card.Text className="text-center">
                                <strong>State:</strong> {userProfile?.address.state}
                            </Card.Text>
                            <Card.Text className="text-center">
                                <strong>City:</strong> {userProfile?.address.city}
                            </Card.Text>
                            <Card.Text className="text-center">
                                <strong>Street:</strong> {userProfile?.address.street}
                            </Card.Text>
                            <Card.Text className="text-center">
                                <strong>Zip Code:</strong> {userProfile?.address.zip_code}
                            </Card.Text>
                            <div className="d-grid gap-2">
                                <Button variant="secondary" onClick={handleEditToggle}>Edit Profile</Button>
                            </div>
                            <div className="d-grid gap-2 mt-1">
                                <Button variant="secondary" onClick={logout}>logout</Button>
                            </div>
                        </>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default Profile;
