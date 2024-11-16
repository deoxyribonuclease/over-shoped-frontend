import React, { useState } from "react";
import TimedAlert from "./TimedAlert.jsx";

const ShopForm = ({ shop, userId, onCreate, onUpdate, onDelete }) => {
    const [formData, setFormData] = useState({
        name: shop?.shopName || "",
        description: shop?.description || "",
        phoneNumber: shop?.phone || "",
        email: shop?.email || "",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userId) {
            const storeData = {
                ...formData,
                userId,
            };

            try {
                if (shop) {
                    await onUpdate(storeData);
                } else {
                    await onCreate(storeData);
                }
                setIsEditing(false);
                setIsCreating(false);
            } catch (error) {
                console.error("Помилка під час збереження магазину:", error);
            }
        } else {
            console.error("ID користувача відсутній");
        }
    };


    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setIsCreating(false);
        setFormData({
            name: shop?.shopName || "",
            description: shop?.description || "",
            phoneNumber: shop?.phone || "",
            email: shop?.email || "",
        });
    };

    const handleCreateClick = () => {
        setIsCreating(true);
        setIsEditing(true);
    };

    const handleDeleteClick = () => {
        onDelete();
    };

    return (
        <div>
            {!shop && !isCreating && (
                <div className="no-container">
                    <p className="no-shop">Немає магазину?</p>
                    <button className="no-shop-button" onClick={handleCreateClick}>Створити</button>
                </div>
            )}

            {(shop || isCreating) && (
                <form onSubmit={handleSubmit}>
                    <label>
                        Назва:
                        {isEditing ? (
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        ) : (
                            <span>{formData.name}</span>
                        )}
                    </label>
                    <label>
                        Опис:
                        {isEditing ? (
                            <textarea
                                style={{minHeight: "150px"}}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        ) : (
                            <span>{formData.description}</span>
                        )}
                    </label>
                    <label>
                        Телефон:
                        {isEditing ? (
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        ) : (
                            <span>{formData.phoneNumber}</span>
                        )}
                    </label>
                    <label>
                        Електронна пошта:
                        {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        ) : (
                            <span>{formData.email}</span>
                        )}
                    </label>

                    <div className="product-item-actions">
                        {isEditing ? (
                            <>
                                <button type="submit" className="product-item-edit-button-shop">{shop ? "Оновити" : "Створити"}</button>
                                <button type="button" className="product-item-delete-button-shop" onClick={handleCancelClick}>
                                    Відмінити
                                </button>
                            </>
                        ) : (
                            <button type="button" className="product-item-edit-button-shop" onClick={handleEditClick}>
                                Редагувати
                            </button>
                        )}


                        {shop && !isEditing && (
                            <button type="button" className="product-item-delete-button-shop" onClick={handleDeleteClick}>
                                Видалити
                            </button>
                        )}
                    </div>
                </form>
                )}
        </div>
    );
};

export default ShopForm;
