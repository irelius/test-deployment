// frontend/src/components/Users/MyReviews/MyReviews.jsx


import { useSelector } from 'react-redux';
import './MyReviews.css';

function MyReviews() {
  const sessionUser = useSelector(state => state.session.user);

  if (!sessionUser) {
    return <div>Please log in to view your reviews.</div>;
  }

  return (
    <div className="my-reviews">
      <h1>My Reviews</h1>
      {/* Render user's reviews  */}
    </div>
  );
}

export default MyReviews;