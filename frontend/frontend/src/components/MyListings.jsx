import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserListings } from '../store/spots'; // Correct the import path
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './MyListings.css';

const MyListings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userListings = useSelector(state => state.spots.userListings);

  useEffect(() => {
    dispatch(fetchUserListings());
  }, [dispatch]);

  const handleTileClick = (spotId) => {
    navigate(`/spots/${spotId}`);
  };

  return (
    <div className="my-listings-container">
      <h1>My Listings</h1>
      <div className="listings-grid">
        {userListings.map(spot => (
          <div
            key={spot.id}
            className="listing-tile"
            title={spot.name}
            onClick={() => handleTileClick(spot.id)}
          >
            <img src={spot.previewImage} alt={spot.name} className="listing-thumbnail" />
            <div className="listing-info">
              <div>{spot.name}</div>
              <div>
                <FontAwesomeIcon icon={faStar} /> {spot.avgRating ? spot.avgRating.toFixed(2) : 'New'}
              </div>
              <div>{spot.city}, {spot.state}</div>
              <div>${spot.price} / night</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyListings;