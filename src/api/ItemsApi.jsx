
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export const getPaginatedProducts = async (page, limit) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/products`, {
            params: { page, limit }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};


export const fetchProductById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    const data = response.data;

    return {
        productId: data.id,
        shopId: data.shopId || "Компанія за замовчуванням",
        productName: data.name,
        productDescription: data.description || "Немає опису.",
        productPrice: data.price || 0,
        isOnSale: data.discountPercentage > 0,
        salePercent: data.discountPercentage / 100 || 0,
        amount: data.stock || 0,
        images: data.images || [],
        rating: data.rating || null, // Add the rating here
    };
};

export const fetchProductProperties = async (productId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/products/properties/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product properties:", error);
        throw error;
    }
};




