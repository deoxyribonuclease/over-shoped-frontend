import axios from "axios";

const API_BASE_URL = "http://localhost:3000";


const getAuthTokenFromCookies = () => {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');
    const authTokenCookie = cookies.find(row => row.startsWith('authToken='));
    return authTokenCookie ? authTokenCookie.split('=')[1] : null;
};


export const addReview = async (userId, productId, text, rating) => {
    try {
        const token = getAuthTokenFromCookies();
        if (!token) {
            throw new Error("Authorization token not found in cookies");
        }

        const response = await axios.post(
            `${API_BASE_URL}/reviews/`,
            {
                userId,
                productId,
                text,
                rating,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log(response);
        return response.data;
    } catch (error) {
        console.error("Error adding review:", error);
        throw error;
    }
};

export const getReviewsByProductId = async (productId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/reviews/product/${productId}`);

        console.log(response);
        return response.data;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        throw error;
    }
};

export const editReview = async (userId, productId, text, rating) => {
    try {
        const token = getAuthTokenFromCookies();
        if (!token) {
            throw new Error("Authorization token not found in cookies");
        }

        const response = await axios.patch(
            `${API_BASE_URL}/reviews/${userId}/${productId}`,
            {
                text,
                rating,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log(response);
        return response.data;
    } catch (error) {
        console.error("Error editing review:", error);
        throw error;
    }
};

export const deleteReview = async (userId, productId) => {
    try {
        const token = getAuthTokenFromCookies();
        if (!token) {
            throw new Error("Authorization token not found in cookies");
        }

        const response = await axios.delete(
            `${API_BASE_URL}/reviews/${userId}/${productId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log(response);
        return response.data; // Повертаємо результат видалення
    } catch (error) {
        console.error("Error deleting review:", error);
        throw error;
    }
};