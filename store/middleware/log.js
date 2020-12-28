export const log = store => next => action => {
    if (1) console.log(`ACTION ${action.type}, PAYLOAD: ${action.payload}`);
    if (typeof action.payload == 'object') console.log(action.payload);
    return next(action);
};
