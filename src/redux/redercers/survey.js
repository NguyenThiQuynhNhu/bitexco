import _ from 'lodash';


const INITIAL_STATE = {
    initList: false,
    emptyData: false,
    isRefreshing: false,
    isLoading: false,
    data: [],
    error: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'LOGOUT_SUCCESS': {
            return INITIAL_STATE
        }
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case 'SURVERY_GETLIST_RESET_BY_KEY': {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case 'SURVERY_GETLIST_REQUEST': {
            return {
                ...state,
                isLoading: true,
                emptyData: INITIAL_STATE.emptyData,
                error: INITIAL_STATE.error
            };
        }
        case 'SURVERY_GETLIST_SUCCESS': {
            const newData = action.payload.data;
            return {
                ...state,
                initList: INITIAL_STATE.initList,
                isLoading: false,
                isRefreshing: false,
                data: newData,
                emptyData: newData.length === 0,
                error: { hasError: false, error: action.payload.error }
            };
        }
        case 'SURVERY_GETLIST_FAILURE': {
            return {
                ...state,
                initList: INITIAL_STATE.initList,
                isLoading: false,
                isRefreshing: false,
                error: {
                    hasError: true
                }
            };
        }
        case 'SURVERY_GETLIST_REFRESHING': {
            return {
                ...state,
                isRefreshing: true,
                data: INITIAL_STATE.data
            };
        }
        default:
            return state;
    }
};
