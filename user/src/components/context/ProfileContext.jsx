// context/ProfileContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; 

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const { user } = useAuth(); // Access user from AuthContext
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateLocalStorage = (updatedData) => {
        const existingData = localStorage.getItem('user');
    
        if (existingData) {
            // Parse existing data
            const userData = JSON.parse(existingData);
            
            // Update user data with new values
            const newUserData = { ...userData, ...updatedData };
            
            // Save the updated user data back to local storage
            localStorage.setItem('user', JSON.stringify(newUserData));
        } else {
            // If no existing data, save the new data directly
            localStorage.setItem('user', JSON.stringify(updatedData));
        }
    };

    // Function to fetch user profile
    const getUserProfile = async () => {
        if (!user) return; // Ensure user is available

        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/profile/${user.id}`); // Use user._id
            setUserProfile(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch user profile');
        } finally {
            setLoading(false);
        }
    };

    // Function to update user profile
    const updateUserProfile = async (profileData) => {
        if (!user) return; // Ensure user is available

        setLoading(true);
        try {
            await axios.put(`http://localhost:5000/api/profile/${user.id}`, profileData); // Use user._id
            // Update local state after a successful update
            setUserProfile((prevProfile) => ({
                ...prevProfile,
                ...profileData,
            }));
            updateLocalStorage(profileData);
            
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update user profile');
        } finally {
            setLoading(false);

        }
    };

    useEffect(() => {
        getUserProfile(); // Fetch user profile when user changes
    }, [user]); // Re-fetch profile when the user changes

    return (
        <ProfileContext.Provider value={{ userProfile, loading, error, updateUserProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    return useContext(ProfileContext);
};
