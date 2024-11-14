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

