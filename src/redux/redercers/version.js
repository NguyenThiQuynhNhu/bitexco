const INITIAL_STATE = {
    version: 0
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'CHECK_VERSION': {
            return {
                version: action.payload.data
            }
        }
        default:
            return state;
    }
}