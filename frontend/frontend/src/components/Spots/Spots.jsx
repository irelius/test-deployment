import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots } from '../../store/spots';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import spotsStyles from './Spots.module.css';

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
    <div className={spotsStyles.spotsContainer + ' ' + spotsStyles.grid}>
      {spots.map(spot => (
        <div
          key={spot.id}
          className={spotsStyles.spotLink}
        >
          <div
            className={spotsStyles.spotTile}
            title={spot.name}
            onClick={() => handleTileClick(spot.id)}
          >
            <img src={spot.previewImage} alt={spot.name} className={spotsStyles.spotThumbnail} />
            <div className={spotsStyles.spotInfo}>
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