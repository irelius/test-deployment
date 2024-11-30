import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotDetails } from '../../store/spots';
import { fetchReviews } from '../../store/reviews';
import ReviewList from '../ReviewList/ReviewList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const SpotDetails = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector(state => state.spots.spotDetails);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchSpotDetails(spotId));
        await dispatch(fetchReviews(spotId));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching spot details:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch, spotId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!spot) {
    return <div>Spot not found</div>;
  }

  const avgRating = spot.avgRating ? spot.avgRating.toFixed(2) : 'New';
  const reviewCount = spot.Reviews.length;
  const reviewSummaryText = reviewCount === 1 ? '1 Review' : `${reviewCount} Reviews`;

  return (
    <div className="spot-details">
      <h1>{spot.name}</h1>
      <p>Location: {spot.city}, {spot.state}, {spot.country}</p>
      <div className="spot-images">
        {spot.SpotImages && spot.SpotImages.map((image, index) => (
          <img key={index} src={image.url} alt={`${spot.name} ${index + 1}`} className="spot-image" />
        ))}
      </div>
      <p>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</p>
      <p>{spot.description}</p>
      <div className="callout-box">
        <p>${spot.price} / night</p>
        <div>
          <FontAwesomeIcon icon={faStar} /> {avgRating}
          {reviewCount > 0 && <span> · {reviewSummaryText}</span>}
        </div>
        <button onClick={() => alert('Feature coming soon')}>Reserve</button>
      </div>
      <h2>
        <FontAwesomeIcon icon={faStar} /> {avgRating}
        {reviewCount > 0 && <span> · {reviewSummaryText}</span>}
      </h2>
      <ReviewList spotId={spotId} />
    </div>
  );
};

export default SpotDetails;