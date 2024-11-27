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
        console.log('User logged in:', data.user); // ! Console log
        return response;
    } catch (error) {
        console.error('Error logging in:', error); // ! Console log
    }
};

export const logout = () => async (dispatch) => {
    try {
        await csrfFetch('/api/session', {
            method: 'DELETE',
        });
        dispatch(removeSessionUser());
        console.log('User logged out'); // ! Console log
    } catch (error) {
        console.error('Error logging out:', error); // ! Console log
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
        console.log('User signed up:', data.user); // ! Console log
        return response;
    } catch (error) {
        console.error('Error signing up:', error); // ! Console log
    }
};

export const restoreUser = () => async (dispatch) => {
    try {
        const response = await csrfFetch('/api/session');
        const data = await response.json();
        console.log('Response from /api/session:', data); // ! Console log
        dispatch(setSessionUser(data.user));
        console.log('User restored:', data.user); // ! Console log
        return response;
    } catch (error) {
        console.error('Error fetching user:', error); // ! Console log
    }
};

// Initial State
const initialState = { user: null };

// Reducer
const sessionReducer = (state = initialState, action) => {
    console.log('Reducer action:', action);     // ! Console log
    switch (action.type) {
        case SET_SESSION_USER:
            console.log('Setting session user:', action.user);  // ! Console log
            return { ...state, user: action.user };
        case REMOVE_SESSION_USER:
            console.log('Removing session user');  // ! Console log
            return { ...state, user: null };
        default:
            return state;
    }
};

export default sessionReducer;