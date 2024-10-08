import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from './session';
import bountyReducer from './bounty';
import commentReducer from './comment';
import completedBountyReducer from './completedBounty';
import userReducer from './user';


const rootReducer = combineReducers({
  // ADD REDUCERS HERE
  session: sessionReducer,
  bounties: bountyReducer,
  comments: commentReducer,
  completedBounty: completedBountyReducer,
  users: userReducer
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
