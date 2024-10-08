import { csrfFetch } from './csrf';

// Action Types
const SET_USERS = 'users/SET_USERS';

// Action Creators
const setUsersAction = (users) => ({
    type: SET_USERS,
    users,
});

// Thunk for fetching all users
export const fetchUsers = () => async (dispatch) => {
    const response = await csrfFetch('/api/users');
    
    if (response.ok) {
        const users = await response.json();
        dispatch(setUsersAction(users));
        return users;
    }
};

// Reducer
const initialState = {};

const userReducer = (state = initialState, action) => {
    let newState = {}
    switch (action.type) {
        case SET_USERS:
            // const newState = {};
            action.users.forEach(user => {
                newState[user.id] = user;
            });
            return newState;
        default:
            return state;
    }
};

// const userReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case SET_USERS: {
//             const newState = {};
//             action.users.forEach(user => {
//                 newState[user.id] = user;
//             });
//             return newState;
//         }
//         default:
//             return state;
//     }
// };

export default userReducer;