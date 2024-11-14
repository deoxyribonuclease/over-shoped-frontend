import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export const fetchCategories = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/search/categories`);
        const categories = response.data;

        return categories.map(category => ({
            id: category.id,
            name: category.name || "Назва не вказана",
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
        }));
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

export const fetchCategoryProperties = async (categoryId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/search/properties/${categoryId}`);
        const properties = response.data;

        return properties.map(property => ({
            name: property.name || "Назва не вказана",
            values: property.values || []
        }));
    } catch (error) {
        console.error(`Error fetching properties for category ${categoryId}:`, error);
        throw error;
    }
};

export const searchProducts = async (filters) => {
    try {
        console.log(filters);

        const params = {};
        if (filters.shopId && filters.shopId.length > 0) {
            params.shopIds = JSON.stringify({ "ids": filters.shopId });
        }
        if (filters.categoryId) {
            params.categoryId = filters.categoryId;
        }
        if (filters.priceRange && (filters.priceRange.min || filters.priceRange.max)) {
            params.priceRange = JSON.stringify(filters.priceRange);
        }
        if (filters.ratingRange && (filters.ratingRange.min || filters.ratingRange.max)) {
            params.ratingRange = JSON.stringify(filters.ratingRange);
        }
        if (filters.orderBy) {
            params.orderBy = filters.orderBy;
        }
        if (filters.properties && filters.properties.length > 0) {
            let str = JSON.stringify(filters.properties);
            str = str.replace(/[{}]/g, '');
            str = str.slice(0, 1)  + '{'+ str.slice(1, str.length - 1) + '}' + str.slice(str.length - 1);
            params.properties = str;
        }
        console.log()

        params.page = filters.page || 1;
        params.pageSize = filters.pageSize || 16;
        const response = await axios.get(`${API_BASE_URL}/search/`, { params });

        return response.data;
    } catch (error) {
        console.error("Error searching for products:", error);
        throw new Error("Error while searching products. Please try again later.");
    }
};

export const searchProductsByText = async (searchText, page, pageSize) => {
    try {
        if (!searchText) {
            throw new Error("Search text is required");
        }

        const response = await axios.get(`${API_BASE_URL}/search/contains/${searchText}`, {
            params: {
                page,
                pageSize
            }
        });

        return response.data;
    } catch (error) {
        console.error(`Error searching for products by text "${searchText}":`, error);
        throw new Error("Error while searching products by text. Please try again later.");
    }
};










