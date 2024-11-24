import React, {useEffect, useState} from 'react';
import '../styles/orderForm.css';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';
import {getUserById} from "../../api/userApi.jsx";
import {fetchProductById, updateProduct} from "../../api/ItemsApi.jsx";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useNavigate} from 'react-router-dom';

const OrderForm = () => {
    const [deliveryOption, setDeliveryOption] = useState('newpickup');
    const [deliveryPrice, setDeliveryPrice] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cartItems, setCartItems] = useState([]);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();
    const [contactInfo, setContactInfo] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        address:''
    });
    const [state, setState] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: '',
        focus: '',
    });

    useEffect(() => {
        const calculateDeliveryPrice = () => {
            switch (deliveryOption) {
                case 'newpickup':
                    return 60;
                case 'ukrpickup':
                    return 40;
                case 'courier':
                    return 100;
                default:
                    return 0;
            }
        };

        setDeliveryPrice(calculateDeliveryPrice());
    }, [deliveryOption]);


    useEffect(() => {
        const fetchCartDetails = async () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];

            const itemsWithDetails = await Promise.all(
                cart.map(async (cartItem) => {
                    const productDetails = await fetchProductById(cartItem.id);
                    const discountPrice = productDetails.productPrice * (1 - productDetails.salePercent);

                    return {
                        id: cartItem.id,
                        name: productDetails.productName,
                        stock: productDetails.amount,
                        image: productDetails.images[0] || 'https://via.placeholder.com/100',
                        price: discountPrice.toFixed(2),
                        quantity: cartItem.quantity,
                        totalPrice: (discountPrice * cartItem.quantity).toFixed(2),
                    };
                })
            );

            setCartItems(itemsWithDetails);
            const total = itemsWithDetails.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0);
            setTotalPrice(total.toFixed(2));
        };

        fetchCartDetails();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            const authToken = Cookies.get('authToken');
            if (authToken) {
                try {
                    const decodedToken = jwtDecode(authToken);
                    const userId = decodedToken.user.id;
                    if (userId) {
                        const userData = await getUserById(userId);
                        setContactInfo({
                            firstName: userData.name || '',
                            lastName: userData.surname || '',
                            phone: userData.phone || '',
                            email: userData.email || '',
                            address: userData.address || '',
                        });
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (evt) => {
        const { name, value } = evt.target;

        if (name === 'number') {
            if (/^\d*$/.test(value) && value.length <= 16) {
                setState((prev) => ({ ...prev, [name]: value }));
            }
        } else if (name === 'name') {
            if (value.length <= 12) {
                setState((prev) => ({ ...prev, [name]: value }));
            }
        } else  if (name === 'expiry') {
            let formattedValue = value.replace(/\D/g, '').slice(0, 4);
            if (formattedValue.length > 2) {
                formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`;
            }
            setState((prev) => ({ ...prev, [name]: formattedValue }));
        } else if (name === 'cvc') {
            if (/^\d*$/.test(value) && value.length <= 3) {
                setState((prev) => ({ ...prev, [name]: value }));
            }
        }
    };

    const handleInputFocus = (evt) => {
        setState((prev) => ({ ...prev, focus: evt.target.name }));
    }

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setContactInfo({ ...contactInfo, [name]: value });
    };

    const generateOrderNumber = () => {
        return `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    };



    const handleConfirmOrder = async () => {
        try {
            await Promise.all(
                cartItems.map(async (item) => {
                    const updatedStock = item.stock - item.quantity;
                    console.log("Updating stock for item id: " + item.stock);
                    await updateProduct(item.id, { stock: updatedStock });
                })
            );

            const docDefinition = {
                content: [
                    { text: `Номер замовлення: ${generateOrderNumber()}`, style: 'header', alignment: 'center' },
                    { text: 'Контактна інформація:', style: 'sectionTitle', margin: [50, 20, 0, 10], alignment: 'left' },
                    { text: `Ім'я: ${contactInfo.firstName}`, margin: [50, 10, 0, 0], alignment: 'left' },
                    { text: `Прізвище: ${contactInfo.lastName}`, margin: [50, 10, 0, 0], alignment: 'left' },
                    { text: `Телефон: ${contactInfo.phone}`, margin: [50, 10, 0, 0], alignment: 'left' },
                    { text: `Email: ${contactInfo.email}`, margin: [50, 10, 0, 0], alignment: 'left' },
                    { text: `Адреса: ${contactInfo.address}`, margin: [50, 10, 0, 0], alignment: 'left' },
                    { text: 'Товари:', style: 'sectionTitle', margin: [50, 20, 0, 10], alignment: 'left' },
                    ...cartItems.map((item, index) => ({
                        text: `${index + 1}. ${item.name} -  ${item.price} x ${item.quantity} од. = ${item.totalPrice}грн.`,
                        margin: [50, 5, 0, 5],
                        alignment: 'left',
                        style: 'itemDetails'
                    })),
                    { text: 'Спосіб доставки:', style: 'sectionTitle', margin: [50, 20, 0, 10], alignment: 'left' },
                    { text: `${deliveryOption === 'newpickup' ? 'Нова пошта' : deliveryOption === 'ukrpickup' ? 'Укр Пошта' : 'Кур\'єр'} (${deliveryPrice}грн.)`, margin: [50, 10, 0, 0], alignment: 'left' },
                    { text: 'Спосіб оплати:', style: 'sectionTitle', margin: [50, 20, 0, 10], alignment: 'left' },
                    { text: paymentMethod === 'card' ? 'Оплата карткою' : paymentMethod === 'privat24' ? 'Приват24' : 'Готівкою при отриманні', margin: [50, 10, 0, 0], alignment: 'left' },
                    { text: `Загальна сума: ${(Number(totalPrice) + Number(deliveryPrice)).toFixed(2)}грн.`, style: 'total', margin: [0, 20, 0, 50], alignment: 'right' },
                ],
                styles: {
                    title: { fontSize: 24, bold: true, color: '#4CAF50', margin: [0, 20, 0, 10], alignment: 'center' },
                    header: { fontSize: 18, bold: true, color: '#333333', margin: [0, 10, 0, 10], alignment: 'center' },
                    sectionTitle: { fontSize: 16, bold: true, color: '#1E88E5', margin: [0, 10, 0, 5] },
                    itemDetails: { fontSize: 12, margin: [0, 5, 0, 5] },
                    total: { fontSize: 18, bold: true, color: '#D32F2F', margin: [0, 20, 0, 10], alignment: 'right' },
                },
                defaultStyle: { font: 'Roboto' },
            };


            pdfMake.createPdf(docDefinition).download("order-summary.pdf");
            setPaymentSuccess(true);
            setTimeout(() => {
                localStorage.removeItem("cart");
                setCartItems([]);
                setTotalPrice(0);
                navigate("/");
                window.location.reload();
            }, 3000);

        } catch (error) {
            console.error("Error confirming order:", error);
        }
    };






    return (
        <div className="app-container">
            <h1 style={{marginBottom:"10px"}}>Оформлення замовлення</h1>
            <div className="content-wrapper">


                <div className="left-side">

                    <div className="contact-info">
                        <h2>Ваші контактні дані</h2>
                        <div className="form-group">
                            <label htmlFor="firstName">Ім'я</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={contactInfo.firstName}
                                onChange={handleContactChange}
                                placeholder="Ваше ім'я"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Прізвище</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={contactInfo.lastName}
                                onChange={handleContactChange}
                                placeholder="Ваше прізвище"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Телефон</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={contactInfo.phone}
                                onChange={handleContactChange}
                                placeholder="+380 00 000 00 00"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Електронна пошта</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={contactInfo.email}
                                onChange={handleContactChange}
                                placeholder="example@gmail.com"
                            />
                        </div>
                    </div>

                    <div className="order-summary">
                        <h2 style={{marginBottom: "20px"}}>Замовлення</h2>
                        {cartItems.map((item) => (
                            <div key={item.id} className="order-item">
                                <img src={item.image} alt={item.name}/>
                                <p className="item-name" title={item.name}>{item.name}</p>
                                <p>{item.price}₴ x {item.quantity} од.</p>
                                <p className="total-price">{item.totalPrice}₴</p>
                            </div>
                        ))}
                    </div>



                    <div className="delivery">
                        <h2 className="delivery-title">Доставка</h2>
                        <div className="delivery-option">
                            <label>
                                <input
                                    type="radio"
                                    value="newpickup"
                                    checked={deliveryOption === 'newpickup'}
                                    onChange={(e) => setDeliveryOption(e.target.value)}
                                />
                                <span className="delivery-label">Нова пошта (60₴)</span>
                            </label>
                        </div>
                        <div className="delivery-option">
                            <label>
                                <input
                                    type="radio"
                                    value="ukrpickup"
                                    checked={deliveryOption === 'ukrpickup'}
                                    onChange={(e) => setDeliveryOption(e.target.value)}
                                />
                                <span className="delivery-label">Укр Пошта (40₴)</span>
                            </label>
                        </div>
                        <div className="delivery-option">
                            <label>
                                <input
                                    type="radio"
                                    value="courier"
                                    checked={deliveryOption === 'courier'}
                                    onChange={(e) => setDeliveryOption(e.target.value)}
                                />
                                <span className="delivery-label">Кур'єрська доставка (100₴)</span>
                            </label>
                        </div>

                        {deliveryOption === 'courier' && (
                            <div className="courier-address">
                                <div className="form-group">
                                    <label htmlFor="address">Адреса доставки</label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={contactInfo.address}
                                        onChange={handleContactChange}
                                        placeholder="Введіть вашу адресу"
                                    />
                                </div>
                            </div>


                        )}
                    </div>



                    <div className="payment">
                        <h2>Оплата</h2>
                        <div className="payment-methods">
                            <h2 className="payment-title">Спосіб оплати</h2>
                            <div className="payment-option">
                                <label>
                                    <input
                                        type="radio"
                                        value="card"
                                        checked={paymentMethod === 'card'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span className="payment-label">Оплата карткою</span>
                                </label>
                            </div>
                            <div className="payment-option">
                                <label>
                                    <input
                                        type="radio"
                                        value="privat24"
                                        checked={paymentMethod === 'privat24'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span className="payment-label">Приват24</span>
                                </label>
                            </div>
                            <div className="payment-option">
                                <label>
                                    <input
                                        type="radio"
                                        value="cash"
                                        checked={paymentMethod === 'cash'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span className="payment-label">Готівкою при отриманні</span>
                                </label>
                            </div>
                        </div>



                        {paymentMethod === 'card' && (
                            <div>
                                <Cards
                                    number={state.number}
                                    expiry={state.expiry}
                                    cvc={state.cvc}
                                    name={state.name}
                                    focused={state.focus}
                                />
                                <form>
                                    <div className="card-payment">
                                        <div className="form-group">
                                            <label htmlFor="number">Номер картки</label>
                                            <input
                                                type="text"
                                                id="number"
                                                name="number"
                                                placeholder="0000 0000 0000 0000"
                                                value={state.number}
                                                onChange={handleInputChange}
                                                onFocus={handleInputFocus}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="name">Ім'я на картці</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                placeholder="Ім'я"
                                                value={state.name}
                                                onChange={handleInputChange}
                                                onFocus={handleInputFocus}
                                            />
                                        </div>
                                        <div className="form-group-row">
                                            <div className="form-group">
                                                <label htmlFor="expiry">Термін дії</label>
                                                <input
                                                    type="text"
                                                    id="expiry"
                                                    name="expiry"
                                                    placeholder="MM/YY"
                                                    value={state.expiry}
                                                    onChange={handleInputChange}
                                                    onFocus={handleInputFocus}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="cvc">CVV</label>
                                                <input
                                                    type="password"
                                                    id="cvc"
                                                    name="cvc"
                                                    placeholder="000"
                                                    value={state.cvc}
                                                    onChange={handleInputChange}
                                                    onFocus={handleInputFocus}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>


                <div className="right-side">
                    <div className="summary">
                        <h2 className="summary-title">Разом</h2>
                        <div className="summary-details">
                            <p className="summary-item">Товари: <span className="summary-value">{totalPrice}₴</span></p>
                            <p className="summary-item">Доставка: <span
                                className="summary-value">{deliveryPrice > 0 ? `${deliveryPrice}₴` : 'Безкоштовно'}</span>
                            </p>
                        </div>
                        <h2 className="summary-title">До сплати</h2>
                        <div className="summary-details">
                            <p className="summary-item">Загальна сума: <span
                                className="summary-value">{deliveryPrice > 0 ? `${deliveryPrice + totalPrice*1}₴` : `${totalPrice}₴`}</span>
                            </p>
                        </div>
                        <button className="confirm-button" onClick={handleConfirmOrder}>
                            Підтвердити замовлення
                        </button>

                        {paymentSuccess && (
                            <div className="payment-success">
                                <div className="overlay"></div>
                                <div className="message">
                                    <span className="success-icon">&#x2714;</span> Оплата успішно виконана!
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

        </div>
    );
};

export default OrderForm;
