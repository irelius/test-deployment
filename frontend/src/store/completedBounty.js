import { csrfFetch } from './csrf';

// Action Types
const CREATE_COMPLETED_BOUNTY = 'completedBounty/CREATE_COMPLETED_BOUNTY';
const SET_COMPLETED_BOUNTIES = 'completedBounty/SET_COMPLETED_BOUNTIES';
const SET_COMPLETED_BOUNTIES_BY_BOUNTY = 'completedBounty/SET_COMPLETED_BOUNTIES_BY_BOUNTY';

// Action Creators
const createCompletedBountyAction = (completedBounty) => ({
    type: CREATE_COMPLETED_BOUNTY,
    completedBounty,
});
const setCompletedBountiesAction = (completedBounties) => ({
    type: SET_COMPLETED_BOUNTIES,
    completedBounties,
});
const setCompletedBountiesByBountyAction = (completedBounties) => ({
    type: SET_COMPLETED_BOUNTIES_BY_BOUNTY,
    completedBounties,
});

// Thunk for creating a completed bounty
export const createCompletedBounty = (completedBountyData) => async (dispatch) => {
    const response = await csrfFetch('/api/completed-bounty', {
        method: 'POST',
        body: JSON.stringify(completedBountyData),
    });
    
    if (response.ok) {
        const completedBounty = await response.json();
        dispatch(createCompletedBountyAction(completedBounty));
        return completedBounty;
    }
};
export const fetchCompletedBounties = () => async (dispatch) => {
    const response = await csrfFetch('/api/completed-bounty');

    if (response.ok) {
        const completedBounties = await response.json();
        // console.log("COMPLETEDBOUNTIES", completedBounties)
        dispatch(setCompletedBountiesAction(completedBounties));
    }
};
// export const fetchUserCompletedBounty = (userId, bountyId) => async (dispatch) => {
export const fetchUserCompletedBounty = (userId, bountyId) => async () => {
    const response = await csrfFetch(`/api/completed-bounty/${bountyId}/user/${userId}`);

    if (response.ok) {
        const completedBounty = await response.json();
        return completedBounty; // No need to dispatch if you're not storing it globally
    } else {
        return null; // Return null if no completed bounty found
    }
};
export const fetchCompletedBountyByBounty = (bountyId) => async (dispatch) => {
    const response = await csrfFetch('/api/completed-bounty');

    if (response.ok) {
        const completedBounties = await response.json();
        // console.log("COMPLETEDBOUNTIES IN STORE", completedBounties)
        // console.log("completedBounties[0].id",completedBounties[0].bountyId)
        // Filter the completed bounties by bountyId
        const filteredCompletedBounties = completedBounties.filter(bounty => bounty.bountyId == bountyId);
        // console.log("FILTEREDCOMPLETEDBOUNTIES", filteredCompletedBounties)
        dispatch(setCompletedBountiesByBountyAction(filteredCompletedBounties));
        return filteredCompletedBounties;
    }
};

// Reducer (Add this to your completedBounty reducer)
const initialState = {};

const completedBountyReducer = (state = initialState, action) => {
    let newState = {};
    let bountyState = {};
    switch (action.type) {
        case CREATE_COMPLETED_BOUNTY:
            return { ...state, [action.completedBounty.id]: action.completedBounty };
        case SET_COMPLETED_BOUNTIES:
            // const newState = {};
            action.completedBounties.forEach(bounty => {
                newState[bounty.id] = bounty;
            });
            return newState;
        case SET_COMPLETED_BOUNTIES_BY_BOUNTY: // Add new case for fetching by bountyId
            // const bountyState = {};
            action.completedBounties.forEach(bounty => {
                bountyState[bounty.id] = bounty;
            });
            return bountyState;
        default:
            return state;
    }
};

// const completedBountyReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case CREATE_COMPLETED_BOUNTY:
//             return { ...state, [action.completedBounty.id]: action.completedBounty };
//         case SET_COMPLETED_BOUNTIES: {
//             let newState = {};
//             action.completedBounties.forEach(bounty => {
//                 newState[bounty.id] = bounty;
//             });
//             return newState;
//         }
//         case SET_COMPLETED_BOUNTIES_BY_BOUNTY: {
//             let bountyState = {};
//             action.completedBounties.forEach(bounty => {
//                 bountyState[bounty.id] = bounty;
//             });
//             return bountyState;
//         }
//         default:
//             return state;
//     }
// };

export default completedBountyReducer;