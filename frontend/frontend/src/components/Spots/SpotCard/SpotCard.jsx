// frontend/src/components/SpotCard/SpotCard.jsx


import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './SpotCard.css';

const SpotCard = ({ spot }) => {
  const avgRating = spot.avgRating ? spot.avgRating.toFixed(2) : 'New';

  return (
    <div className="spot-card">
      <NavLink to={`/spots/${spot.id}`}>
        <img src={spot.previewImage} alt={spot.name} className="spot-card-image" />
        <div className="spot-card-details">
          <h3>{spot.name}</h3>
          <div className="spot-card-rating">
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