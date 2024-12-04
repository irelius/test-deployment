import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotDetails, deleteSpot } from '../../store/spots';
import { fetchReviewsBySpotId, createReview, editReview, deleteReview } from '../../store/reviews';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useModal } from '../../context/Modal';
import spotDetailsStyles from './SpotDetails.module.css';

const SpotDetails = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spot = useSelector(state => state.spots.spotDetails);
  const reviews = useSelector(state => state.reviews.reviews);
  const noReviews = useSelector(state => state.reviews.noReviews);
  const sessionUser = useSelector(state => state.session.user);
  const { setModalContent, closeModal } = useModal();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [newReviewContent, setNewReviewContent] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [error, setError] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchSpotDetails(spotId));
        await dispatch(fetchReviewsBySpotId(spotId));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching spot details:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch, spotId]);

  useEffect(() => {
    if (sessionUser && reviews.some(review => review.userId === sessionUser.id)) {
      setHasSubmittedReview(true);
    }
  }, [sessionUser, reviews]);

  const handleEditReview = async (e) => {
    e.preventDefault();
    setError(null);

    if (editContent.trim() === '' || editRating === 0) {
      setError('Please provide a review and a rating.');
      return;
    }

    try {
      await dispatch(editReview({ id: editingReviewId, review: editContent, stars: editRating }));
      setEditingReviewId(null);
      setEditContent('');
      setEditRating(0);
      await dispatch(fetchSpotDetails(spotId)); // Refresh spot details to update rating and review count
      await dispatch(fetchReviewsBySpotId(spotId)); // Refresh reviews
      setHasSubmittedReview(true); // Hide the "Leave a Review" form after editing
      closeModal();
    } catch (error) {
      console.error('Error editing review:', error);
      setError('An error occurred while editing your review. Please try again.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await dispatch(deleteReview(reviewId));
      await dispatch(fetchSpotDetails(spotId)); // Refresh spot details to update rating and review count
      await dispatch(fetchReviewsBySpotId(spotId)); // Refresh reviews
      setHasSubmittedReview(false); // Allow the user to leave a new review
      closeModal();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleNewReviewSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (newReviewContent.trim() === '' || newReviewRating === 0) {
      setError('Please provide a review and a rating.');
      return;
    }

    try {
      await dispatch(createReview({ spotId, review: newReviewContent, stars: newReviewRating }));
      await dispatch(fetchSpotDetails(spotId)); // Refresh spot details to update rating and review count
      await dispatch(fetchReviewsBySpotId(spotId)); // Refresh reviews
      setNewReviewContent('');
      setNewReviewRating(0);
      setHasSubmittedReview(true); // Hide the "Leave a Review" form
    } catch (error) {
      console.error('Error creating review:', error);
      setError('An error occurred while submitting your review. Please try again.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!spot) {
    return <div>Spot not found</div>;
  }

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleDelete = async () => {
    await dispatch(deleteSpot(spotId));
    closeModal();
    navigate('/my-listings');
  };

  const openDeleteModal = () => {
    setModalContent(
      <div className={spotDetailsStyles.deleteModal}>
        <h2>Are you sure you want to delete this spot?</h2>
        <button onClick={handleDelete}>Yes</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    );
  };

  const handleEdit = () => {
    navigate(`/spots/${spotId}/edit`);
  };

  const startEditingReview = (review) => {
    setEditingReviewId(review.id);
    setEditContent(review.review);
    setEditRating(review.stars);
    setHasSubmittedReview(false); // Show the "Leave a Review" form for editing
  };

  return (
    <div className={spotDetailsStyles.spotDetails}>
      {sessionUser && sessionUser.id === spot.ownerId && (
        <div className={spotDetailsStyles.spotActions}>
          <button className={spotDetailsStyles.reserveButton} onClick={handleEdit}>Edit Spot</button>
          <button className={spotDetailsStyles.reserveButton} onClick={openDeleteModal}>Delete Spot</button>
        </div>
      )}
      <div className={spotDetailsStyles.spotHeader}>
        <h1>{spot.name}</h1>
        <h2>{spot.city}, {spot.state}</h2>
        <p>Hosted by {spot.Owner.firstName}</p>
      </div>
      <div className={spotDetailsStyles.spotRating}>
        <FontAwesomeIcon icon={faStar} /> {spot.avgRating ? spot.avgRating.toFixed(2) : 'New'}
        {spot.numReviews > 0 && (
          <>
            <span> · </span>
            <span>{spot.numReviews} {spot.numReviews === 1 ? 'Review' : 'Reviews'}</span>
          </>
        )}
      </div>
      <div className={spotDetailsStyles.spotImagesGrid}>
        <div className={spotDetailsStyles.spotImageLarge}>
          <img src={spot.previewImage} alt={spot.name} onClick={() => handleImageClick(spot.previewImage)} />
        </div>
        {spot.images && spot.images.slice(0, 4).map((image, index) => (
          <div key={index} className={spotDetailsStyles.spotImageSmall}>
            <img src={image.url} alt={`Spot ${index}`} onClick={() => handleImageClick(image.url)} />
          </div>
        ))}
        {spot.images && spot.images.length < 4 && (
          Array.from({ length: 4 - spot.images.length }).map((_, index) => (
            <div key={index} className={spotDetailsStyles.spotImageSmall + ' ' + spotDetailsStyles.emptyImage}>Empty</div>
          ))
        )}
      </div>
      <div className={spotDetailsStyles.spotContent}>
        <div className={spotDetailsStyles.spotDescription}>
          <p>{spot.description}</p>
        </div>
        <div className={spotDetailsStyles.spotReservation}>
          <div className={spotDetailsStyles.reservationBox}>
            <p>${spot.price} / night</p>
            <button className={spotDetailsStyles.reserveButton} onClick={() => alert('Feature coming soon!')}>Reserve</button>
          </div>
        </div>
      </div>
      <hr className={spotDetailsStyles.divider} />
      {sessionUser && !hasSubmittedReview && (
        <div className={spotDetailsStyles.newReviewForm}>
          <h3>{editingReviewId ? 'Edit Your Review' : 'Leave a Review'}</h3>
          {error && <p className={spotDetailsStyles.error}>{error}</p>}
          <form onSubmit={editingReviewId ? handleEditReview : handleNewReviewSubmit}>
            <textarea
              value={editingReviewId ? editContent : newReviewContent}
              onChange={(e) => editingReviewId ? setEditContent(e.target.value) : setNewReviewContent(e.target.value)}
              placeholder="Write your review here..."
              required
            />
            <div className={spotDetailsStyles.ratingInput}>
              <label>Rating: </label>
              <div className={spotDetailsStyles.starRating}>
                {[...Array(5)].map((star, index) => {
                  index += 1;
                  return (
                    <button
                      type="button"
                      key={index}
                      className={index <= (hover || (editingReviewId ? editRating : newReviewRating)) ? spotDetailsStyles.on : spotDetailsStyles.off}
                      onClick={() => editingReviewId ? setEditRating(index) : setNewReviewRating(index)}
                      onMouseEnter={() => setHover(index)}
                      onMouseLeave={() => setHover(editingReviewId ? editRating : newReviewRating)}
                    >
                      <FontAwesomeIcon icon={faStar} />
                    </button>
                  );
                })}
              </div>
            </div>
            <button type="submit" className={spotDetailsStyles.button}>{editingReviewId ? 'Update Review' : 'Submit Review'}</button>
          </form>
        </div>
      )}
      <div className={spotDetailsStyles.spotReviewsBox}>
        <h2>What other nesters had to say about this spot:</h2>
        {noReviews ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className={spotDetailsStyles.review}>
              <p><strong>{review.User?.firstName || 'Anonymous'}</strong> - {new Date(review.createdAt).toLocaleDateString()}</p>
              <p>{review.review}</p>
              <p>
                {Array.from({ length: review.stars }).map((_, index) => (
                  <FontAwesomeIcon key={index} icon={faStar} className={spotDetailsStyles.star} />
                ))}
              </p>
              {sessionUser && sessionUser.id === review.userId && (
                <>
                  <button className={spotDetailsStyles.button} onClick={() => startEditingReview(review)}>Edit</button>
                  <button className={spotDetailsStyles.button} onClick={() => handleDeleteReview(review.id)}>Delete</button>
                </>
              )}
              <hr className={spotDetailsStyles.reviewDivider} />
            </div>
          ))
        )}
      </div>
      {selectedImage && (
        <div className={spotDetailsStyles.modal} onClick={handleCloseModal}>
          <div className={spotDetailsStyles.modalContent} onClick={(e) => e.stopPropagation()}>
            <span className={spotDetailsStyles.close} onClick={handleCloseModal}>&times;</span>
            <img src={selectedImage} alt="Selected" className={spotDetailsStyles.modalImage} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SpotDetails;