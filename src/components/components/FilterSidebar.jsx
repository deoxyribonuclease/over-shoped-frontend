import React, { useState, useEffect } from "react";
import ProductGrid from "./ProductGrid.jsx";
import '../styles/filtersidebar.css';
import MultiRangeSlider from "./MultiRangeSlider.jsx";
import { fetchAllShops } from '../../api/shopApi';
import { fetchCategories, fetchCategoryProperties } from "../../api/searchApi.jsx";

function FilterSidebar({ isShowing, onSortChange }) {
    const [selectedShopIds, setSelectedShopIds] = useState([]);  // Замість назв зберігаємо ID
    const [selectedCategoryId, setSelectedCategoryId] = useState("");  // ID для категорії
    const [selectedProductTypes, setSelectedProductTypes] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [isShopCollapsed, setIsShopCollapsed] = useState(false);
    const [isCategoryCollapsed, setIsCategoryCollapsed] = useState(false);
    const [isPriceCollapsed, setIsPriceCollapsed] = useState(false);
    const [isRatingCollapsed, setIsRatingCollapsed] = useState(false);
    const [isPropertiesCollapsed, setIsPropertiesCollapsed] = useState(false);

    const [shops, setShops] = useState([]);
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([]);
    const [selectedProperties, setSelectedProperties] = useState([]); // Для обраних властивостей

    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
    const [ratingRange, setRatingRange] = useState({ min: 0, max: 5 });  // Додано стан для рейтингу

    useEffect(() => {
        const loadData = async () => {
            try {
                const shopResponse = await fetchAllShops();
                setShops(shopResponse.map(shop => ({ shopId: shop.shopId, name: shop.shopName })));

                const categoryResponse = await fetchCategories();
                setCategories(categoryResponse.map(category => ({ id: category.id, name: category.name })));
            } catch (error) {
                console.error("Помилка завантаження даних:", error);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        const loadProperties = async () => {
            if (selectedCategoryId) {
                try {
                    const propertiesResponse = await fetchCategoryProperties(selectedCategoryId);
                    setProperties(propertiesResponse);
                } catch (error) {
                    console.error("Помилка завантаження властивостей категорії:", error);
                }
            }
        };

        loadProperties();
    }, [selectedCategoryId]);

    const toggleShopSelection = (shopId) => {
        setSelectedShopIds((prev) => {
            if (prev.includes(shopId)) {
                return prev.filter((id) => id !== shopId);
            } else {
                return [...prev, shopId];
            }
        });
    };

    const handleSortChange = (event) => {
        const value = event.target.value;
        setSelectedOrder(value);
        onSortChange(value);
    };


    const handleCategoryChange = (categoryId) => {
        setSelectedCategoryId(categoryId);
        setSelectedProperties([]); // Очищуємо обрані властивості при зміні категорії
    };

    const togglePropertyValue = (propertyName, value) => {
        setSelectedProperties((prevSelected) => {
            const updatedProperties = [...prevSelected];
            const propertyIndex = updatedProperties.findIndex((p) => p.name === propertyName);

            if (propertyIndex === -1) {
                updatedProperties.push({ name: propertyName, values: [value] });
            } else {
                const values = updatedProperties[propertyIndex].values;
                if (values.includes(value)) {
                    updatedProperties[propertyIndex].values = values.filter((v) => v !== value);
                } else {
                    updatedProperties[propertyIndex].values = [...values, value];
                }
            }

            return updatedProperties.filter((prop) => prop.values.length > 0);
        });
    };

    const handlePriceChange = (min, max) => {
        setPriceRange({ min, max });
    };

    const handleRatingChange = (min, max) => {
        setRatingRange({ min, max });
    };

    const filters = {
        shopId: selectedShopIds,
        categoryId: selectedCategoryId,
        priceRange: priceRange,
        ratingRange: ratingRange,
        properties: selectedProperties,
        orderBy: selectedOrder || 'null',
        page: 1,
        itemsPerPage: 16
    };

    const resetFilters = () => {
        setSelectedShopIds([]);
        setSelectedCategoryId("");
        setSelectedProductTypes([]);
        setSelectedOrder(null);
        setSelectedProperties([]);
        setPriceRange({ min: 0, max: 10000 });
        setRatingRange({ min: 0, max: 5 });
        window.location.reload()
    };

    return (
        <div className="container">
            <aside className={`sidebar ${isShowing ? "show" : ""}`}>
                <h3 onClick={() => setIsShopCollapsed(!isShopCollapsed)}>
                    Магазини {isShopCollapsed ? "▲" : "▼"}
                </h3>
                <ul
                    style={{
                        backgroundColor: "#525870",
                        maxHeight: isShopCollapsed ? '0px' : '250px',
                        overflowY: 'auto',
                        transition: 'max-height 0.3s ease',
                    }}
                >
                    {shops.map((shop, index) => (
                        <li key={index}>
                            <label className="custom-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedShopIds.includes(shop.shopId)}
                                    onChange={() => toggleShopSelection(shop.shopId)}
                                />
                                <span className="checkmark"></span>
                                {shop.name}
                            </label>
                        </li>
                    ))}
                </ul>

                <div className="separator"></div>

                <h3 onClick={() => setIsCategoryCollapsed(!isCategoryCollapsed)}>
                    Категорії {isCategoryCollapsed ? "▲" : "▼"}
                </h3>
                <ul
                    style={{
                        backgroundColor: "#525870",
                        maxHeight: isCategoryCollapsed ? '0px' : '250px',
                        overflowY: 'auto',
                        transition: 'max-height 0.3s ease',
                    }}
                >
                    {categories.map((category, index) => (
                        <li key={index}>
                            <label className="custom-radio">
                                <input
                                    type="radio"
                                    name="category"
                                    checked={selectedCategoryId === category.id}
                                    onChange={() => handleCategoryChange(category.id)}
                                />
                                {category.name}
                            </label>
                        </li>
                    ))}
                </ul

                >

                <div className="separator"></div>

                <h3 onClick={() => setIsPriceCollapsed(!isPriceCollapsed)}>
                    Ціна {isPriceCollapsed ? "▲" : "▼"}
                </h3>
                <ul style={{maxHeight: isPriceCollapsed ? 0 : 100, zIndex: 5, position: 'relative'}}>
                    <MultiRangeSlider
                        min={0}
                        max={10000}
                        onChange={({min, max}) => handlePriceChange(min, max)}
                    />
                </ul>


                <h3 onClick={() => setIsRatingCollapsed(!isRatingCollapsed)}>
                    Рейтинг {isRatingCollapsed ? "▲" : "▼"}
                </h3>
                <ul style={{maxHeight: isRatingCollapsed ? 0 : 100, zIndex: 5, position: 'relative'}}>
                    <MultiRangeSlider
                        min={0}
                        max={5}
                        onChange={({min, max}) => handleRatingChange(min, max)} // Змінюємо функцію
                    />


                </ul>

                <div className="separator"></div>

                <h3 onClick={() => setIsPropertiesCollapsed(!isPropertiesCollapsed)}>
                    Характеристики {isPropertiesCollapsed ? "▲" : "▼"}
                </h3>
                <ul
                    style={{
                        backgroundColor: "#525870",
                        maxHeight: isPropertiesCollapsed ? '0px' : '260px',
                        overflowY: 'auto',
                        transition: 'max-height 0.3s ease',
                    }}
                >
                    {properties.map((property, index) => (
                        <div key={index}>
                            <h4>{property.name}</h4>
                            <h5>
                                {property.values.map((value, valueIndex) => (
                                    <li key={valueIndex} style={{paddingBottom: "7px"}}>
                                        <label className="custom-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    selectedProperties.find((p) => p.name === property.name)?.values.includes(value) || false
                                                }
                                                onChange={() => togglePropertyValue(property.name, value)}
                                            />
                                            <span className="checkmark"></span>
                                            {value}
                                        </label>
                                    </li>
                                ))}
                            </h5>
                        </div>
                    ))}
                </ul>

                <div className="separator"></div>

                <button onClick={resetFilters} className="reset-button">Скинути фільтри</button>
            </aside>

            <div className="main-content">
                <div className="sorting">
                    <label>
                        Сортувати за:
                        <select className="selector" onChange={handleSortChange} value={selectedOrder}>
                            <option value="price_asc">Від дешевих до дорогих</option>
                            <option value="price_desc">Від дорогих до дешевих</option>
                            <option value="rating_asc">Рейтинг ↑</option>
                            <option value="rating_desc">Рейтинг ↓</option>
                            <option value='null'>Без</option>
                        </select>
                    </label>
                </div>

                <ProductGrid
                    filters={filters}
                    selectedShopIds={selectedShopIds}
                    selectedProductTypes={selectedProductTypes}
                    selectedProperties={selectedProperties}
                />
            </div>
        </div>
    );
}

export default FilterSidebar;
