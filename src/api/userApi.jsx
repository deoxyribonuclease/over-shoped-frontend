import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const getAuthTokenFromCookies = () => {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');
    const authTokenCookie = cookies.find(row => row.startsWith('authToken='));
    return authTokenCookie ? authTokenCookie.split('=')[1] : null;
};

export const registerUser = async (email, password, name) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, {
             email: email, password: password, name: name
        });
        console.log(response);
        return response.data;
    } catch (error) {
        console.error("Error register user:", error);
        throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: email, password: password
        });
        console.log(response);
        return response.data;
    } catch (error) {
        console.error("Error register user:", error);
        throw error;
    }
};

export const getUserById = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/${userId}`,);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
};

export const getUserImageId = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/${userId}/image`, {
            responseType: 'blob'
        });

        if (response.data && response.data.size > 0) {
            const imageUrl = URL.createObjectURL(response.data);
            return imageUrl;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching user image:", error);
        return null;  // В разі помилки також повертаємо null
    }
};
