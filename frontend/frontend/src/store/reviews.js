import { csrfFetch } from './csrf';

// Action Types
const SET_REVIEWS = 'reviews/setReviews';
const SET_REVIEW = 'reviews/setReview';
const REMOVE_REVIEW = 'reviews/removeReview';
const SET_NO_REVIEWS = 'reviews/setNoReviews';

// Action Creators
export const setReviews = (reviews) => ({
  type: SET_REVIEWS,
  reviews,
});

export const setReview = (review) => ({
  type: SET_REVIEW,
  review,
});

export const removeReview = (reviewId) => ({
  type: REMOVE_REVIEW,
  reviewId,
});

export const setNoReviews = () => ({
  type: SET_NO_REVIEWS,
});

// Thunk Action Creators
export const fetchReviewsBySpotId = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/spots/${spotId}/reviews`);
  if (response.ok) {
    const reviews = await response.json();
    dispatch(setReviews(reviews));
  } else {
    dispatch(setNoReviews());
  }
};

export const createReview = (reviewData) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${reviewData.spotId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reviewData),
  });
  if (response.ok) {
    const review = await response.json();
    dispatch(setReview(review));
  } else {
    const error = await response.json();
    throw new Error(error.message);
  }
};

export const editReview = (reviewData) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewData.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reviewData),
  });
  if (response.ok) {
    const review = await response.json();
    dispatch(setReview(review));
  } else {
    const error = await response.json();
    throw new Error(error.message);
  }
};

export const deleteReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE',
  });
  if (response.ok) {
    dispatch(removeReview(reviewId));
  } else {
    const error = await response.json();
    throw new Error(error.message);
  }
};

// Initial State
const initialState = {
  reviews: [],
  noReviews: false,
};

// Reducer
const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_REVIEWS:
      return {
        ...state,
        reviews: action.reviews,
        noReviews: action.reviews.length === 0,
      };
    case SET_REVIEW:
      return {
        ...state,
        reviews: [...state.reviews.filter(r => r.id !== action.review.id), action.review],
        noReviews: false,
      };
    case REMOVE_REVIEW:
      return {
        ...state,
        reviews: state.reviews.filter(review => review.id !== action.reviewId),
      };
    case SET_NO_REVIEWS:
      return {
        ...state,
        reviews: [],
        noReviews: true,
      };
    default:
      return state;
  }
};

export default reviewsReducer;