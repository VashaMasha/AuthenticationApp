import { combineReducers } from 'redux';
import { authReducer } from './auth';
import { pinReducer } from './pin';

export const rootReducer = combineReducers({
    auth: authReducer,
    pin: pinReducer
});