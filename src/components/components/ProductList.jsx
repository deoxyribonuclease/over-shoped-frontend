import React, { useState, useEffect } from "react";
import '../styles/productList.css';
import {
    fetchCategories,
    searchProducts
} from "../../api/searchApi.jsx";
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProductProperties,
    createProductProperty,
    updateProductProperty,
    deleteProductProperty,
} from "../../api/ItemsApi.jsx";
import prodImg from "../../assets/itemPlaceholder.png";
import ReactPaginate from "react-paginate";
import TimedAlert from "./TimedAlert.jsx";


const ProductList = ({ shopId }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isAddingNewProduct, setIsAddingNewProduct] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: 0,
        discountPercentage: 0,
        stock: 0,
        categoryId: "",
        images: null,
        rating: 0,
        page: 1,
        pageSize: 5
    });
    const [editingProduct, setEditingProduct] = useState(null);
    const [productPropertiesMap, setProductPropertiesMap] = useState({});
    const [newProperty, setNewProperty] = useState({ name: "", content: "" });
    const [pendingImages, setPendingImages] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [alertSeverity, setAlertSeverity] = useState('error');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);



    useEffect(() => {
        if (shopId) {
            fetchCategoriesList();
            fetchProductsByShopId(shopId);
        }
    }, [shopId, newProduct.page]);


    const fetchCategoriesList = async () => {
        try {
            const categories = await fetchCategories();
            setCategories(categories);
        } catch (error) {
            console.error("Помилка завантаження категорій:", error);
        }
    };


    const fetchProductsByShopId = async (shopId) => {
        setIsLoading(true);
        try {
            const filters = { shopId: [shopId], page: newProduct.page, pageSize: newProduct.pageSize };
            const productsData = await searchProducts(filters);
            const products = productsData.products || [];
            setProducts(products);
            setTotalPages(productsData.totalPages || 1);


            const propertiesPromises = products.map((product) =>
                getAllProductProperties(product.id)
            );

            const propertiesResults = await Promise.all(propertiesPromises);
            const propertiesMap = {};
            products.forEach((product, index) => {
                propertiesMap[product.id] = propertiesResults[index];
            });
            setProductPropertiesMap(propertiesMap);
        } catch (error) {
            console.error("Помилка завантаження товарів:", error);
        } finally {
            setIsLoading(false);
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

    const handlePageClick = (event) => {
        const newPage = event.selected + 1;
        setCurrentPage(newPage);
        setNewProduct({ ...newProduct, page: newPage });
        scrollToTop();
    };


    const handleAddProperty = async (productId) => {
        try {
            if (!newProperty.name.trim() || !newProperty.content.trim()) {
                setAlertSeverity("error");
                setAlertMessage("Заповність обидва поля характеристик!");
                setAlertOpen(true);
                return;
            }
            const propertyData = {
                categoryId: editingProduct.categoryId,
                productId,
                name: newProperty.name.trim(),
                content: newProperty.content.trim(),
            };
            const newProp = await createProductProperty(productId, propertyData);
            setProductPropertiesMap({
                ...productPropertiesMap,
                [productId]: [...(productPropertiesMap[productId] || []), newProp],
            });
            setNewProperty({ name: "", content: "" });
        } catch (error) {
            console.error("Помилка додавання характеристики:", error);
        }
    };


    const handleDeleteProperty = async (productId, propertyId) => {
        try {
            await deleteProductProperty(productId, propertyId);
            setProductPropertiesMap({
                ...productPropertiesMap,
                [productId]: (productPropertiesMap[productId] || []).filter(
                    (prop) => prop.id !== propertyId
                ),
            });
        } catch (error) {
            console.error("Помилка видалення характеристики:", error);
        }
    };

    const handleCreateProduct = async () => {
        try {
            const productData = {
                ...newProduct,
                shopId,
                images: pendingImages,
            };
            const product = await createProduct(productData);
            setProducts([...products, product]);
            setNewProduct({
                name: "",
                description: "",
                price: 0,
                discountPercentage: 0,
                stock: 0,
                categoryId: "",
                images: null,
                rating: 0,
                page: 1,
                pageSize: 5
            });
            setPendingImages([]);
            setIsAddingNewProduct(false);
            setAlertSeverity("success");
            setAlertMessage("Товар успішно додано!");
            setAlertOpen(true);
            scrollToTop();

        } catch (error) {
            setAlertSeverity("error");
            setAlertMessage("Виникла помилка...");
            setAlertOpen(true);
            console.error("Помилка створення товару:", error);
        }
    };

    const updateProductCategoryIdInProperties = async (productId, newCategoryId) => {
        try {
            const properties = productPropertiesMap[productId] || [];

            const updatedProperties = properties.map(async (property) => {
                const updatedPropertyData = {
                    ...property,
                    categoryId: newCategoryId,
                };
                await updateProductProperty(productId, property.id, updatedPropertyData);
            });

            await Promise.all(updatedProperties);
        } catch (error) {
            console.error("Помилка оновлення характеристик продукту:", error);
        }
    };


    const handleUpdateProduct = async (productId, updatedData) => {
        try {

            await updateProductCategoryIdInProperties(productId, updatedData.categoryId);

            const updatedProduct = await updateProduct(productId, updatedData);
            setProducts(products.map((prod) => (prod.id === productId ? updatedProduct : prod)));
            setEditingProduct(null);
        } catch (error) {
            console.error("Помилка оновлення товару:", error);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await deleteProduct(productId);
            setProducts(products.filter((prod) => prod.id !== productId));
        } catch (error) {
            console.error("Помилка видалення товару:", error);
        }
    };

    const handleImageAdd = async (event) => {
        const files = Array.from(event.target.files);

        const encodeToBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });
        };

        try {
            const encodedImages = await Promise.all(files.map((file) => encodeToBase64(file)));
            setPendingImages([...pendingImages, ...encodedImages]);
        } catch (error) {
            console.error("Помилка додавання зображень:", error);
        }
    };

    const handlePendingImageDelete = (imageIndex) => {
        const updatedPendingImages = pendingImages.filter((_, index) => index !== imageIndex);
        setPendingImages(updatedPendingImages);
    };

    const applyPendingImages = (productId) => {
        try {
            const updatedProduct = {
                ...editingProduct,
                images: [...(editingProduct.images || []), ...pendingImages],
            };
            handleUpdateProduct(productId, updatedProduct);
            setPendingImages([]);
            scrollToTop();
            setAlertSeverity("success");
            setAlertMessage("Зміни успішно збережено!");
            setAlertOpen(true);
        }
        catch (error)  {
            setAlertSeverity("error");
            setAlertMessage("Виникла помилка...");
            setAlertOpen(true);
    }

    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };


    const cancelPendingChanges = () => {
        setEditingProduct(null);
        setPendingImages([]);
        scrollToTop();
    };
    const handleImageDelete = (imageIndex) => {
        const updatedImages = editingProduct.images?.filter((_, index) => index !== imageIndex);
        setEditingProduct({
            ...editingProduct,
            images: updatedImages,
        });
    };




    return (
        <div className="product-list-container">

            {!editingProduct && !isAddingNewProduct && (
                <div className="product-list-header">
                    <h2 className="product-list-title">Список товарів</h2>
                    <button
                        className="toggle-add-product-button"
                        onClick={() => setIsAddingNewProduct(!isAddingNewProduct)}
                    >
                        {isAddingNewProduct ? 'Скасувати додавання' : 'Додати новий товар'}
                    </button>
                </div>
            )}

            {isAddingNewProduct ? (
                <div className="product-add-container">

                    <div className="form-group">
                        <label htmlFor="productName">Назва товару:</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Назва"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="productDescription">Опис товару:</label>
                        <textarea
                            placeholder="Опис товару"
                            className="form-control-textarea"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="productPrice">Ціна ₴:</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Ціна"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="productDiscount">Відсоток знижки %:</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Відсоток"
                            value={newProduct.discountPercentage}
                            onChange={(e) => setNewProduct({
                                ...newProduct,
                                discountPercentage: Math.min(parseFloat(e.target.value), 100),
                            })}
                            max="100"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="productStock">В наявності (шт):</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Запас"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="productCategory">Категорія:</label>
                        <select
                            className="form-control"
                            value={newProduct.categoryId}
                            onChange={(e) => setNewProduct({...newProduct, categoryId: e.target.value})}
                        >
                            <option value="">Оберіть категорію</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Додавання блоку для зображень */}
                    <div className="image-upload-container">
                        <h4 className="image-upload-header">Зображення товару:</h4>
                        <label className="file-upload-container">
                            Додати зображення
                            <input type="file" multiple onChange={handleImageAdd}/>
                        </label>
                    </div>

                    {/* Відображення доданих зображень */}
                    <div className="product-images-container">
                        {newProduct.images?.map((image, index) => (
                            <div key={index} className="product-image-item">
                                <img src={image} alt={`Зображення ${index + 1}`}/>
                                <button onClick={() => handleImageDelete(index)}>×</button>
                            </div>
                        ))}

                        {pendingImages.map((image, index) => (
                            <div key={index} className="product-image-item">
                                <img src={image} alt={`Нове зображення ${index + 1}`}/>
                                <button onClick={() => handlePendingImageDelete(index)}>×</button>
                            </div>
                        ))}
                    </div>
                    <div className="product-item-actions">
                        <button
                            className="product-item-edit-button-shop"
                            onClick={() => {
                                handleCreateProduct();
                            }}
                        >
                            Додати товар
                        </button>
                        <button
                            className="product-item-delete-button-shop"
                            onClick={() => {setIsAddingNewProduct(!isAddingNewProduct); setPendingImages([]); scrollToTop()}}
                        >
                            Скасувати додавання
                        </button>
                    </div>
                </div>
            ) : (

                <div className="product-listі">

                    {products.map((product) => (
                        editingProduct && editingProduct.id !== product.id ? null : (
                            <div key={product.id} className="product-item-container">
                                <div className="product-item-image-container">
                                    <img
                                        src={product.images?.[0] || pendingImages?.[0] || prodImg}
                                        alt={product.name}
                                    />
                                </div>
                                <div className="product-item-details-container">
                                    {editingProduct && editingProduct.id === product.id ? (
                                        <>
                                            <div className="form-group">
                                                <label htmlFor="productName">Назва товару:</label>
                                                <input
                                                    id="productName"
                                                    type="text"
                                                    className="form-control"
                                                    value={editingProduct.name}
                                                    onChange={(e) =>
                                                        setEditingProduct({...editingProduct, name: e.target.value})
                                                    }
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="productDescription">Опис товару:</label>
                                                <textarea
                                                    id="productDescription"
                                                    className="form-control-textarea"
                                                    value={editingProduct.description}
                                                    onChange={(e) =>
                                                        setEditingProduct({
                                                            ...editingProduct,
                                                            description: e.target.value
                                                        })
                                                    }
                                                    placeholder="Опис товару"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="productPrice">Ціна ₴:</label>
                                                <input
                                                    id="productPrice"
                                                    type="number"
                                                    className="form-control"
                                                    value={editingProduct.price}
                                                    onChange={(e) =>
                                                        setEditingProduct({
                                                            ...editingProduct,
                                                            price: Math.min(99999, parseFloat(e.target.value)),
                                                        })
                                                    }
                                                    placeholder="Ціна"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="productDiscount">Відсоток знижки %:</label>
                                                <input
                                                    id="productDiscount"
                                                    type="number"
                                                    className="form-control"
                                                    value={editingProduct.discountPercentage}
                                                    onChange={(e) =>
                                                        setEditingProduct({
                                                            ...editingProduct,
                                                            discountPercentage: Math.min(100, parseFloat(e.target.value)),
                                                        })
                                                    }
                                                    placeholder="10"
                                                    max="100"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="productStock">В наявності (шт):</label>
                                                <input
                                                    id="productStock"
                                                    type="number"
                                                    className="form-control"
                                                    value={editingProduct.stock}
                                                    onChange={(e) =>
                                                        setEditingProduct({
                                                            ...editingProduct,
                                                            stock: parseInt(e.target.value)
                                                        })
                                                    }
                                                    placeholder="99"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="productCategory">Категорія:</label>
                                                <select
                                                    id="productCategory"
                                                    className="form-control"
                                                    value={editingProduct.categoryId}
                                                    onChange={(e) =>
                                                        setEditingProduct({
                                                            ...editingProduct,
                                                            categoryId: e.target.value
                                                        })
                                                    }
                                                >
                                                    <option value="">Оберіть категорію</option>
                                                    {categories.map((category) => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <div style={{display: 'flex', gap: '1px'}}>
                                                    <div>
                                                        <label htmlFor="propertyName" >Назва
                                                            характеристики:</label>
                                                        <input
                                                            id="propertyName"
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Назва характеристики"
                                                            value={newProperty.name}
                                                            onChange={(e) => setNewProperty({
                                                                ...newProperty,
                                                                name: e.target.value
                                                            })}
                                                            required
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="propertyContent" style={{}}>Значення
                                                            характеристики:</label>
                                                        <input
                                                            id="propertyContent"
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Значення"
                                                            value={newProperty.content}
                                                            onChange={(e) => setNewProperty({
                                                                ...newProperty,
                                                                content: e.target.value
                                                            })}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                            </div>

                                            <div>
                                                <button className="file-upload-container" style={{marginBottom: '10px'}}
                                                        onClick={() => handleAddProperty(product.id)}>Додати
                                                    характеристику
                                                </button>
                                            </div>


                                            <table className="product-item-features">
                                                <tbody>
                                                {(productPropertiesMap[product.id] || []).map((prop) => (
                                                    <tr key={prop.id} className="product-item-feature">
                                                        <td className="feature-name">{prop.name}</td>
                                                        <td className="feature-content">{prop.content}</td>
                                                        <td>
                                                            <button style={{fontSize:'25px', color:'red'}}
                                                                onClick={() => handleDeleteProperty(product.id, prop.id)}>
                                                                ×
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>


                                        </>
                                    ) : (
                                        <>

                                            <div className="product-category">
                                                <span className="category-label">Категорія: </span>
                                                <span className="category-name">
                                                  {
                                                      categories.find(category => category.id === product.categoryId)?.name || "Категорія не знайдена"
                                                  }
                                                </span>
                                            </div>
                                            <p className="product-item">
                                                <h3 className="product-item-title">Назва: {product.name}</h3>
                                                <span className="stock-ch">
                                                <span className="stock-label-ch" style={{marginTop: '2px'}}>Рейтинг: </span>
                                                <span className="stock-value-ch" style={{color: '#c0af63'}}>{product.rating.toFixed(2)} ★</span>
                                              </span>
                                            </p>
                                            <p className="discount-label">Опис:</p>
                                            <p className="product-item-description">{product.description}</p>

                                            <p className="product-item">
                                          <span className="price-ch">
                                            <span className="price-label-ch">Ціна:</span>
                                            <span className="price-value-ch">{product.price} грн</span>
                                          </span>
                                                <span className="discount-ch">
                                            <span className="discount-label-ch">Знижка:</span>
                                            <span className="discount-value-ch">{product.discountPercentage}%</span>
                                          </span>
                                                <span className="discounted-price-block-ch">
                                            <span className="discounted-price-label-ch">Ціна зі знижкою:</span>
                                            <span
                                                className="discounted-price-value-ch">{(product.price - (product.price * product.discountPercentage / 100)).toFixed(2)} грн</span>
                                          </span>
                                                <span className="stock-ch">
                                            <span className="stock-label-ch">В наявності:</span>
                                            <span className="stock-value-ch">{product.stock}</span>
                                          </span>
                                            </p>


                                            <h4 className="properties-title">Характеристики товару:</h4>
                                            <table className="product-item-features">
                                                <tbody>
                                                {(productPropertiesMap[product.id] || []).map((prop) => (
                                                    <tr key={prop.id} className="product-item-feature">
                                                        <td className="feature-name">{prop.name}</td>
                                                        <td className="feature-content">{prop.content}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </>
                                    )}


                                    {editingProduct && editingProduct.id === product.id ? (
                                        <div>
                                            <div className="image-upload-container">
                                                <h4 className="image-upload-header">Зображення товару:</h4>
                                                <label className="file-upload-container">
                                                    Додати нове зображення
                                                    <input type="file" multiple onChange={handleImageAdd}/>
                                                </label>
                                            </div>

                                            <div className="product-images-container">
                                                {editingProduct.images?.map((image, index) => (
                                                    <div key={index} className="product-image-item">
                                                        <img src={image} alt={`Зображення ${index + 1}`}/>
                                                        <button onClick={() => handleImageDelete(index)}>×</button>
                                                    </div>
                                                ))}

                                                {pendingImages.map((image, index) => (
                                                    <div key={index} className="product-image-item">
                                                        <img src={image} alt={`Нове зображення ${index + 1}`}/>
                                                        <button onClick={() => handlePendingImageDelete(index)}>×
                                                        </button>
                                                    </div>
                                                ))}

                                            </div>

                                            <div className="product-item-actions">
                                                <button className="product-item-edit-button-shop"
                                                        onClick={() => applyPendingImages(product.id)}>Зберегти зміни
                                                </button>
                                                <button className="product-item-delete-button-shop"
                                                        onClick={() => cancelPendingChanges()}>Скасувати зміни
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="product-item-actions">
                                            <button
                                                className="product-item-edit-button-shop"
                                                onClick={() => {
                                                    setEditingProduct(product);
                                                    scrollToTop();
                                                }}
                                            >
                                                Редагувати
                                            </button>
                                            <button
                                                className="product-item-delete-button-shop"
                                                onClick={() => handleDeleteProduct(product.id)}
                                            >
                                                Видалити
                                            </button>
                                        </div>
                                    )}
                                </div>

                            </div>

                        )
                    ))}
                    {!editingProduct && (
                    <ReactPaginate
                        previousLabel={"←"}
                        nextLabel={"→"}
                        breakLabel={"..."}
                        pageCount={totalPages}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination"}
                        activeClassName={"active"}
                        forcePage={currentPage - 1}
                    />
                    )}

                </div>
            )}
            <TimedAlert
                alertOpen={alertOpen}
                alertSeverity={alertSeverity}
                alertMessage={alertMessage}
                handleCloseAlert={() => setAlertOpen(false)}
            />
        </div>
    );
};

export default ProductList;
