import { csrfFetch } from './csrf';

// Action Types
const SET_REVIEWS = 'reviews/setReviews';
const ADD_REVIEW = 'reviews/addReview';
const UPDATE_REVIEW = 'reviews/updateReview';
const REMOVE_REVIEW = 'reviews/removeReview';
const ADD_REVIEW_IMAGE = 'reviews/addReviewImage';
const DELETE_REVIEW_IMAGE = 'reviews/deleteReviewImage';
const SET_NO_REVIEWS = 'reviews/setNoReviews';
const SET_USER_REVIEWS = 'reviews/setUserReviews';

// Action Creators
export const setReviews = (reviews) => ({
  type: SET_REVIEWS,
  reviews,
});

export const addReview = (review) => ({
  type: ADD_REVIEW,
  review,
});

export const updateReview = (review) => ({
  type: UPDATE_REVIEW,
  review,
});

export const removeReview = (reviewId) => ({
  type: REMOVE_REVIEW,
  reviewId,
});

export const addReviewImage = (reviewId, imageUrl) => ({
  type: ADD_REVIEW_IMAGE,
  reviewId,
  imageUrl,
});

export const deleteReviewImage = (reviewId, imageId) => ({
  type: DELETE_REVIEW_IMAGE,
  reviewId,
  imageId,
});

export const setNoReviews = () => ({
  type: SET_NO_REVIEWS,
});

export const setUserReviews = (reviews) => ({
  type: SET_USER_REVIEWS,
  reviews,
});

// Thunks
export const fetchReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  if (response.ok) {
    const reviews = await response.json();
    dispatch(setReviews(reviews));
  }
};

export const fetchUserReviews = () => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/current`);
  if (response.ok) {
    const reviews = await response.json();
    dispatch(setUserReviews(reviews.reviews));
  }
};

export const createReview = (review) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${review.spotId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review),
  });

  if (response.ok) {
    const newReview = await response.json();
    console.log('Backend Response:', newReview); // Debugging log
    dispatch(addReview(newReview));
  } else {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
};

export const editReview = (review) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${review.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review),
  });

  if (response.ok) {
    const updatedReview = await response.json();
    dispatch(updateReview(updatedReview));
  } else {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
};

export const deleteReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    dispatch(removeReview(reviewId));
  } else {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
};

// Initial State
const initialState = { reviews: [], userReviews: [] };

// Reducer
const reviewsReducer = (state = initialState, action) => {
  console.log('Reducer State (before):', state.reviews); // Debugging log
  console.log('Action:', action); // Debugging log

  switch (action.type) {
    case SET_REVIEWS:
      return { ...state, reviews: action.reviews };
    case ADD_REVIEW:
      return { ...state, reviews: [...state.reviews, action.review] };
    case UPDATE_REVIEW:
      return {
        ...state,
        reviews: state.reviews.map((review) =>
          review.id === action.review.id ? action.review : review
        ),
      };
    case REMOVE_REVIEW:
      return {
        ...state,
        reviews: Array.isArray(state.reviews) ? state.reviews.filter((review) => review.id !== action.reviewId) : [],
      };
    case ADD_REVIEW_IMAGE:
      return {
        ...state,
        reviews: state.reviews.map((review) =>
          review.id === action.reviewId
            ? { ...review, images: [...review.images, action.imageUrl] }
            : review
        ),
      };
    case DELETE_REVIEW_IMAGE:
      return {
        ...state,
        reviews: state.reviews.map((review) =>
          review.id === action.reviewId
            ? { ...review, images: review.images.filter((image) => image.id !== action.imageId) }
            : review
        ),
      };
    case SET_USER_REVIEWS:
      return { ...state, userReviews: action.reviews };
    case SET_NO_REVIEWS:
      return { ...state, reviews: [], noReviews: true };
    default:
      return state;
  }
};

export default reviewsReducer;