import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserReviews, deleteReview } from '../../store/reviews';
import ReviewItem from './ReviewItem';
import ReviewModal from '../ReviewModal/ReviewModal';
import { useModal } from '../../context/Modal';
import { useOutletContext } from 'react-router-dom';

const ManageReviews = () => {
  const dispatch = useDispatch();
  const { sessionUser } = useOutletContext();
  const reviews = useSelector(state => state.reviews.userReviews || []);
  const { setModalContent, closeModal } = useModal();

  useEffect(() => {
    if (sessionUser) {
      dispatch(fetchUserReviews(sessionUser.id));
    }
  }, [dispatch, sessionUser]);

  const handleDelete = async (reviewId) => {
    await dispatch(deleteReview(reviewId));
    dispatch(fetchUserReviews(sessionUser.id)); // Refresh the reviews after deletion
  };

  const openReviewModal = (formType, review) => {
    setModalContent(
      <ReviewModal
        formType={formType}
        review={review}
        spotId={review.spotId}
        spotName={review.Spot.name}
        closeModal={closeModal}
      />
    );
  };

  return (
    <div className="manage-reviews">
      <h2>Manage Reviews</h2>
      {reviews.length === 0 ? (
        <p>You have not posted any reviews yet.</p>
      ) : (
        reviews.map(review => (
          <ReviewItem
            key={review.id}
            review={review}
            sessionUser={sessionUser}
            onDelete={() => handleDelete(review.id)}
            onEdit={() => openReviewModal('Edit', review)}
          />
        ))
      )}
    </div>
  );
};

export default ManageReviews;