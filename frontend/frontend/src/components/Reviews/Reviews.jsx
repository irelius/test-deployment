// frontend/src/components/Reviews/ReviewList.jsx

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews, deleteReview } from '../../store/reviews';
import ReviewItem from './ReviewItem';
import ReviewModal from './ReviewModal';
import { useModal } from '../../context/Modal';

const ReviewList = ({ spotId, sessionUser }) => {
  const dispatch = useDispatch();
  const reviews = useSelector(state => state.reviews.reviews || []);
  const spot = useSelector(state => state.spots.spotDetails);
  const { setModalContent, closeModal } = useModal();

  useEffect(() => {
    dispatch(fetchReviews(spotId));
  }, [dispatch, spotId]);

  const handleDelete = (reviewId) => {
    dispatch(deleteReview(reviewId));
  };

  const openReviewModal = (formType, review) => {
    setModalContent(
      <ReviewModal
        formType={formType}
        review={review}
        spotId={spotId}
        closeModal={closeModal}
      />
    );
  };

  const userHasReviewed = Array.isArray(reviews) && reviews.find(review => review.userId === sessionUser.id);

  return (
    <div className="reviews">
      <h2>Reviews</h2>
      {sessionUser && spot && sessionUser.id !== spot.ownerId && !userHasReviewed && (
        <button onClick={() => openReviewModal('Create')}>Post Your Review</button>
      )}
      {Array.isArray(reviews) && reviews.map(review => (
        <ReviewItem
          key={review.id}
          review={review}
          sessionUser={sessionUser}
          onDelete={handleDelete}
          onEdit={() => openReviewModal('Edit', review)}
        />
      ))}
    </div>
  ); 
};

export default ReviewList;