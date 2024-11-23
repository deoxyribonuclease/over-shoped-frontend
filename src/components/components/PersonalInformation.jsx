import React, { useState, useEffect } from "react";
import "../styles/personalInformation.css";
import { updateUser, deleteUser, getUserById, getUserImageId } from "../../api/userApi.jsx";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";

const PersonalInformation = ({ userId, setAlertSeverity,setAlertMessage,setAlertOpen }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        phone: "",
        email: "",
        address: "",
        image: "",
    });

    useEffect(() => {
        if (userId) {
            getUserById(userId)
                .then(async (userData) => {
                    setUser(userData);
                    setFormData({
                        name: userData.name || "",
                        surname: userData.surname || "",
                        phone: userData.phone || "",
                        email: userData.email || "",
                        address: userData.address || "",
                        image: userData.image || "",
                    });
                    const userImage = await getUserImageId(userId);
                    setSelectedImage(userImage);
                })
        }
    }, [userId]);

    const handleCancelClick = async () => {
        if (user) {
            await reloadUserData();
        }
        setIsEditing(false);
    };

    const reloadUserData = async () => {
        try {
            const userData = await getUserById(userId);
            setUser(userData);
            setFormData({
                name: userData.name || "",
                surname: userData.surname || "",
                phone: userData.phone || "",
                email: userData.email || "",
                address: userData.address || "",
                image: userData.image || "",
            });
        } catch (error) {
            console.error("Помилка завантаження даних користувача:", error);
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value.slice(
                0,
                name === "phone" ? 16 : name === "email" || name === "address" ? 50 : 16
            ),
        });
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };



    const handleLogout = () => {
        Cookies.remove('authToken');
        navigate('/');
        window.location.reload();
    };

    const handleSaveClick = async () => {
        try {
            const updateData = new FormData();
            updateData.append("name", formData.name);
            updateData.append("surname", formData.surname);
            updateData.append("phone", formData.phone);
            updateData.append("email", formData.email);
            updateData.append("address", formData.address);

            if (selectedImage !== user.image) {
                const imageFile = document.querySelector('#image-upload').files[0];
                if (imageFile) {
                    updateData.append("image", imageFile);
                }
            }

            await updateUser(user.id, updateData);

            setAlertSeverity("success");
            setAlertMessage("Дані оновлено успішно!");
            setAlertOpen(true);
            setIsEditing(false);
            await reloadUserData();
        } catch (error) {
            setAlertSeverity("error");
            setAlertMessage("Не вдалося оновити дані.");
            setAlertOpen(true);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteClick = async () => {
        try {
            await deleteUser(user.id);
            setAlertSeverity("success");
            setAlertMessage("Аккаунт видалено успішно!");
            setAlertOpen(true);
        } catch (error) {
            setAlertSeverity("error");
            setAlertMessage("Не вдалося видалити аккаунт.");
            setAlertOpen(true);
        }
    };

    return (
        <div className="personal-info-container">
            <h1 className="title" style={{fontSize:"30px",color:"#737373FF", fontWeight:"700"}}>Особисті дані</h1>
            <div className="info-card">
                <div className="section">
                    <div className="image-container">
                        <img
                            src={selectedImage || "https://via.placeholder.com/100"}
                            alt="Фото користувача"
                            className={`profile-image ${isEditing ? "editable" : ""}`}
                        />
                        {isEditing && (
                            <>
                                <label htmlFor="image-upload" className="image-overlay">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="white"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="edit-icon"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15.232 5.232l3.536 3.536M9 11l7-7 3 3-7 7H9v-3z"
                                        />
                                    </svg>

                                </label>
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: "none" }}
                                />
                            </>
                        )}
                    </div>
                    <div>
                        <p className="name">
                            <strong>Ім'я:</strong>{" "}
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                user?.name || "Відсутнє"
                            )}
                        </p>
                        <p className="surname">
                            <strong>Прізвище:</strong>{" "}
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="surname"
                                    value={formData.surname}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                user?.surname || "Відсутнє"
                            )}
                        </p>
                    </div>
                </div>

                <div className="section">
                    <h3>Контакти</h3>
                    <p className="p-bottom">
                        <strong>Номер телефону:</strong>{" "}
                        {isEditing ? (
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        ) : (
                            user?.phone || "Відсутній"
                        )}
                    </p>
                    <p className="p-bottom">
                        <strong>Електронна пошта:</strong>{" "}
                        {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        ) : (
                            user?.email || "Відсутнє"
                        )}
                    </p>
                </div>

                <div className="section">
                    <h3>Адреса доставки</h3>
                    <p className="p-bottom">
                        <strong>Адреса:</strong>{" "}
                        {isEditing ? (
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                        ) : (
                            user?.address || "Відсутня"
                        )}
                    </p>
                </div>

                {isEditing ? (
                    <div className="action-buttons">
                        <button className="save-button" onClick={handleSaveClick}>
                            Зберегти
                        </button>
                        <button className="cancel-button" onClick={handleCancelClick}>
                            Відмінити
                        </button>
                    </div>
                ) : (
                    <button className="edit-button" onClick={handleEditClick}>
                        Редагувати
                    </button>
                )}
            </div>

            <div className="action-buttons">
                <button className="action-button">Змінити пароль</button>
                <button className="action-button" onClick={handleLogout}>Вийти з аккаунту</button>
                <button className="action-button delete-button" onClick={handleDeleteClick}>
                    Видалити аккаунт
                </button>
            </div>
        </div>
    );
};

export default PersonalInformation;
