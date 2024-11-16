import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { fetchShopsByUserId, createShop, updateShop, deleteShop } from "../../api/shopApi";
import ShopForm from "../../components/components/ShopForm.jsx";
import ProductList from "../../components/components/ProductList.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/shopDashboard.css";
import TimedAlert from "../../components/components/TimedAlert.jsx";

const ShopDashboard = () => {
    const [shop, setShop] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();

    const activeTabFromUrl = new URLSearchParams(location.search).get("tab") || "info";
    const [activeTab, setActiveTab] = useState(activeTabFromUrl);
    const [alertSeverity, setAlertSeverity] = useState('error');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);

    useEffect(() => {
        const token = Cookies.get("authToken");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserId(decodedToken.user.id);
            } catch (error) {
                console.error("Помилка при декодуванні токена:", error);
            }
        } else {
            console.warn("Токен authToken не знайдено");
        }
    }, []);

    const fetchShopData = async () => {
        if (!userId) return;
        setIsLoading(true);
        try {
            const shops = await fetchShopsByUserId(userId);
            setShop(shops);
        } catch (error) {
            console.error("Помилка при завантаженні магазину:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!userId) return;

        fetchShopData();
    }, [userId]);

    useEffect(() => {
        navigate(`?tab=${activeTab}`);
    }, [activeTab, navigate]);

    const handleCreateShop = async (shopData) => {
        try {
            const newShop = await createShop(shopData);
            setShop(newShop);
            await fetchShopData();
            setAlertSeverity("success");
            setAlertMessage("Магазин успішно створено");
            setAlertOpen(true);
        } catch (error) {
            setAlertSeverity("error");
            setAlertMessage("Виникла помилка");
            setAlertOpen(true);
            console.error("Помилка створення магазину:", error);
        }
    };

    const handleUpdateShop = async (updatedData) => {
        try {
            const updatedShop = await updateShop(shop.shopId, updatedData);
            setShop(updatedShop);
            await fetchShopData();
            setAlertSeverity("success");
            setAlertMessage("Магазин успішно оновлено");
            setAlertOpen(true);
        } catch (error) {
            setAlertSeverity("error");
            setAlertMessage("Виникла помилка");
            setAlertOpen(true);
            console.error("Помилка оновлення магазину:", error);
        }
    };

    const handleDeleteShop = async () => {
        try {
            await deleteShop(shop.shopId);
            setShop(null);
            setAlertSeverity("success");
            setAlertMessage("Магазин успішно видалено");
            setAlertOpen(true);
        } catch (error) {
            setAlertSeverity("error");
            setAlertMessage("Виникла помилка");
            setAlertOpen(true);
            console.error("Помилка видалення магазину:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Завантаження...</p>
            </div>
        );
    }

    return (
        <div className="shop-dashboard-container">
            <div className="sidebar-shop">
                <button
                    onClick={() => setActiveTab("info")}
                    className={activeTab === "info" ? "active" : ""}
                >
                    Інформація про магазин
                </button>
                <button
                    onClick={() => setActiveTab("products")}
                    className={activeTab === "products" ? "active" : ""}
                >
                    Товари
                </button>
            </div>
            <div className="content-shop">
                {activeTab === "info" ? (
                    shop !== null ? (
                        <ShopForm
                            shop={shop}
                            userId={userId}
                            onUpdate={handleUpdateShop}
                            onDelete={handleDeleteShop}
                        />
                    ) : (
                        <ShopForm userId={userId} onCreate={handleCreateShop} />
                    )
                ) : (
                    <ProductList shopId={shop?.shopId} activeTab={activeTab} />
                )}
            </div>
            <TimedAlert
                alertOpen={alertOpen}
                alertSeverity={alertSeverity}
                alertMessage={alertMessage}
                handleCloseAlert={() => setAlertOpen(false)}
            />
        </div>
    );
};

export default ShopDashboard;
