// frontend/src/store/spots.js

import { csrfFetch } from './csrf';

// Action Types
const SET_SPOTS = 'spots/setSpots';
const ADD_SPOT = 'spots/addSpot';
const UPDATE_SPOT = 'spots/updateSpot';
const REMOVE_SPOT = 'spots/removeSpot';
const SET_SPOT_DETAILS = 'spots/setSpotDetails';
const SET_USER_LISTINGS = 'spots/setUserListings'; // New action type

// Action Creators
export const setSpots = (spots) => ({
  type: SET_SPOTS,
  spots,
});

export const addSpot = (spot) => ({
  type: ADD_SPOT,
  spot,
});

export const updateSpot = (spot) => ({
  type: UPDATE_SPOT,
  spot,
});

export const removeSpot = (spotId) => ({
  type: REMOVE_SPOT,
  spotId,
});

export const setSpotDetails = (spot) => ({
  type: SET_SPOT_DETAILS,
  spot,
});

export const setUserListings = (listings) => ({
  type: SET_USER_LISTINGS,
  listings,
});

// Thunk Action Creators
export const fetchSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots');
  const data = await response.json();
  dispatch(setSpots(data.Spots));
  return response;
};

export const fetchSpotDetails = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(setSpotDetails(data.spot));
  } else {
    throw response;
  }
};

export const fetchUserListings = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots/current');
  const data = await response.json();
  dispatch(setUserListings(data.Spots));
  return response;
};

export const createSpot = (spot) => async (dispatch) => {
  const response = await csrfFetch('/api/spots', {
    method: 'POST',
    body: JSON.stringify(spot),
  });
  const data = await response.json();
  dispatch(addSpot(data.spot));
  return response;
};

export const editSpot = (spot) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spot.id}`, {
    method: 'PUT',
    body: JSON.stringify(spot),
  });
  const data = await response.json();
  dispatch(updateSpot(data.spot));
  return response;
};

export const deleteSpot = (spotId) => async (dispatch) => {
  await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE',
  });
  dispatch(removeSpot(spotId));
};

// Initial State
const initialState = { spots: [], spotDetails: null, userListings: [] };

// Reducer
const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SPOTS:
      return { ...state, spots: action.spots };
    case ADD_SPOT:
      return { ...state, spots: [...state.spots, action.spot] };
    case UPDATE_SPOT:
      return {
        ...state,
        spots: state.spots.map((spot) =>
          spot.id === action.spot.id ? action.spot : spot
        ),
      };
    case REMOVE_SPOT:
      return {
        ...state,
        spots: state.spots.filter((spot) => spot.id !== action.spotId),
      };
    case SET_SPOT_DETAILS:
      return { ...state, spotDetails: action.spot };
    case SET_USER_LISTINGS:
      return { ...state, userListings: action.listings };
    default:
      return state;
  }
};

export default spotsReducer;