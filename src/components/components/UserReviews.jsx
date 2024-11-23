import React, { useState, useEffect } from "react";
import { getReviewsByUserId } from "../../api/reviewApi";
import { Rating } from "react-simple-star-rating";
import { Star } from "@mui/icons-material";
import Avatar from "../../assets/image-avatar.png";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { getUserById, getUserImageId } from "../../api/userApi.jsx";
import { fetchProductById } from "../../api/itemsApi";
import prodImg from "../../assets/itemPlaceholder.png";
import '../styles/userReviews.css'

const UserReviews = ({ userId }) => {
    const [reviews, setReviews] = useState([]);
    const [usersData, setUsersData] = useState({});
    const [productDetails, setProductDetails] = useState({});
    const [fillColorArray] = useState([
        "#f17a45", "#f17a45", "#f19745", "#f19745", "#f1a545",
        "#f1a545", "#f1b345", "#f1b345", "#f1d045", "#f1d045"
    ]);


    useEffect(() => {
        const fetchUserReviews = async () => {
            try {
                const fetchedReviews = await getReviewsByUserId(userId);
                setReviews(fetchedReviews);

                for (const review of fetchedReviews) {
                    if (review.userId) {
                        const userData = await getUserById(review.userId);
                        const userImage = await getUserImageId(review.userId);
                        setUsersData((prevData) => ({
                            ...prevData,
                            [review.userId]: {
                                name: userData.name || "Анонім",
                                image: userImage || Avatar,
                            },
                        }));
                    }

                    if (review.productId) {
                        const productData = await fetchProductById(review.productId);
                        setProductDetails((prevData) => ({
                            ...prevData,
                            [review.productId]: productData,
                        }));
                    }
                }
            } catch (err) {
                console.error("Error fetching user reviews:", err);
            }
        };

        fetchUserReviews();
    }, [userId]);

    return (
        <div className="reviews-section">
            <div className="reviews-section-container">
            <h3>Ваші відгуки</h3>
            {reviews.length ? (
                reviews.map((review, index) => (
                    <div key={index} className="review-item">


                        <div className="review-header">
                            <img
                                src={usersData[review.userId]?.image || Avatar}
                                alt="avatar"
                                className="user-avatar"
                            />
                            <span className="user-name">{usersData[review.userId]?.name}</span>
                            <span className="review-date">
                                {review.createdAt
                                    ? format(new Date(review.createdAt), "dd MMMM yyyy", {locale: uk})
                                    : "Дата недоступна"}
                            </span>
                            <Rating
                                initialValue={review.rating}
                                fillIcon={<Star className="custom-star-all"/>}
                                emptyIcon={<Star className="custom-star-all"/>}
                                readonly
                                fillColorArray={fillColorArray}
                            />
                        </div>
                        <p>{review.text}</p>
                        <div className="separator-review"></div>
                        {productDetails[review.productId] && (
                            <div className="product-details">
                                <a href={`/item/${review.productId}`}>
                                <img
                                    src={productDetails[review.productId].images?.[0] || prodImg}
                                    alt={productDetails[review.productId].name}
                                />
                            </a>
                                <p className="prod-name">
                                    <span className="product-title">Назва: </span>
                                    {productDetails[review.productId].productName.length > 15
                                        ? productDetails[review.productId].productName.slice(0, 15) + "..."
                                        : productDetails[review.productId].productName}
                                </p>
                                <p className="product-info">
                                    <span className="price-title">Ціна: </span>
                                    {productDetails[review.productId].salePercent  > 0
                                        ? (productDetails[review.productId].productPrice * (1 - productDetails[review.productId].salePercent)).toFixed(2)
                                        : productDetails[review.productId].productPrice.toFixed(2)
                                    } ₴
                                </p>
                                    <p className="product-info" style={{color:'#c0af63;'}}>
                                        <span className="discount-title">Рейтинг: </span>
                                        <span style={{color:'#c0af63'}}> {productDetails[review.productId].rating.toFixed(2)}★ </span>
                                    </p>

                            </div>
                        )}

                    </div>
                ))
            ) : (
                <p style={{fontSize:"20px"}}>Ви не залишали відгуків...</p>
            )}
        </div>
            </div>
    );
};

export default UserReviews;
