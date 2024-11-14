import React, { useState, useEffect, useRef } from "react";
import ProductGrid from "./ProductGrid.jsx";
import '../styles/filtersidebar.css';
import MultiRangeSlider from "./MultiRangeSlider.jsx";
import axios from "axios"; // Імпортуємо axios для роботи з API
import { fetchAllShops } from '../../api/shopApi'; // Імпортуємо функцію для отримання магазинів

const productTypes = ["Техніка", "Продовольчі товари", "Інше"];

function FilterSidebar({ isShowing, onSortChange }) {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedProductTypes, setSelectedProductTypes] = useState([]);

    // Ініціалізуємо усі списки як відкриті
    const [isCategoryCollapsed, setIsCategoryCollapsed] = useState(false);
    const [isProductTypeCollapsed, setIsProductTypeCollapsed] = useState(false);
    const [isPriceCollapsed, setIsPriceCollapsed] = useState(false);

    // Стан для збереження магазинів
    const [categories, setCategories] = useState([]);

    // Завантажуємо магазини при монтуванні компонента
    useEffect(() => {
        const loadShops = async () => {
            try {
                const shops = await fetchAllShops();
                const shopNames = shops.map(shop => shop.shopName);
                setCategories(shopNames); // Зберігаємо імена магазинів у стан
            } catch (error) {
                console.error("Помилка завантаження магазинів:", error);
            }
        };

        loadShops();
    }, []);

    const toggleCategory = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const toggleProductType = (productType) => {
        setSelectedProductTypes((prev) =>
            prev.includes(productType)
                ? prev.filter((pt) => pt !== productType)
                : [...prev, productType]
        );
    };

    return (
        <div className="container">
            <aside className={`sidebar ${isShowing ? "show" : ""}`}>
                <h3 onClick={() => setIsCategoryCollapsed(!isCategoryCollapsed)}>
                    Магазини {isCategoryCollapsed ? "▲" : "▼"}
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
                            <label className="custom-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => toggleCategory(category)}
                                />
                                <span className="checkmark"></span>
                                {category}
                            </label>
                        </li>
                    ))}
                </ul>

                <div className="separator"></div>
                <h3 onClick={() => setIsProductTypeCollapsed(!isProductTypeCollapsed)}>
                    Тип Товару {isProductTypeCollapsed ? "▲" : "▼"}
                </h3>
                <ul
                    style={{
                        backgroundColor: "#525870",
                        maxHeight: isProductTypeCollapsed ? '0px' : '250px',
                        overflowY: 'auto',
                        transition: 'max-height 0.3s ease',
                    }}
                >
                    {productTypes.map((productType, index) => (
                        <li key={index}>
                            <label className="custom-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedProductTypes.includes(productType)}
                                    onChange={() => toggleProductType(productType)}
                                />
                                <span className="checkmark"></span>
                                {productType}
                            </label>
                        </li>
                    ))}
                </ul>

                <div className="separator"></div>
                <h3 onClick={() => setIsPriceCollapsed(!isPriceCollapsed)}
                >Ціна {isPriceCollapsed ? "▲" : "▼"}</h3>
                <ul style={{ maxHeight: isPriceCollapsed ? 0 : 60,
                    zIndex: 5,
                    position: 'relative'
                }}>
                    <MultiRangeSlider
                        min={0}
                        max={10000}
                        onChange={({min, max}) => console.log(`min = ${min}, max = ${max}`)}
                    />
                </ul>
                <div className="separator"></div>
            </aside>

            <div className="main-content">
                <div className="sorting">
                    <label>
                        Сортувати за:
                        <select className="selector" onChange={onSortChange}>
                            <option value="downtoup">Від дешевих до дорогих</option>
                            <option value="uptodown">Від дорогих до дешевих</option>
                            <option value="rating">Рейтинг</option>
                        </select>
                    </label>
                </div>

                <ProductGrid selectedCategories={selectedCategories} selectedProductTypes={selectedProductTypes}/>
            </div>
        </div>
    );
}

export default FilterSidebar;
