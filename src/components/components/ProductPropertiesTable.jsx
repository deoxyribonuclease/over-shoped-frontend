import React, { useEffect, useState } from "react";
import { fetchProductProperties } from "../../Api/ItemsApi.jsx";
import "../styles/productPropertiesTable.css";

const ProductPropertiesTable = ({ productId }) => {
    const [properties, setProperties] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            try {
                const fetchedProperties = await fetchProductProperties(productId);
                setProperties(fetchedProperties);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [productId]);

    if (loading) {
        return <p className="loading">Завантаження характеристик...</p>;
    }

    if (error) {
        return <p className="error">Помилка завантаження характеристик. Спробуйте пізніше.</p>;
    }

    if (properties.length === 0) {
        return <p className="no-properties">Характеристики відсутні</p>;
    }

    return (
        <div className="product-properties-table">
            <h2>Характеристики товару</h2>
            <table>
                <thead>
                <tr>
                    <th>Назва</th>
                    <th>Значення</th>
                </tr>
                </thead>
                <tbody>
                {properties.map((property) => (
                    <tr key={property.id}>
                        <td>{property.name}</td>
                        <td>{property.content}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductPropertiesTable;
