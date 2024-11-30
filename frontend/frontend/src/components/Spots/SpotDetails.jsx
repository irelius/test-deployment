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

  return (
    <div>
      <h1>{spot.address}</h1>
      <p>{spot.city}, {spot.state}</p>
      <div>
        <FontAwesomeIcon icon={faStar} /> {spot.rating}
      </div>
      <ReviewList reviews={spot.reviews} />
    </div>
  );
};

export default SpotDetails;