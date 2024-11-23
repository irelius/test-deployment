// frontend/src/store/session.js

import { csrfFetch } from './csrf';

// Action Types
const SET_SESSION_USER = 'session/setSessionUser';
const REMOVE_SESSION_USER = 'session/removeSessionUser';

// Action Creators
export const setSessionUser = (user) => ({
    type: SET_SESSION_USER,
    user,
});

export const removeSessionUser = () => ({
    type: REMOVE_SESSION_USER,
});

// Thunk Action Creators
export const login = (credentials) => async (dispatch) => {
    const response = await csrfFetch('/api/session', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
    const data = await response.json();
    dispatch(setSessionUser(data.user));
    return response;
};

export const logout = () => async (dispatch) => {
    await csrfFetch('/api/session', {
        method: 'DELETE',
    });
    dispatch(removeSessionUser());
};

export const signup = (user) => async (dispatch) => {
    const { email, password } = user;
    const response = await csrfFetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    dispatch(setSessionUser(data.user));
    return response;
};

// Initial State
const initialState = { user: null };

// Reducer
const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SESSION_USER:
            return { ...state, user: action.user };
        case REMOVE_SESSION_USER:
            return { ...state, user: null };
        default:
            return state;
    }
};

export default sessionReducer;