// frontend/src/store/reviews.js

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

export const deleteReviewImage = (reviewId, imageUrl) => ({
  type: DELETE_REVIEW_IMAGE,
  reviewId,
  imageUrl,
});

export const setNoReviews = () => ({
  type: SET_NO_REVIEWS,
});

export const setUserReviews = (reviews) => ({
  type: SET_USER_REVIEWS,
  reviews,
});

// Thunk Action Creators
export const fetchReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  if (response.ok) {
    const reviews = await response.json();
    dispatch(setReviews(reviews));
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
    dispatch(addReview(review));
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
    dispatch(updateReview(review));
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

export const fetchUserReviews = (userId) => async (dispatch) => {
  const response = await csrfFetch(`/api/users/${userId}/reviews`);
  if (response.ok) {
    const reviews = await response.json();
    dispatch(setUserReviews(reviews));
  } else {
    const error = await response.json();
    throw new Error(error.message);
  }
};

// Initial State
const initialState = {
  reviews: [],
  userReviews: [],
};

// Reducer
const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_REVIEWS:
      return {
        ...state,
        reviews: action.reviews,
      };
    case ADD_REVIEW:
      return {
        ...state,
        reviews: [...state.reviews, action.review],
      };
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
        reviews: state.reviews.filter((review) => review.id !== action.reviewId),
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
            ? { ...review, images: review.images.filter((url) => url !== action.imageUrl) }
            : review
        ),
      };
    case SET_NO_REVIEWS:
      return {
        ...state,
        reviews: [],
      };
    case SET_USER_REVIEWS:
      return {
        ...state,
        userReviews: action.reviews,
      };
    default:
      return state;
  }
};

export default reviewsReducer;