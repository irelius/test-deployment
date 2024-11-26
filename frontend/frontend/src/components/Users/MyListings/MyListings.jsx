// frontend/src/components/Users/MyListings/MyListings.jsx

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchUserSpots } from '../../utils/api';
import './MyListings.css';

function MyListings() {
  const sessionUser = useSelector(state => state.session.user);
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sessionUser) {
      fetchUserSpots()
        .then(data => {
          setSpots(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [sessionUser]);

  if (!sessionUser) {
    return <div>Please log in to view your nests.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="my-listings">
      <h1>My Nests</h1>
      {spots.length === 0 ? (
        <p>No nests found.</p>
      ) : (
        <ul>
          {spots.map(spot => (
            <li key={spot.id}>
              <h2>{spot.name}</h2>
              <p>Price: ${spot.price}</p>
              <p>Created At: {spot.createdAt}</p>
              <p>Updated At: {spot.updatedAt}</p>
              {spot.SpotImages && spot.SpotImages.length > 0 && (
                <img src={spot.SpotImages[0].url} alt={spot.name} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyListings;