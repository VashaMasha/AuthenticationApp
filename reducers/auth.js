import { 
    AUTH_REQUEST, 
    AUTH_SUCCESS, 
    AUTH_ERROR
} from '../actions/AuthActions';

const initialState = {
    isFetching: false,
    success: false
};

export function authReducer(state = initialState, action) {
    switch (action.type) {
        case AUTH_REQUEST:
            return {
                ...state,
                isFetching: true
            };
        case AUTH_SUCCESS:
            return {
                ...state,
                success: true,
                isFetching: false
            };
        case AUTH_ERROR:
            return {
                ...state,
                isFetching: false
            };
        default:
            return state;
    }
}