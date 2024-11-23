import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/userDashboard.css";
import PersonalInformation from "../../components/components/PersonalInformation.jsx";
import TimedAlert from "../../components/components/TimedAlert.jsx";

const UserDashboard = () => {
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [alertSeverity, setAlertSeverity] = useState('error');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const activeTabFromUrl = new URLSearchParams(location.search).get("tab") || "personal-information";
    const [activeTab, setActiveTab] = useState(activeTabFromUrl);

    useEffect(() => {
        const token = Cookies.get("authToken");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserId(decodedToken.user.id);
                setIsLoading(false);
            } catch (error) {
                console.error("Помилка при декодуванні токена:", error);
                setIsLoading(false);
            }
        } else {
            console.warn("Токен authToken не знайдено");
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        navigate(`?tab=${activeTab}`);
    }, [activeTab, navigate]);

    if (isLoading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Завантаження...</p>
            </div>
        );
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case "personal-information":
                return userId && <PersonalInformation userId={userId} setAlertSeverity={setAlertSeverity} setAlertMessage={setAlertMessage} setAlertOpen={setAlertOpen} />;
            case "orders":
                return <div>Замовлення</div>;
            case "cart":
                return <div>Кошик</div>;
            case "favorites":
                return <div>Улюблені</div>;
            case "my-review":
                return <div>Мої відгуки</div>;
            default:
                return <div>Виберіть вкладку</div>;
        }
    };

    return (
        <div className="user-dashboard-container">
            <div className="sidebar-user">
                <button
                    onClick={() => setActiveTab("personal-information")}
                    className={activeTab === "personal-information" ? "active" : ""}
                >
                    Аккаунт
                </button>
                <button
                    onClick={() => setActiveTab("orders")}
                    className={activeTab === "orders" ? "active" : ""}
                >
                    Замовлення
                </button>
                <button
                    onClick={() => setActiveTab("cart")}
                    className={activeTab === "cart" ? "active" : ""}
                >
                    Кошик
                </button>
                <button
                    onClick={() => setActiveTab("favorites")}
                    className={activeTab === "favorites" ? "active" : ""}
                >
                    Улюблені
                </button>
                <button
                    onClick={() => setActiveTab("my-review")}
                    className={activeTab === "my-review" ? "active" : ""}
                >
                    Мої відгуки
                </button>
            </div>
            <div className="content-user">
                {renderTabContent()}
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

export default UserDashboard;
