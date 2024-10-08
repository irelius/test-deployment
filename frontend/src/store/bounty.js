import { csrfFetch } from './csrf';

//Constants LOAD(READ) - ADD(CREATE) - UPDATE - DELETE
const SET_BOUNTIES = 'bounty/setBounties';
const ADD_BOUNTY = 'bounty/addBounty';
const UPDATE_BOUNTY = 'bounty/updateBounty';
const DELETE_BOUNTY = 'bounty/deleteBounty';

//Action Creators
//view all bounties
const setBounties = (bounties) => {
    return {
        type: SET_BOUNTIES,
        payload: bounties
    }
}
//add bounty
const addBounty = (bounty) => {
    return {
        type: ADD_BOUNTY,
        payload: bounty
    };
};
// update bounty
const updateBounty = (bounty) => {
    return {
        type: UPDATE_BOUNTY,
        payload: bounty
    };
};
// delete bounty
const deleteBounty = (bountyId) => {
    return {
        type: DELETE_BOUNTY,
        payload: bountyId
    };
};

//Thunks
// fetch all bounties
export const fetchBounties = () => async (dispatch) => {
    const response = await csrfFetch('/api/bounty');
    // console.log("fetchBounties response", response)
    if (response.ok) {
        const bounties = await response.json();
        // console.log("fetchBounties bounties", bounties)
        dispatch(setBounties(bounties));
    }
};
// create new bounty
export const createBounty = (bountyData) => async (dispatch) => {
    const response = await csrfFetch('/api/bounty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bountyData)
    });

    if (response.ok) {
        const newBounty = await response.json();
        dispatch(addBounty(newBounty));
    }
};
// update bounty
export const updateExistingBounty = (bountyId, bountyData) => async (dispatch) => {
    const response = await csrfFetch(`/api/bounty/${bountyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bountyData)
    });

    if (response.ok) {
        const updatedBounty = await response.json();
        dispatch(updateBounty(updatedBounty));
    }
};
// Delete a bounty
export const removeBounty = (bountyId) => async (dispatch) => {
    console.log("REMOVEBOUNTY TEST")
    const response = await csrfFetch(`/api/bounty/${bountyId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        console.log("BOUNTID IN REMOVEBOUNTY THUNK",bountyId)
        dispatch(deleteBounty(bountyId));
    }
};

//Initialize State + Reducer
const initialState = {
    bounties: []
};
const bountyReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_BOUNTIES:
            // console.log("REDUCER state", state)
            // console.log("REDUCER action.payload", action.payload)
            // const bounties = Array.isArray(action.payload) ? action.payload : [action.payload];
            // console.log("REDUCER bounties", bounties)
            // return { ...state, bounties };  // Use the array-ified bounties
            return { ...state, bounties: action.payload };
        case ADD_BOUNTY:
            return { ...state, bounties: [...state.bounties, action.payload] };
        case UPDATE_BOUNTY:
            return {
                ...state,
                bounties: state.bounties.map((bounty) =>
                    bounty.id === action.payload.id ? action.payload : bounty
                ),
            };
        case DELETE_BOUNTY:
            console.log()
            return {
                ...state,
                bounties: state.bounties.filter(bounty => bounty.id !== action.payload)
            };
        default:
            return state;
    }
};

export default bountyReducer;