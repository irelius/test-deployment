// frontend/src/components/ReviewForm/ReviewForm.jsx

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createReview, updateReview, addReviewImage, deleteReviewImage } from '../../store/reviews';

const ReviewForm = ({ formType, review, spotId }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState(review ? review.content : '');
  const [rating, setRating] = useState(review ? review.rating : 0);
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const reviewData = { content, rating };
    if (formType === 'Create') {
      dispatch(createReview(spotId, reviewData));
    } else {
      dispatch(updateReview(review.id, reviewData));
    }
  };

  const handleAddImage = (e) => {
    e.preventDefault();
    if (imageUrl) {
      dispatch(addReviewImage(review.id, imageUrl));
      setImageUrl('');
    }
  };

  const handleDeleteImage = (imageId) => {
    dispatch(deleteReviewImage(imageId));
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your review here"
        required
      />
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))} required>
        <option value="" disabled>Select rating</option>
        {[1, 2, 3, 4, 5].map(star => (
          <option key={star} value={star}>{star} Star{star > 1 && 's'}</option>
        ))}
      </select>
      <button type="submit">{formType === 'Create' ? 'Submit Review' : 'Update Review'}</button>
      {formType === 'Edit' && review.ReviewImages && (
        <div>
          <h4>Images</h4>
          {review.ReviewImages.map(image => (
            <div key={image.id}>
              <img src={image.url} alt="Review" />
              <button type="button" onClick={() => handleDeleteImage(image.id)}>Delete Image</button>
            </div>
          ))}
        </div>
      )}
      {formType === 'Edit' && (
        <div>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Image URL"
          />
          <button type="button" onClick={handleAddImage}>Add Photo</button>
        </div>
      )}
    </form>
  );
};

export default ReviewForm;