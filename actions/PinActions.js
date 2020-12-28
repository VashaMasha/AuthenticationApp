import * as Keychain from 'react-native-keychain';

export const PIN_SET = "PIN_SET";
export const BIOMETRICS_SET = "BIOMETRICS_SET";
export const BIOMETRICS_REQUEST = "BIOMETRICS_REQUEST";

export function setPin(password) {
    return async (dispatch) => {
        await Keychain.setGenericPassword('pin', password);
        return dispatch(setPinAction());
    };
}

export async function getPin() {
    try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
            return credentials;
        } else {
            console.log('No credentials stored');
        }
    } catch (error) {
        console.log("Keychain couldn't be accessed!", error);
    }
}

export function setPinAction() {
    return {
        type: PIN_SET
    };
}

export function setBiometricsAction() {
    return {
        type: BIOMETRICS_SET
    }
}