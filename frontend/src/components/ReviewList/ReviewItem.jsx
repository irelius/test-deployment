import reviewItemStyles from './ReviewItem.module.css';

const ReviewItem = ({ review, sessionUser, onDelete, onEdit }) => {
  return (
    <div className={reviewItemStyles.review}>
      <p><strong>{review.User.firstName}</strong> - {new Date(review.createdAt).toLocaleDateString()}</p>
      <p>{review.review}</p>
      <p>Rating: {review.stars}</p>
      {sessionUser && sessionUser.id === review.userId && (
        <>
          <button className={reviewItemStyles.button} onClick={onEdit}>Edit</button>
          <button className={reviewItemStyles.button} onClick={() => onDelete(review.id)}>Delete</button>
        </>
      )}
    </div>
  );
};

export default ReviewItem;