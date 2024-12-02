// frontend/src/components/Reviews/ReviewItem.jsx

const ReviewItem = ({ review, sessionUser, onDelete, onEdit }) => {
  return (
    <div className="review">
      <p><strong>{review.User.firstName}</strong> - {new Date(review.createdAt).toLocaleDateString()}</p>
      <p>{review.review}</p>
      <p>Rating: {review.stars}</p>
      {sessionUser && sessionUser.id === review.userId && (
        <>
          <button onClick={onEdit}>Edit</button>
          <button onClick={() => onDelete(review.id)}>Delete</button>
        </>
      )}
    </div>
  );
};

export default ReviewItem;