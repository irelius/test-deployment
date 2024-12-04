import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserListings } from '../store/spots'; 
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './MyListings.css';

const MyListings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userListings = useSelector(state => state.spots.userListings || []);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

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