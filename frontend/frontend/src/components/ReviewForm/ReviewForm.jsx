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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reviewData = { review: content, stars: rating };
    try {
      if (formType === 'Create') {
        await dispatch(createReview(spotId, reviewData));
      } else {
        await dispatch(editReview({ ...review, ...reviewData }));
      }
      setContent('');
      setRating(0);
    } catch (err) {
      console.error('Error submitting review:', err);
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
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your review here"
        required
        className="review-textarea"
      />
      <select
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