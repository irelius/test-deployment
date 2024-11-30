// frontend/src/store/reviews.js

import { csrfFetch } from './csrf';

// Action Types
const SET_REVIEWS = 'reviews/setReviews';
const ADD_REVIEW = 'reviews/addReview';
const UPDATE_REVIEW = 'reviews/updateReview';
const REMOVE_REVIEW = 'reviews/removeReview';
const ADD_REVIEW_IMAGE = 'reviews/addReviewImage';
const DELETE_REVIEW_IMAGE = 'reviews/deleteReviewImage';

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

export const addReviewImageAction = (reviewId, imageUrl) => ({
  type: ADD_REVIEW_IMAGE,
  reviewId,
  imageUrl,
});

export const deleteReviewImageAction = (reviewId, imageId) => ({
  type: DELETE_REVIEW_IMAGE,
  reviewId,
  imageId,
});

// Thunk Action Creators
export const fetchReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  if (response.ok) {
    const data = await response.json();
    dispatch(setReviews(data.Reviews));
  } else {
    throw response;
  }
};

export const createReview = (spotId, review) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(review),
  });
  const data = await response.json();
  dispatch(addReview(data.review));
  return response;
};

export const editReview = (review) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${review.id}`, {
    method: 'PUT',
    body: JSON.stringify(review),
  });
  const data = await response.json();
  dispatch(updateReview(data.review));
  return response;
};

export const deleteReview = (reviewId) => async (dispatch) => {
  await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE',
  });
  dispatch(removeReview(reviewId));
};

export const addReviewImage = (reviewId, imageUrl) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}/images`, {
    method: 'POST',
    body: JSON.stringify({ url: imageUrl }),
  });
  const data = await response.json();
  dispatch(addReviewImageAction(reviewId, data.image.url));
  return response;
};

export const deleteReviewImage = (reviewId, imageId) => async (dispatch) => {
  await csrfFetch(`/api/reviews/${reviewId}/images/${imageId}`, {
    method: 'DELETE',
  });
  dispatch(deleteReviewImageAction(reviewId, imageId));
};

// Initial State
const initialState = { reviews: [] };

// Reducer
const reviewsReducer = (state = initialState, action) => {
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
        reviews: state.reviews.filter((review) => review.id !== action.reviewId),
      };
    case ADD_REVIEW_IMAGE:
      return {
        ...state,
        reviews: state.reviews.map((review) =>
          review.id === action.reviewId
            ? { ...review, ReviewImages: [...review.ReviewImages, { url: action.imageUrl }] }
            : review
        ),
      };
    case DELETE_REVIEW_IMAGE:
      return {
        ...state,
        reviews: state.reviews.map((review) =>
          review.id === action.reviewId
            ? { ...review, ReviewImages: review.ReviewImages.filter(image => image.id !== action.imageId) }
            : review
        ),
      };
    default:
      return state;
  }
};

export default reviewsReducer;