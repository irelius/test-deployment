// frontend/src/components/SpotCard/SpotCard.jsx


import { NavLink } from 'react-router-dom';
import './SpotCard.css';

const SpotCard = ({ spot }) => {
  return (
    <div className="spot-card">
      <NavLink to={`/spots/${spot.id}`}>
        <img src={spot.previewImage} alt={spot.name} className="spot-card-image" />
        <div className="spot-card-details">
          <h3>{spot.name}</h3>
          <p>{spot.description}</p>
          <p>${spot.price} per night</p>
        </div>
      </NavLink>
    </div>
  );
};

export default SpotCard;