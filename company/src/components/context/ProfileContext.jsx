// src/context/ProfileContext.js
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const ProfileContext = createContext();

export const useProfile = () => {
    return useContext(ProfileContext);
};

export const ProfileProvider = ({ children }) => {
    const [companyProfile, setCompanyProfile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);


    const getCompanyProfile = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:5000/api/profile/company/${id}`);
            setCompanyProfile(response.data);
        } catch (err) {
            setError(err.response.data.error || 'Failed to fetch company profile');
        } finally {
            setLoading(false);
        }
    };

    const updateCompanyProfile = async (id, data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put(`http://localhost:5000/api/profile/company/${id}`, data);
            setCompanyProfile(response.data.user); 
            return response.data.message;
        } catch (err) {
            setError(err.response.data.error || 'Failed to update company profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProfileContext.Provider
            value={{
                companyProfile,
                error,
                loading,
                getCompanyProfile,
                updateCompanyProfile,
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};
