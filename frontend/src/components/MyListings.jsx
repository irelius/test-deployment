import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserListings, deleteSpot } from '../store/spots'; 
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import myListingsStyles from './MyListingsStyles.module.css';

const MyListings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userListings = useSelector(state => state.spots.currentUserSpots || []);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [spotToDelete, setSpotToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchUserListings());
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user listings:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleTileClick = (spotId) => {
    navigate(`/spots/${spotId}`);
  };

  const handleEditClick = (spotId) => {
    navigate(`/spots/${spotId}/edit`);
  };

  const handleDeleteClick = (spot) => {
    setSpotToDelete(spot);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteSpot(spotToDelete.id));
      setShowModal(false);
      setSpotToDelete(null);
    } catch (error) {
      console.error('Error deleting spot:', error);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setSpotToDelete(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={myListingsStyles.myListingsContainer}>
      <h1>My Listings</h1>
      <div className={myListingsStyles.listingsGrid}>
        {userListings.map(spot => (
          <div
            key={spot.id}
            className={myListingsStyles.listingTile}
            title={spot.name}
          >
            <img src={spot.previewImage} alt={spot.name} className={myListingsStyles.listingThumbnail} onClick={() => handleTileClick(spot.id)} />
            <div className={myListingsStyles.listingInfo}>
              <div>{spot.name}</div>
              <div>
                <FontAwesomeIcon icon={faStar} /> {spot.avgRating ? spot.avgRating.toFixed(2) : 'New'}
              </div>
              <div>{spot.city}, {spot.state}</div>
              <div>${spot.price} / night</div>
              <button className={`${myListingsStyles.editButton} ${myListingsStyles.listingInfo}`} onClick={() => handleEditClick(spot.id)}>Edit</button>
              <button className={`${myListingsStyles.deleteButton} ${myListingsStyles.listingInfo}`} onClick={() => handleDeleteClick(spot)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className={myListingsStyles.modal}>
          <div className={myListingsStyles.modalContent}>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot?</p>
            <button className={myListingsStyles.deleteButton} onClick={confirmDelete}>Yes (Delete Spot)</button>
            <button className={myListingsStyles.cancelButton} onClick={cancelDelete}>No (Keep Spot)</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListings;