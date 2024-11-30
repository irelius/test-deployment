// frontend/src/components/Spots/SpotDetails.jsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotDetails } from '../../store/spots';
import Reviews from '../Reviews/Reviews';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './SpotDetails.css';

const SpotDetails = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector(state => state.spots.spotDetails);
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

  return (
    <div className="spot-details">
      <div className="spot-header">
        <h1>{spot.name}</h1>
        <h2>{spot.city}, {spot.state}</h2>
      </div>
      <div className="spot-rating">
        <FontAwesomeIcon icon={faStar} /> {spot.avgRating ? spot.avgRating.toFixed(2) : 'New'}
      </div>
      <div className="spot-images-grid">
        <div className="spot-image-large">
          <img src={spot.previewImage} alt={spot.name} onClick={() => handleImageClick(spot.previewImage)} />
        </div>
        {spot.images && spot.images.map((image, index) => (
          <div key={index} className="spot-image-small">
            <img src={image.url} alt={`Spot ${index}`} onClick={() => handleImageClick(image.url)} />
          </div>
        ))}
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
      <div className="spot-reviews">
        <h2>What other nesters had to say about this spot:</h2>
        <Reviews spotId={spotId} />
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