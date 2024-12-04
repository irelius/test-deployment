// frontend/src/components/SpotCard/SpotCard.jsx


import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import SpotCardStyles from './SpotCard.module.css';

const SpotCard = ({ spot }) => {
  const avgRating = spot.avgRating ? spot.avgRating.toFixed(2) : 'New';

  return (
    <div className={SpotCardStyles.spotCard}>
      <NavLink to={`/spots/${spot.id}`}>
        <img src={spot.previewImage} alt={spot.name} className={SpotCardStyles.spotCardImage} />
        <div className={SpotCardStyles.spotCardDetails}>
          <h3>{spot.name}</h3>
          <div className={SpotCardStyles.spotCardRating}>
            <FontAwesomeIcon icon={faStar} /> {avgRating}
          </div>
          <p>{spot.description}</p>
          <p>${spot.price} per night</p>
        </div>
      </NavLink>
    </div>
  );
};

export default SpotCard;