// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUserReviews, deleteReview } from '../../store/reviews';
// import ReviewItem from './ReviewItem';
// import ReviewModal from '../ReviewModal/ReviewModal';
// import { useModal } from '../../context/Modal';
// import { useOutletContext } from 'react-router-dom';
// import manageReviewsStyles from './ManageReviews.module.css';

// const ManageReviews = () => {
//   const dispatch = useDispatch();
//   const { sessionUser } = useOutletContext();
//   const reviews = useSelector(state => state.reviews.reviews|| []);
//   const { setModalContent, closeModal } = useModal();

//   useEffect(() => {
//     if (sessionUser) {
//       dispatch(fetchUserReviews(sessionUser.id));
//     }
//   }, [dispatch, sessionUser]);

//   const handleDelete = async () => {
//     await dispatch(deleteReview(reviews.id));
//     dispatch(fetchUserReviews(sessionUser.id)); 
//   };

//   // const openReviewModal = (formType, review) => {
//   //   setModalContent(
//   //     <ReviewModal
//   //       formType={formType}
//   //       review={review}
//   //       spotId={review.spotId}
//   //       spotName={review.Spot.name}
//   //       closeModal={closeModal}
//   //     />
//   //   );
//   // };

//   return (
//     <div className={manageReviewsStyles.manageReviews}>
//       <h2>Manage Your Reviews</h2>
//       {reviews.length === 0 ? (
//         <p>You have not written any reviews yet.</p>
//       ) : (
//         reviews(review => (
//           <ReviewItem
//             key={review.id}
//             review={review}
//             sessionUser={sessionUser}
//             onDelete={handleDelete}
//             onEdit={() => openReviewModal('Edit', review)}
//           />
//         ))
//       )}
//     </div>
//   );
// };

// // export default ManageReviews;