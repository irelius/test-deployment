// frontend/src/components/ReviewForm/ReviewForm.jsx

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createReview, editReview, addReviewImage, deleteReviewImage } from '../../store/reviews';
import './ReviewForm.css';

const ReviewForm = ({ formType, review, spotId }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState(review ? review.review : '');
  const [rating, setRating] = useState(review ? review.stars : 0);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reviewData = { review: content, stars: rating, spotId: Number(spotId) }; // Ensure spotId is a number
    console.log('Submitting review:', reviewData); // This log should appear in the console
    try {
      if (formType === 'Create') {
        await dispatch(createReview(reviewData));
      } else {
        await dispatch(editReview({ ...review, ...reviewData }));
      }
      setContent('');
      setRating(0);
      setError(null);
    } catch (err) {
      console.error('Error submitting review:', err); // This log should appear in the console
      setError(err.message);
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (imageUrl) {
      await dispatch(addReviewImage(review.id, imageUrl));
      setImageUrl('');
    }
  };

  const handleDeleteImage = async (imageId) => {
    await dispatch(deleteReviewImage(review.id, imageId));
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      {error && <p className="error-message">{error}</p>}
      <textarea
        id="review-content"
        name="review-content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your review here"
        required
        className="review-textarea"
      />
      <select
        id="review-rating"
        name="review-rating"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        required
        className="review-select"
      >
        <option value="" disabled>Select rating</option>
        {[1, 2, 3, 4, 5].map(star => (
          <option key={star} value={star}>{star} Star{star > 1 && 's'}</option>
        ))}
      </select>
      <button type="submit" className="review-submit-button">
        {formType === 'Create' ? 'Submit Review' : 'Update Review'}
      </button>
      {formType === 'Edit' && review.ReviewImages && (
        <div className="review-images">
          <h4>Images</h4>
          {review.ReviewImages.map(image => (
            <div key={image.id} className="review-image">
              <img src={image.url} alt="Review" />
              <button type="button" onClick={() => handleDeleteImage(image.id)}>Delete Image</button>
            </div>
          ))}
        </div>
      )}
      {formType === 'Edit' && (
        <div className="add-image">
          <input
            type="text"
            id="image-url"
            name="image-url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Image URL"
            className="image-url-input"
          />
          <button type="button" onClick={handleAddImage}>Add Photo</button>
        </div>
      )}
    </form>
  );
};

export default ReviewForm;