import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots } from '../../store/spots';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './Spots.css';

const Spots = () => {
  const dispatch = useDispatch();
  const spots = useSelector(state => state.spots.spots);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  const handleTileClick = (spotId) => {
    navigate(`/spots/${spotId}`);
  };

  return (
    <div className="spots-container grid">
      {spots.map(spot => (
        <div
          key={spot.id}
          className="spot-link"
          title={spot.name}
          onClick={() => handleTileClick(spot.id)}
        >
          <div className="spot-tile">
            <img src={spot.previewImage} alt={spot.name} className="spot-thumbnail" />
            <div className="spot-info">
              <div>{spot.name}</div>
              <div>
                <FontAwesomeIcon icon={faStar} /> {spot.avgRating ? spot.avgRating.toFixed(2) : 'New'}
              </div>
              <div>{spot.city}, {spot.state}</div>
              <div>${spot.price} / night</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Spots;