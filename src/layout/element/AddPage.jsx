import React, { useState } from 'react';
import axios from 'axios';

const ProductForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [images, setImages] = useState([]);

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);

        const encodeToBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });
        };

        const encodeImages = async () => {
            const encodedImages = await Promise.all(files.map(file => encodeToBase64(file)));
            setImages(encodedImages);
        };

        encodeImages();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const productData = {
            name,
            description,
            price: parseFloat(price),
            discountPercentage: parseFloat(discountPercentage),
            images
        };

        try {
            const response = await axios.post('http://localhost:3000/products/', productData);
            console.log('Product added successfully:', response.data);
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Product Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
                <label>Description:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div>
                <label>Price:</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div>
                <label>Discount Percentage:</label>
                <input type="number" value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} required />
            </div>
            <div>
                <label>Upload Images:</label>
                <input type="file" multiple onChange={handleImageUpload} />
            </div>
            <button type="button" onClick={handleSubmit}>Add Product</button>
        </form>
    );
};

export default ProductForm;
