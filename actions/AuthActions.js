export const AUTH_REQUEST = 'auth/AUTH_REQUEST';
export const AUTH_SUCCESS = 'auth/AUTH_SUCCESS';
export const AUTH_ERROR = 'auth/AUTH_ERROR';

export function login() {
    return dispatch => {
        dispatch({
            type: AUTH_REQUEST
        });
        auth()
            .then(res => {
                dispatch({
                    type: AUTH_SUCCESS
                });
            })
            .catch(err => {})
    };
}

function auth() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                status: 200
            });
        }, 2000);
    });
}