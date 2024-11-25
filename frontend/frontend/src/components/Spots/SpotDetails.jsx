import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './SpotDetails.css';

const SpotDetails = () => {
  const { id } = useParams();
  const [spot, setSpot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSpotDetails = async () => {
      try {
        const response = await fetch(`/api/spots/${id}`);
        if (!response.ok) {
          throw new Error('Oh no! Something went wrong');
        }
        const data = await response.json();
        setSpot(data);
      } catch (error) {
        console.error('Error fetching spot details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpotDetails();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!spot) {
    return <div>Spot not found</div>;
  }

  return (
    <div className="spot-details">
      <h1>{spot.name}</h1>
      <p>Location: {spot.city}, {spot.state}, {spot.country}</p>
      <div className="spot-images">
        <img src={spot.largeImageUrl} alt={spot.name} className="large-image" />
        <div className="small-images">
          {spot.smallImageUrls && spot.smallImageUrls.map((url, index) => (
            <img key={index} src={url} alt={`${spot.name} ${index + 1}`} className="small-image" />
          ))}
        </div>
      </div>
      <p>Hosted by {spot.hostFirstName} {spot.hostLastName}</p>
      <p>{spot.description}</p>
      <div className="callout-box">
        <p>${spot.price} / night</p>
        <button onClick={() => alert('Feature coming soon')}>Reserve</button>
      </div>
    </div>
  );
};

export default SpotDetails;