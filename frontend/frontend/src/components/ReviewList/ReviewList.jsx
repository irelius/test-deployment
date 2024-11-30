import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews, deleteReview } from '../../store/reviews';
import ReviewForm from '../ReviewForm/ReviewForm';

const ReviewList = ({ spotId }) => {
  const dispatch = useDispatch();
  const reviews = useSelector(state => state.reviews.reviews);

  useEffect(() => {
    dispatch(fetchReviews(spotId));
  }, [dispatch, spotId]);

  const handleDelete = (reviewId) => {
    dispatch(deleteReview(reviewId));
  };

  return (
    <div>
      <h2>Reviews</h2>
      <ReviewForm formType="Create" spotId={spotId} />
      {reviews.map(review => (
        <div key={review.id}>
          <p>{review.content}</p>
          <p>Rating: {review.rating}</p>
          <button onClick={() => handleDelete(review.id)}>Delete</button>
          <ReviewForm formType="Edit" review={review} spotId={spotId} />
        </div>
      ))}
    </div>
  );
};

export default ReviewList;