// frontend/src/components/Reviews/ReviewModal.jsx

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createReview, editReview } from '../../store/reviews';
import { FaStar } from 'react-icons/fa';
import reviewModalStyles from './ReviewModal.module.css';

const ReviewModal = ({ formType, review, spotId, spotName, closeModal }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState(review ? review.review : '');
  const [rating, setRating] = useState(review ? review.stars : 0);
  const [hover, setHover] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reviewData = { review: content, stars: rating, spotId: Number(spotId) };
    try {
      if (formType === 'Create') {
        await dispatch(createReview(reviewData));
      } else {
        await dispatch(editReview({ ...review, ...reviewData }));
      }
      closeModal(); 
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.message);
    }
  };

  return (
    <div className={reviewModalStyles.reviewModal}>
      <h2>How was your stay?</h2>
      <h3>{spotName}</h3>
      {error && <p className={reviewModalStyles.errorMessage}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your review here"
          required
        />
        <div className={reviewModalStyles.starRating}>
          {[...Array(5)].map((star, index) => {
            const ratingValue = index + 1;
            return (
              <FaStar
                key={index}
                className={`${reviewModalStyles.star} ${ratingValue <= (hover || rating) ? reviewModalStyles.selected : ''}`}
                onClick={() => setRating(ratingValue)}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(null)}
              />
            );
          })}
        </div>
        <button type="submit" disabled={content.length < 10 || rating === 0}>
          {formType === 'Create' ? 'Submit Review' : 'Update Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewModal;