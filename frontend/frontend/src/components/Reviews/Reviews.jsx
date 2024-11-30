// frontend/src/components/Reviews/Reviews.jsx

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews, deleteReview } from '../../store/reviews';
import ReviewForm from '../ReviewForm/ReviewForm';

const Reviews = ({ spotId }) => {
  const dispatch = useDispatch();
  const reviews = useSelector(state => state.reviews.reviews || []);
  const sessionUser = useSelector(state => state.session.user);
  const spot = useSelector(state => state.spots.spotDetails);

  useEffect(() => {
    dispatch(fetchReviews(spotId));
  }, [dispatch, spotId]);

  const handleDelete = (reviewId) => {
    dispatch(deleteReview(reviewId));
  };

  if (!Array.isArray(reviews)) {
    return <div>No reviews available</div>;
  }

  return (
    <div>
      <h2>Reviews</h2>
      {sessionUser && spot && sessionUser.id !== spot.ownerId && (
        <ReviewForm formType="Create" spotId={spotId} />
      )}
      {reviews.map(review => (
        <div key={review.id}>
          <p>{review.review}</p>
          <p>Rating: {review.stars}</p>
          {sessionUser && sessionUser.id === review.userId && (
            <>
              <button onClick={() => handleDelete(review.id)}>Delete</button>
              <ReviewForm formType="Edit" review={review} spotId={spotId} />
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Reviews;