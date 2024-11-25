// frontend/src/components/Spots/Spots.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Spots.css'; // Ensure this CSS file exists

const Spots = () => {
  const [spots, setSpots] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await fetch('/api/spots');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (Array.isArray(data.Spots)) {
          setSpots(data.Spots);
        } else {
          console.error('Fetched data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching spots:', error);
      }
    };

    fetchSpots();
  }, []);

  const handleTileClick = (spotId) => {
    navigate(`/spots/${spotId}`);
  };

  return (
    <div className="spots-container">
      {spots.map(spot => (
        <div
          key={spot.id}
          className="spot-tile"
          onClick={() => handleTileClick(spot.id)}
          title={spot.name}
        >
          <img src={spot.thumbnail} alt={spot.name} className="spot-thumbnail" />
          <div className="spot-info">
            <div>{spot.city}, {spot.state}</div>
            <div>{spot.rating}</div>
            <div>${spot.price} / night</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Spots;