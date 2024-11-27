// frontend/src/store/spots.js

import { csrfFetch } from './csrf';

// Action Types
const SET_SPOTS = 'spots/setSpots';
const ADD_SPOT = 'spots/addSpot';
const REMOVE_SPOT = 'spots/removeSpot';

// Action Creators
export const setSpots = (spots) => ({
  type: SET_SPOTS,
  spots,
});

export const addSpot = (spot) => ({
  type: ADD_SPOT,
  spot,
});

export const removeSpot = (spotId) => ({
  type: REMOVE_SPOT,
  spotId,
});

// Thunk Action Creators
export const fetchUserSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots/current');
  const data = await response.json();
  dispatch(setSpots(data.Spots));
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

export const deleteSpot = (spotId) => async (dispatch) => {
  await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE',
  });
  dispatch(removeSpot(spotId));
};

// Initial State
const initialState = { spots: [] };

// Reducer
const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SPOTS:
      return { ...state, spots: action.spots };
    case ADD_SPOT:
      return { ...state, spots: [...state.spots, action.spot] };
    case REMOVE_SPOT:
      return { ...state, spots: state.spots.filter(spot => spot.id !== action.spotId) };
    default:
      return state;
  }
};

export default spotsReducer;