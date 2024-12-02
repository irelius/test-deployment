// frontend/src/components/Reviews/ReviewModal.jsx

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createReview, editReview } from '../../store/reviews';
import './ReviewModal.css';

const ReviewModal = ({ formType, review, spotId, spotName, closeModal }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState(review ? review.review : '');
  const [rating, setRating] = useState(review ? review.stars : 0);
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
      setError(err.message);
    }
  };

  return (
    <div className="review-modal">
      <h2>How was your stay?</h2>
      <h3>{spotName}</h3>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your review here"
          required
        />
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          required
        >
          <option value="" disabled>Select rating</option>
          {[1, 2, 3, 4, 5].map(star => (
            <option key={star} value={star}>{star} Star{star > 1 && 's'}</option>
          ))}
        </select>
        <button type="submit" disabled={content.length < 10 || rating === 0}>
          {formType === 'Create' ? 'Submit Review' : 'Update Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewModal;