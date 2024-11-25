import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Spots.css';

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
    <div className="spots-container grid">
      {Array.isArray(spots) && spots.map(spot => (
        <div
          key={spot.id}
          className="spot-link"
          title={spot.name}
          onClick={() => handleTileClick(spot.id)}
        >
          <div className="spot-tile">
            <img src={spot.previewImage} alt={spot.name} className="spot-thumbnail" />
            <div className="spot-info">
              <div>{spot.city}, {spot.state}</div>
              <div>{spot.avgRating}</div>
              <div>${spot.price} / night</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Spots;