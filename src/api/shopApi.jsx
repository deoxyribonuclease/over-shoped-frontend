import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export const fetchShopById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/shops/${id}`);
        const data = response.data;

        return {
            shopId: data.id,
            shopName: data.name || "Назва не вказана",
            ownerId: data.userId || null,
            description: data.description || "Немає опису.",
            phone: data.phoneNumber || "Номер телефону не вказано",
            email: data.email || "Електронна пошта не вказана",
            linkedShopId: data.shopId || null,
        };
    } catch (error) {
        console.error("Error fetching shop:", error);
        throw error;
    }
};


export const fetchAllShops = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/shops`);
        const shops = response.data;

        return shops.map(shop => ({
            shopId: shop.id,
            shopName: shop.name || "Назва не вказана",
        }));
    } catch (error) {
        console.error("Error fetching shops:", error);
        throw error;
    }
};

export const fetchShopsByUserId = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/shops/user/${userId}`);
        const shop = response.data;
        console.log("Shops API response:", response.data);
        // Перевіряємо, чи відповідає shop очікуваному формату
        if (!shop || typeof shop !== "object") {
            throw new Error("Invalid shop data");
        }

        return {
            shopId: shop.id,
            shopName: shop.name || "Назва не вказана",
            description: shop.description || "Немає опису",
            phone: shop.phoneNumber || "Номер телефону не вказано",
            email: shop.email || "Електронна пошта не вказана",
            createdAt: shop.createdAt,
            updatedAt: shop.updatedAt,
            linkedShopId: shop.shopId || null
        };
    } catch (error) {
        console.error("Error fetching shop by user ID:", error);
        throw error;
    }
};



export const createShop = async (shopData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/shops`, shopData);
        return response.data;
    } catch (error) {
        console.error("Error creating shop:", error);
        throw error;
    }
};

export const updateShop = async (shopId, updatedData) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/shops/${shopId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error("Error updating shop:", error);
        throw error;
    }
};


export const deleteShop = async (shopId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/shops/${shopId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting shop:", error);
        throw error;
    }
};
