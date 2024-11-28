// frontend/src/components/Spots/SpotDetails.jsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { csrfFetch } from '../../store/csrf';
import { useModal } from '../../context/Modal';
import './SpotDetails.css';

const SpotDetails = () => {
  const { spotId } = useParams();
  const [spot, setSpot] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [stars, setStars] = useState(0);
  const [error, setError] = useState(null);
  const { setModalContent, closeModal } = useModal();

  useEffect(() => {
    const fetchSpotDetails = async () => {
      try {
        const response = await csrfFetch(`/api/spots/${spotId}`);
        if (!response.ok) {
          throw new Error('Oh no! Something went wrong');
        }
        const data = await response.json();
        setSpot(data);
      } catch (error) {
        console.error('Error fetching spot details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchSpotDetails();
    fetchReviews();
  }, [spotId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ review: reviewText, stars }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Error response data:', data); // Log detailed error message
        throw new Error(data.message || 'Failed to post review');
      }

      const newReview = await response.json();
      console.log('New review:', newReview); // Debugging log
      setReviews([newReview, ...reviews]);
      setReviewText('');
      setStars(0);
      closeModal(); // Close the modal after submitting the review
    } catch (error) {
      console.error('Error submitting review:', error); // Debugging log
      setError(error.message);
    }
  };

  const openReviewModal = () => {
    setModalContent(
      <div className="review-form">
        <h3>Post a Review</h3>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleReviewSubmit}>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here"
            required
          />
          <select value={stars} onChange={(e) => setStars(Number(e.target.value))} required>
            <option value="" disabled>Select rating</option>
            {[1, 2, 3, 4, 5].map(star => (
              <option key={star} value={star}>{star} Star{star > 1 && 's'}</option>
            ))}
          </select>
          <button type="submit">Submit Review</button>
        </form>
      </div>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!spot) {
    return <div>Spot not found</div>;
  }

  const avgRating = spot.avgRating ? spot.avgRating.toFixed(2) : 'New';
  const reviewCount = reviews.length;
  const reviewSummaryText = reviewCount === 1 ? '1 Review' : `${reviewCount} Reviews`;

  return (
    <div className="spot-details">
      <h1>{spot.name}</h1>
      <p>Location: {spot.city}, {spot.state}, {spot.country}</p>
      <div className="spot-images">
        {spot.SpotImages && spot.SpotImages.map((image, index) => (
          <img key={index} src={image.url} alt={`${spot.name} ${index + 1}`} className="spot-image" />
        ))}
      </div>
      <p>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</p>
      <p>{spot.description}</p>
      <div className="callout-box">
        <p>${spot.price} / night</p>
        <div>
          <FontAwesomeIcon icon={faStar} /> {avgRating}
          {reviewCount > 0 && <span> · {reviewSummaryText}</span>}
        </div>
        <button onClick={() => alert('Feature coming soon')}>Reserve</button>
      </div>
      <h2>
        <FontAwesomeIcon icon={faStar} /> {avgRating}
        {reviewCount > 0 && <span> · {reviewSummaryText}</span>}
      </h2>
      <div className="reviews">
        {reviewCount > 0 ? (
          reviews.map(review => (
            <div key={review.id} className="review">
              <p><strong>{review.User.firstName}</strong></p>
              <p>{new Date(review.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
              <p>{review.review}</p>
            </div>
          ))
        ) : (
          <p>Be the first to post a review!</p>
        )}
      </div>
      <div className="review-form">
        <button onClick={openReviewModal}>Leave a Review</button>
      </div>
    </div>
  );
};

export default SpotDetails;