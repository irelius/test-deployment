// frontend/src/store/session.js

import { csrfFetch } from './csrf';

const SET_SESSION_USER = 'session/setSessionUser';
const REMOVE_SESSION_USER = 'session/removeSessionUser';
const LOGIN_DEMO_USER = 'session/loginDemoUser'; 
const SET_SESSION_ERRORS = 'session/setSessionErrors';

// Action Creators
export const setSessionUser = (user) => ({
    type: SET_SESSION_USER,
    user,
});

export const removeSessionUser = () => ({
    type: REMOVE_SESSION_USER,
});

export const loginDemoUser = () => ({
    type: LOGIN_DEMO_USER,
    user: { username: 'demo', email: 'demo@example.com', firstName: 'Demo', lastName: 'User' }, 
});

export const setSessionErrors = (errors) => ({
    type: SET_SESSION_ERRORS,
    errors,
  });

// Thunk 
export const login = (credentials) => async (dispatch) => {
    try {
        const response = await csrfFetch('/api/session', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        const data = await response.json();
        dispatch(setSessionUser(data.user));
        return response;
    } catch (error) {
        if (error.data && error.data.errors) {
            dispatch(setSessionErrors(error.data.errors));
        } else {
            dispatch(setSessionErrors({ general: 'An unexpected error occurred' }));
        }
    }
};

export const logout = () => async (dispatch) => {
    try {
        await csrfFetch('/api/session', {
            method: 'DELETE',
        });
        dispatch(removeSessionUser());
    } catch (error) {
        console.error('Error logging out:', error); 
    }
};

export const signup = (user) => async (dispatch) => {
    try {
      const response = await csrfFetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(user),
      });
      const data = await response.json();
      dispatch(setSessionUser(data.user));
    } catch (error) {
      if (error.data && error.data.errors) {
        dispatch(setSessionErrors(error.data.errors));
      } else {
        dispatch(setSessionErrors({ general: 'An unexpected error occurred' }));
      }
    }
  };

export const restoreUser = () => async (dispatch) => {
    try {
        const response = await csrfFetch('/api/session');
        const data = await response.json();
        dispatch(setSessionUser(data.user));
        return response;
    } catch (error) {
        console.error('Error restoring user:', error); // Handle the error
    }
};

// Initial State
const initialState = { user: null, errors: [] };

// Reducer
const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SESSION_USER:
      return { ...state, user: action.user, errors: [] };
    case REMOVE_SESSION_USER:
      return { ...state, user: null, errors: [] };
    case LOGIN_DEMO_USER:
      return { ...state, user: action.user, errors: [] };
    case SET_SESSION_ERRORS:
      return { ...state, errors: action.errors };
    default:
      return state;
  }
};

export default sessionReducer;