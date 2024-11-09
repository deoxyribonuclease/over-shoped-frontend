import React, { useState, useEffect, useRef } from "react";
import { Rating } from "react-simple-star-rating";
import { Star } from "@mui/icons-material";
import '../styles/reviewForm.css';
import { addReview, getReviewsByProductId, editReview, deleteReview } from "../../api/reviewApi";
import { getUserById, getUserImageId } from "../../api/userApi.jsx";
import Avatar from "../../assets/image-avatar.png";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { format } from "date-fns";
import { uk } from 'date-fns/locale';
import TimedAlert from "./TimedAlert.jsx";

const ReviewForm = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [usersData, setUsersData] = useState({});
    const [newReviewText, setNewReviewText] = useState("");
    const [newRating, setNewRating] = useState(0);
    const [userId, setUserId] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState('error');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);
    const [visibleReviews, setVisibleReviews] = useState(4);
    const [editingReview, setEditingReview] = useState(null);
    const [reviewToDelete, setReviewToDelete] = useState(null);
    const maxReviewLength = 400;

    const [fillColorArray] = useState([
        "#f17a45", "#f17a45", "#f19745", "#f19745", "#f1a545",
        "#f1a545", "#f1b345", "#f1b345", "#f1d045", "#f1d045"
    ]);

    // Реф для текстової області та для відгуку
    const textareaRef = useRef(null);
    const reviewRef = useRef(null);
    const addRef = useRef(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const fetchedReviews = await getReviewsByProductId(productId);
                setReviews(fetchedReviews);

                const token = Cookies.get('authToken');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    const loggedInUserId = decodedToken.user.id;
                    setUserId(loggedInUserId);

                    const sortedReviews = fetchedReviews.sort((a, b) => {
                        if (a.userId === loggedInUserId) return -1;
                        if (b.userId === loggedInUserId) return 1;
                        return 0;
                    });

                    setReviews(sortedReviews);
                }

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
                }
            } catch (err) {
                console.error("Error fetching reviews:", err);
            }
        };

        fetchReviews();
    }, [productId, alertMessage === 'Відгук успішно видалено!'
        , alertMessage === 'Відгук успішно відредаговано!'
        , alertMessage === 'Відгук успішно додано!']);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!userId) {
            setAlertSeverity("error");
            setAlertMessage("Ви не авторизовані. Будь ласка, увійдіть.");
            setAlertOpen(true);
            return;
        }

        const existingReview = reviews.find((review) => review.userId === userId);
        if (existingReview && !editingReview) {
            setAlertSeverity("warning");
            setAlertMessage("Ви вже залишили відгук для цього товару.");
            setAlertOpen(true);
            return;
        }

        if (newRating && newReviewText) {
            if (editingReview) {
                editReview(userId, productId, newReviewText, newRating)
                    .then((updatedReview) => {
                        setReviews((prevReviews) =>
                            prevReviews.map((review) =>
                                review.userId === userId && review.productId === productId
                                    ? { ...review, text: updatedReview.text, rating: updatedReview.rating }
                                    : review
                            )
                        );
                        setEditingReview(null);
                        if (reviewRef.current) {
                            reviewRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
                        }
                        setAlertSeverity("success");
                        setAlertMessage("Відгук успішно відредаговано!");
                        setAlertOpen(true);
                    })
                    .catch((err) => console.error("Error editing review:", err));
            } else {
                const newReview = {
                    rating: newRating,
                    text: newReviewText,
                    userId,
                    productId
                };
                setReviews((prevReviews) => [...prevReviews, newReview]);
                setAlertSeverity("success");
                setAlertMessage("Відгук успішно додано!");
                setAlertOpen(true);
                addReview(userId, productId, newReviewText, newRating)
                    .catch((err) => console.error("Error adding review:", err));
                if (addRef.current) {
                    addRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }

            setNewReviewText("");
            setNewRating(0);
        } else {
            setAlertSeverity("warning");
            setAlertMessage("Будь ласка, заповніть всі поля.");
            setAlertOpen(true);
        }
    };

    const handleEdit = (review) => {
        setEditingReview(review);
        setNewReviewText(review.text);
        setNewRating(review.rating);

        if (textareaRef.current) {
            textareaRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    const handleDeleteDialogOpen = (review) => {
        setReviewToDelete(review);
    };

    const handleDelete = () => {
        if (reviewToDelete) {
            deleteReview(userId, productId, reviewToDelete.id)
                .then(() => {
                    setReviews((prevReviews) =>
                        prevReviews.filter((r) => r.id !== reviewToDelete.id)
                    );
                    setReviewToDelete(null);
                    setAlertSeverity("success");
                    setAlertMessage("Відгук успішно видалено!");
                    setAlertOpen(true);
                })
                .catch((err) => {
                    console.error("Error deleting review:", err);
                });
        }
    };

    const handleCancelEdit = () => {
        setEditingReview(null);
        setNewReviewText("");
        setNewRating(0);
    };

    return (
        <div className="reviews-section">
            <h3 ref={addRef}>Відгуки - {reviews.length}</h3>
            {reviews.length ? (
                reviews.slice(0, visibleReviews).map((review, index) => (
                    <div
                        ref={review.userId === userId ? reviewRef : null}
                        key={index}
                        className={`review-item fade-in ${review.userId === userId ? 'highlighted' : ''}`}
                    >
                        <div className="review-header">
                            <img
                                src={usersData[review.userId]?.image || "/assets/empty.jpg"}
                                alt="avatar"
                                className="user-avatar"
                            />
                            <span className="user-name">{usersData[review.userId]?.name}</span>
                            <span className="review-date">
                                {review.createdAt ? format(new Date(review.createdAt), 'dd MMMM yyyy', { locale: uk }) : "Дата недоступна"}
                            </span>
                            <Rating
                                initialValue={review.rating}
                                fillIcon={<Star className="custom-star-all" />}
                                emptyIcon={<Star className="custom-star-all" />}
                                fillColorArray={fillColorArray}
                                readonly
                            />
                        </div>
                        <p>{review.text}</p>

                        {review.userId === userId && (
                            <div className="review-actions">
                                <button onClick={() => handleEdit(review)}>Редагувати</button>
                                <button onClick={() => handleDeleteDialogOpen(review)}>Видалити</button>
                                {reviewToDelete && reviewToDelete.id === review.id && (
                                    <div className="delete-confirmation">
                                        <span>Ви впевнені, що хочете видалити цей відгук?</span>
                                        <button onClick={handleDelete}>Так, видалити</button>
                                        <button onClick={() => setReviewToDelete(null)}>Ні, скасувати</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p className="empty-review-placeholder">Ще немає відгуків. Будьте першим!</p>
            )}

            {visibleReviews < reviews.length && (
                <button className="load-more-button" onClick={() => setVisibleReviews((prevCount) => prevCount + 4)}>
                    ▼ Завантажити ще коментарі ▼
                </button>
            )}

            <h3>{editingReview ? "Редагувати відгук" : "Залишити відгук"}</h3>
            <form onSubmit={handleSubmit}>
                <div className="rating-and-character-count">
                    <Rating
                        initialValue={newRating}
                        onClick={(rate) => setNewRating(rate)}
                        fillIcon={<Star className="custom-star" />}
                        emptyIcon={<Star className="custom-star" />}
                        transition
                        allowFraction
                        showTooltip
                        fillColorArray={fillColorArray}
                    />
                    <div className="character-count">
                        {newReviewText.length}/{maxReviewLength} символів
                    </div>
                </div>

                <textarea
                    ref={textareaRef} // Додаємо реф
                    className="text-textarea"
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    placeholder="Напишіть свій відгук тут..."
                    rows="5"
                    maxLength={maxReviewLength}
                    required
                />
                <TimedAlert
                    alertOpen={alertOpen}
                    alertSeverity={alertSeverity}
                    alertMessage={alertMessage}
                    handleCloseAlert={() => setAlertOpen(false)}
                />
                <button className="cust-button" type="submit">
                    {editingReview ? "Зберегти зміни" : "Залишити відгук"}
                </button>
                {editingReview && (
                    <button className="cancel-edit-button" onClick={handleCancelEdit}>
                        Скасувати редагування
                    </button>
                )}
            </form>
        </div>
    );
};

export default ReviewForm;
