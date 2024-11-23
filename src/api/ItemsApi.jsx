
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
        rating: data.rating || null,
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

export const createProduct = async (productData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/products`, productData);
        return response.data;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/products/${id}`, productData);
        return response.data;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/products/${id}`);
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
};

export const getAllProductProperties = async (productId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/products/properties/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product properties:", error);
        throw error;
    }
};



export const createProductProperty = async (productId, propertyData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/products/properties`, {
            productId,
            ...propertyData
        });
        return response.data;
    } catch (error) {
        console.error("Error creating product property:", error);
        throw error;
    }
};




export const updateProductProperty = async (productId, propertyId, propertyData) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/products/properties/${productId}/${propertyId}`, propertyData);
        return response.data;
    } catch (error) {
        console.error("Error updating product property:", error);
        throw error;
    }
};


export const deleteProductProperty = async (productId, propertyId) => {
    try {
        await axios.delete(`${API_BASE_URL}/products/properties/${productId}/${propertyId}`);
    } catch (error) {
        console.error("Error deleting product property:", error);
        throw error;
    }
};



