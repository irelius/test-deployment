// frontend/src/components/Spots/SpotDetails.jsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotDetails, deleteSpot } from '../../store/spots';
import ReviewList from '../ReviewList/ReviewList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useModal } from '../../context/Modal';
import './SpotDetails.css';

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
      <div className="delete-modal">
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
    <div className="spot-details">
      {sessionUser && sessionUser.id === spot.ownerId && (
        <div className="spot-actions">
          <button className="reserve-button" onClick={handleEdit}>Edit Spot</button>
          <button className="reserve-button" onClick={openDeleteModal}>Delete Spot</button>
        </div>
      )}
      <div className="spot-header">
        <h1>{spot.name}</h1>
        <h2>{spot.city}, {spot.state}</h2>
        <p>Hosted by {spot.Owner.firstName}</p>
      </div>
      <div className="spot-rating">
        <FontAwesomeIcon icon={faStar} /> {spot.avgRating ? spot.avgRating.toFixed(2) : 'New'}
        {spot.numReviews > 0 && (
          <>
            <span> · </span>
            <span>{spot.numReviews} {spot.numReviews === 1 ? 'Review' : 'Reviews'}</span>
          </>
        )}
      </div>
      <div className="spot-images-grid">
        <div className="spot-image-large">
          <img src={spot.previewImage} alt={spot.name} onClick={() => handleImageClick(spot.previewImage)} />
        </div>
        {spot.images && spot.images.slice(0, 4).map((image, index) => (
          <div key={index} className="spot-image-small">
            <img src={image.url} alt={`Spot ${index}`} onClick={() => handleImageClick(image.url)} />
          </div>
        ))}
        {spot.images && spot.images.length < 4 && (
          Array.from({ length: 4 - spot.images.length }).map((_, index) => (
            <div key={index} className="spot-image-small empty-image">Empty</div>
          ))
        )}
      </div>
      <div className="spot-content">
        <div className="spot-description">
          <p>{spot.description}</p>
        </div>
        <div className="spot-reservation">
          <div className="reservation-box">
            <p>${spot.price} / night</p>
            <button className="reserve-button" onClick={handleReserveClick}>Reserve</button>
          </div>
        </div>
      </div>
      <hr className="divider" />
      <div className="spot-reviews-box">
        <h2>What other nesters had to say about this spot:</h2>
        <ReviewList spotId={spotId} sessionUser={sessionUser} />
      </div>
      {selectedImage && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <img src={selectedImage} alt="Selected" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SpotDetails;