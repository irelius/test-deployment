import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotDetails } from '../../store/spots';
import { fetchReviews } from '../../store/reviews';
import ReviewList from '../ReviewList/ReviewList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './SpotDetails.css';

const SpotDetails = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector(state => state.spots.spotDetails);
  const reviews = useSelector(state => state.reviews.spotReviews);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('SpotDetails component mounted');
    console.log('spotId:', spotId);

    const fetchData = async () => {
      try {
        console.log('Fetching spot details for spotId:', spotId);
        const spotDetailsResponse = await dispatch(fetchSpotDetails(spotId));
        console.log('Spot details response:', spotDetailsResponse);

        console.log('Fetching reviews for spotId:', spotId);
        const reviewsResponse = await dispatch(fetchReviews(spotId));
        console.log('Reviews response:', reviewsResponse);

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

  return (
    <div className="spot-details">
      <h1>{spot.name}</h1>
      <div className="spot-rating">
        <FontAwesomeIcon icon={faStar} /> {spot.avgRating ? spot.avgRating.toFixed(2) : 'New'}
      </div>
      <img src={spot.previewImage} alt={spot.name} className="spot-image" />
      <div className="spot-info">
        <p>{spot.description}</p>
        <p>{spot.city}, {spot.state}</p>
        <p>${spot.price} / night</p>
      </div>
      <div className="spot-reviews">
        <h2>Reviews</h2>
        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
};

export default SpotDetails;