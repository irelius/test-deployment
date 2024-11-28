// frontend/src/components/ReviewImageList/ReviewImageList.jsx

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviewImages, deleteReviewImage } from '../../store/reviewImages';

const ReviewImageList = ({ reviewId }) => {
  const dispatch = useDispatch();
  const reviewImages = useSelector(state => state.reviewImages.reviewImages);

  useEffect(() => {
    dispatch(fetchReviewImages(reviewId));
  }, [dispatch, reviewId]);

  const handleDelete = (imageId) => {
    dispatch(deleteReviewImage(imageId));
  };

  return (
    <div>
      <h2>Review Images</h2>
      {reviewImages.map(image => (
        <div key={image.id}>
          <img src={image.url} alt="Review" />
          <button onClick={() => handleDelete(image.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default ReviewImageList;