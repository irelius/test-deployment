import { csrfFetch } from './csrf';

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
        console.error('Error logging in:', error); // Handle the error
    }
};

export const logout = () => async (dispatch) => {
    try {
        await csrfFetch('/api/session', {
            method: 'DELETE',
        });
        dispatch(removeSessionUser());
    } catch (error) {
        console.error('Error logging out:', error); // Handle the error
    }
};

export const signup = (user) => async (dispatch) => {
    try {
        const { username, firstName, lastName, email, password } = user;
        const response = await csrfFetch('/api/users', {
            method: 'POST',
            body: JSON.stringify({ username, firstName, lastName, email, password }),
        });
        const data = await response.json();
        dispatch(setSessionUser(data.user));
        return response;
    } catch (error) {
        console.error('Error signing up:', error); // Handle the error
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