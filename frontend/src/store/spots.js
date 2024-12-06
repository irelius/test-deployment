import { csrfFetch } from './csrf';

// Action Types
const GET_ALL_SPOTS = 'spots/getAllSpots';
const GET_CURRENT_USER_SPOTS = 'spots/getCurrentUserSpots';
const GET_SPOT_DETAILS = 'spots/getSpotDetails';
const CREATE_NEW_SPOT = 'spots/createNewSpot';
const UPDATE_SPOT = 'spots/updateSpot';
const DELETE_SPOT = 'spots/deleteSpot';
const ADD_SPOT_IMAGE = 'spots/addSpotImage';
const UPDATE_SPOT_IMAGE = 'spots/updateSpotImage';
const DELETE_SPOT_IMAGE = 'spots/deleteSpotImage';
const GET_REVIEWS_BY_SPOT = 'spots/getReviewsBySpot';
const CREATE_NEW_REVIEW = 'spots/createNewReview';
const SET_NO_SPOTS_AVAILABLE = 'spots/setNoSpotsAvailable';
const CLEAR_NO_SPOTS_MESSAGE = 'spots/clearNoSpotsMessage';

// Action Creators
export const getAllSpots = (spots) => ({
  type: GET_ALL_SPOTS,
  spots,
});

export const getCurrentUserSpots = (spots) => ({
  type: GET_CURRENT_USER_SPOTS,
  spots,
});

export const getSpotDetails = (spot) => ({
  type: GET_SPOT_DETAILS,
  spot,
});

export const createNewSpot = (spot) => ({
  type: CREATE_NEW_SPOT,
  spot,
});

export const updateSpot = (spot) => ({
  type: UPDATE_SPOT,
  spot,
});

export const deleteSpotAction = (spotId) => ({
  type: DELETE_SPOT,
  spotId,
});

export const addSpotImage = (spotId, imageUrl) => ({
  type: ADD_SPOT_IMAGE,
  spotId,
  imageUrl,
});

export const updateSpotImage = (spotId, imageUrl) => ({
  type: UPDATE_SPOT_IMAGE,
  spotId,
  imageUrl,
});

export const deleteSpotImage = (spotId, imageUrl) => ({
  type: DELETE_SPOT_IMAGE,
  spotId,
  imageUrl,
});

export const getReviewsBySpot = (reviews) => ({
  type: GET_REVIEWS_BY_SPOT,
  reviews,
});

export const createNewReview = (review) => ({
  type: CREATE_NEW_REVIEW,
  review,
});

export const setNoSpotsAvailable = () => ({
  type: SET_NO_SPOTS_AVAILABLE,
});

export const clearNoSpotsMessage = () => ({
  type: CLEAR_NO_SPOTS_MESSAGE,
});

// Thunks
export const fetchSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots');
  const data = await response.json();
  dispatch(getAllSpots(data.Spots));
  return response;
};

export const fetchSpotDetails = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    if (!response.ok) {
      throw response;
    }
    const data = await response.json();
    dispatch(getSpotDetails(data));
    return data;
  } catch (err) {
    console.error('Error fetching spot details:', err);
  }
};

export const fetchUserListings = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots/current');
  const data = await response.json();
  dispatch(getCurrentUserSpots(data.Spots));
  return response;
};

export const createSpot = (spot) => async (dispatch) => {
  const response = await csrfFetch('/api/spots', {
    method: 'POST',
    body: JSON.stringify(spot),
  });

  const data = await response.json();

  if (response.ok) {
    dispatch(createNewSpot(data));
    return data;
  } else {
    throw data;
  }
};

export const editSpot = (spot) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spot.id}`, {
    method: 'PUT',
    body: JSON.stringify(spot),
  });
  const data = await response.json();
  dispatch(updateSpot(data));
  return data;
};

export const deleteSpot = (spotId) => async (dispatch) => {
  await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE',
  });
  dispatch(deleteSpotAction(spotId));
};

// Initial State
const initialState = {
  allSpots: [],
  currentUserSpots: [],
  spotDetails: null,
  noSpotsMessage: null,
};

// Reducer
const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SPOTS:
      return {
        ...state,
        allSpots: action.spots,
      };
    case GET_CURRENT_USER_SPOTS:
      return {
        ...state,
        currentUserSpots: action.spots,
      };
    case GET_SPOT_DETAILS:
      return {
        ...state,
        spotDetails: action.spot,
      };
    case CREATE_NEW_SPOT:
      return {
        ...state,
        allSpots: [...state.allSpots, action.spot],
        currentUserSpots: [...state.currentUserSpots, action.spot],
      };
    case UPDATE_SPOT:
      return {
        ...state,
        allSpots: state.allSpots.map((spot) =>
          spot.id === action.spot.id ? action.spot : spot
        ),
        currentUserSpots: state.currentUserSpots.map((spot) =>
          spot.id === action.spot.id ? action.spot : spot
        ),
      };
    case DELETE_SPOT:
      return {
        ...state,
        allSpots: state.allSpots.filter((spot) => spot.id !== action.spotId),
        currentUserSpots: state.currentUserSpots.filter((spot) => spot.id !== action.spotId),
      };
    case ADD_SPOT_IMAGE:
    case UPDATE_SPOT_IMAGE:
    case DELETE_SPOT_IMAGE:
    case GET_REVIEWS_BY_SPOT:
    case CREATE_NEW_REVIEW:
    case SET_NO_SPOTS_AVAILABLE:
    case CLEAR_NO_SPOTS_MESSAGE:
      return state; 
    default:
      return state;
  }
};

export default spotsReducer;