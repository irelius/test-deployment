import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './SpotDetails.css';

const SpotDetails = () => {
  const { id } = useParams();
  const [spot, setSpot] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSpotDetails = async () => {
      try {
        const response = await fetch(`/api/spots/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSpot(data);
      } catch (error) {
        console.error('Error fetching spot details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/spots/${id}/reviews`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchSpotDetails();
    fetchReviews();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!spot) {
    return <div>Spot not found</div>;
  }

  const avgRating = spot.avgRating ? spot.avgRating.toFixed(2) : 'New';
  const reviewCount = reviews.length;
  const reviewText = reviewCount === 1 ? '1 Review' : `${reviewCount} Reviews`;

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
        <div>
          <FontAwesomeIcon icon={faStar} /> {avgRating}
          {reviewCount > 0 && <span> · {reviewText}</span>}
        </div>
        <button onClick={() => alert('Feature coming soon')}>Reserve</button>
      </div>
      <h2>
        <FontAwesomeIcon icon={faStar} /> {avgRating}
        {reviewCount > 0 && <span> · {reviewText}</span>}
      </h2>
      <div className="reviews">
        {reviewCount > 0 ? (
          reviews.map(review => (
            <div key={review.id} className="review">
              <p><strong>{review.user.firstName}</strong></p>
              <p>{new Date(review.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p>Be the first to post a review!</p>
        )}
      </div>
    </div>
  );
};

export default SpotDetails;