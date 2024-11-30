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

const setNoReviews = () => ({
  type: SET_NO_REVIEWS,
});

// Thunks
export const fetchReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  if (response.ok) {
    const reviews = await response.json();
    dispatch(setReviews(reviews));
  } else if (response.status === 404) {
    dispatch(setNoReviews());
  } else {
    console.error('Error fetching reviews:', response);
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
    dispatch(addReview(newReview));
  } else {
    console.error('Error submitting review:', response);
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
    console.error('Error updating review:', response);
  }
};

export const deleteReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    dispatch(removeReview(reviewId));
  } else {
    console.error('Error deleting review:', response);
  }
};

// Initial State
const initialState = { reviews: [], noReviews: false };

// Reducer
const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_REVIEWS:
      return { ...state, reviews: action.reviews, noReviews: false };
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
            ? { ...review, images: review.images.filter((image) => image.id !== action.imageId) }
            : review
        ),
      };
    case SET_NO_REVIEWS:
      return { ...state, reviews: [], noReviews: true };
    default:
      return state;
  }
};

export default reviewsReducer;