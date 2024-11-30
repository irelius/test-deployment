// frontend/src/components/Reviews/Reviews.jsx

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews, deleteReview } from '../../store/reviews';
import ReviewForm from '../ReviewForm/ReviewForm';
import './Reviews.css';

const Reviews = ({ spotId, formatDate, sessionUser }) => {
  const dispatch = useDispatch();
  const reviews = useSelector(state => state.reviews.reviews || []);
  const noReviews = useSelector(state => state.reviews.noReviews);
  const spot = useSelector(state => state.spots.spotDetails);

  useEffect(() => {
    dispatch(fetchReviews(spotId));
  }, [dispatch, spotId]);

  const handleDelete = (reviewId) => {
    dispatch(deleteReview(reviewId));
  };

    console.log('sessionUser:', sessionUser);
  console.log('spot:', spot);

  if (!Array.isArray(reviews)) {
    return <div>No reviews available</div>;
  }

  return (
    <div className="reviews">
      <h2>Reviews</h2>
      {sessionUser && spot && sessionUser.id !== spot.ownerId && (
        <ReviewForm formType="Create" spotId={spotId} />
      )}
      {noReviews ? (
        <p>No reviews found for this spot</p>
      ) : (
        reviews.length > 0 ? (
          reviews.map(review => (
            <div key={review.id} className="review">
              <p><strong>{review.User.firstName}</strong> - {formatDate(review.createdAt)}</p>
              <p>{review.review}</p>
              <p>Rating: {review.stars}</p>
              {sessionUser && sessionUser.id === review.userId && (
                <>
                  <button onClick={() => handleDelete(review.id)}>Delete</button>
                  <ReviewForm formType="Edit" review={review} spotId={spotId} />
                </>
              )}
            </div>
          ))
        ) : (
          sessionUser && sessionUser.id !== spot.ownerId && (
            <p>Be the first to post a review!</p>
          )
        )
      )}
    </div>
  );
};

export default Reviews;