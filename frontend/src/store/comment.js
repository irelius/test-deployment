import { csrfFetch } from './csrf';

//Constants LOAD(READ) - ADD(CREATE) - UPDATE - DELETE
const SET_COMMENTS = 'comments/setComments';
const ADD_COMMENT = 'comments/addComment';
const UPDATE_COMMENT = 'comments/updateComment';
const DELETE_COMMENT = 'comments/deleteComment';

//Action Creator
//view all comments for a commentId
const setComments = (comments) => {
    return {
        type: SET_COMMENTS,
        payload: comments
    }
}

//add comment
const addComment = (comment) => {
    return {
        type: ADD_COMMENT,
        payload: comment
    };
};

// Update comment
const updateComment = (comment) => {
    return {
        type: UPDATE_COMMENT,
        payload: comment
    };
};

// Delete comment
const deleteComment = (commentId) => {
    return {
        type: DELETE_COMMENT,
        payload: commentId
    };
};

//Thunks
// Fetch all comments by bountyId
export const fetchComments = (bountyId) => async (dispatch) => {
    const response = await csrfFetch(`/api/comments/${bountyId}`);
    if (response.ok) {
        const comments = await response.json();
        dispatch(setComments(comments));
        return comments;
    }
};

// Create a new comment
export const createComment = (bountyId, commentData) => async (dispatch) => {
    const response = await csrfFetch(`/api/comments/${bountyId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData),
    });

    if (response.ok) {
        const comment = await response.json();
        dispatch(addComment(comment));
        return comment;
    }
};

// Update an existing comment
export const editComment = (bountyId, commentId, commentData) => async (dispatch) => {
    const response = await csrfFetch(`/api/comments/${bountyId}/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData),
    });

    if (response.ok) {
        const updatedComment = await response.json();
        dispatch(updateComment(updatedComment));
        console.log("UPDATEDCOMMENT IN API", updatedComment)
        // dispatch(fetchComments(updatedComment.bountyId)); //ensuring comments are updated
        return updatedComment;
    }
};

// Delete a comment
export const removeComment = (bountyId, commentId) => async (dispatch) => {
    const response = await csrfFetch(`/api/comments/${bountyId}/${commentId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        // const { bountyId } = await response.json(); //
        dispatch(deleteComment(commentId));
        // dispatch(fetchComments(bountyId)); //
    }
};

//Initialize State + Reducer
const initialState = {
    allComments: [],
    byId: {}
};
const commentReducer = (state = initialState, action) => {
    let newState;

    switch (action.type) {
        case SET_COMMENTS: {
            newState = { ...state };
            newState.allComments = action.payload;
            for (let comment of action.payload) {
                newState.byId[comment.id] = comment;
            }
            return newState;
        }
        case ADD_COMMENT: {
            newState = { ...state };
            newState.allComments = [...newState.allComments, action.payload];
            newState.byId = { ...newState.byId, [action.payload.id]: action.payload };
            return newState;
        }
        case UPDATE_COMMENT: {
            // newState = { ...state };
            // const updatedComment = action.payload;
            // const newAllComments = newState.allComments.map(comment => 
            //     comment.id === updatedComment.id ? updatedComment : comment
            // );
            // newState.allComments = newAllComments;
            // newState.byId = { ...newState.byId, [updatedComment.id]: updatedComment };
            // return newState;
            newState = { ...state };
            const updatedComment = action.payload;
            newState.allComments = newState.allComments.map(comment =>
                comment.id === updatedComment.id ? updatedComment : comment
            );
            newState.byId[updatedComment.id] = updatedComment;
            return newState;
        }
        case DELETE_COMMENT: {
            newState = { ...state };
            const commentId = action.payload;
            const newAllCommentsArr = newState.allComments.filter(comment => comment.id !== commentId);
            newState.allComments = newAllCommentsArr;
            console.log("NEWSTATE IN BACKEND REDUCER/CHECK ALLCOMMENTS", newState)
            delete newState.byId[commentId];
            console.log("NEWSTATE IN BACKEND REDUCER", newState)
            return newState;
        }
        default: {
            return state;
        }
    }
};

export default commentReducer;