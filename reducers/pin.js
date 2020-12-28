import {
    PIN_SET,
    BIOMETRICS_SET
} from '../actions/PinActions';

const initialState = {
    set: false
};

export function pinReducer(state = initialState, action) {
    switch (action.type) {
        case PIN_SET:
            return {
                isFetching: false,
                set: true
            };
        case BIOMETRICS_SET:
            return {
                ...state,
                useBiometrics: true,
            };
        default:
            return state;
    }
}