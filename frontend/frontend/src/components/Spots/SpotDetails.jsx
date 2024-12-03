import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotDetails, deleteSpot } from '../../store/spots';
import ReviewList from '../ReviewList/ReviewList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useModal } from '../../context/Modal';
import spotDetailsStyles from './SpotDetails.module.css';

const SpotDetails = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spot = useSelector(state => state.spots.spotDetails);
  const sessionUser = useSelector(state => state.session.user);
  const { setModalContent, closeModal } = useModal();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleReserveClick = () => {
    alert('Feature coming soon!');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchSpotDetails(spotId));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching spot details:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch, spotId]);

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
            <button className={spotDetailsStyles.reserveButton} onClick={handleReserveClick}>Reserve</button>
          </div>
        </div>
      </div>
      <hr className={spotDetailsStyles.divider} />
      <div className={spotDetailsStyles.spotReviewsBox}>
        <h2>What other nesters had to say about this spot:</h2>
        <ReviewList spotId={spotId} sessionUser={sessionUser} />
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