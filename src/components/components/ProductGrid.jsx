// ProductGrid.jsx
import React from "react";
import ProductCard from "./ProductCard.jsx";

const products = [
    { "id": 1, "name": "Я не піду", "price": 999, "rating": 4.5, "brand": "Ухилянт", "image": "https://media1.tenor.com/m/krDN2mcxlJcAAAAd/%D1%8F-%D0%BD%D0%B5-%D0%BF%D1%96%D0%B4%D1%83.gif",
        "isOnSale": true,
        "salePercent": 0.3 },
    { "id": 2, "name": "Я не піду", "price": 1000, "rating": 4.5, "brand": "Ухилянт", "image": "https://media1.tenor.com/m/krDN2mcxlJcAAAAd/%D1%8F-%D0%BD%D0%B5-%D0%BF%D1%96%D0%B4%D1%83.gif"  },
    { "id": 3, "name": "Я не піду", "price": 1000, "rating": 4.5, "brand": "Ухилянт", "image": "https://media1.tenor.com/m/krDN2mcxlJcAAAAd/%D1%8F-%D0%BD%D0%B5-%D0%BF%D1%96%D0%B4%D1%83.gif",
        "isOnSale": true,
        "salePercent": 0.2 },
    { "id": 4, "name": "Я не піду", "price": 1000, "rating": 4.5, "brand": "Ухилянт", "image": "https://media1.tenor.com/m/krDN2mcxlJcAAAAd/%D1%8F-%D0%BD%D0%B5-%D0%BF%D1%96%D0%B4%D1%83.gif" },
    { "id": 5, "name": "Я не піду", "price": 1000, "rating": 4.5, "brand": "Ухилянт", "image": "https://media1.tenor.com/m/krDN2mcxlJcAAAAd/%D1%8F-%D0%BD%D0%B5-%D0%BF%D1%96%D0%B4%D1%83.gif" },
    { "id": 6, "name": "Я не піду", "price": 1999, "rating": 4.5, "brand": "Ухилянт", "image": "https://media1.tenor.com/m/krDN2mcxlJcAAAAd/%D1%8F-%D0%BD%D0%B5-%D0%BF%D1%96%D0%B4%D1%83.gif",
        "isOnSale": true,
        "salePercent": 0.7 },
    { "id": 7, "name": "Я не піду", "price": 1000, "rating": 4.5, "brand": "Ухилянт", "image": "https://media1.tenor.com/m/krDN2mcxlJcAAAAd/%D1%8F-%D0%BD%D0%B5-%D0%BF%D1%96%D0%B4%D1%83.gif" },
    { "id": 8, "name": "Я не піду", "price": 1000, "rating": 4.5, "brand": "Ухилянт", "image": "https://media1.tenor.com/m/krDN2mcxlJcAAAAd/%D1%8F-%D0%BD%D0%B5-%D0%BF%D1%96%D0%B4%D1%83.gif" },
    { "id": 9, "name": "Я не піду", "price": 1000, "rating": 4.5, "brand": "Ухилянт", "image": "https://media1.tenor.com/m/krDN2mcxlJcAAAAd/%D1%8F-%D0%BD%D0%B5-%D0%BF%D1%96%D0%B4%D1%83.gif" },
    {
        "id": 10,
        "name": "Я не піду",
        "price": 1000,
        "rating": 4.5,
        "brand": "Ухилянт",
        "image": "https://media1.tenor.com/m/krDN2mcxlJcAAAAd/%D1%8F-%D0%BD%D0%B5-%D0%BF%D1%96%D0%B4%D1%83.gif",
        "isOnSale": true,
        "salePercent": 0.2
    }

];

function ProductGrid() {
    return (
        <div className="product-grid">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}

export default ProductGrid;
