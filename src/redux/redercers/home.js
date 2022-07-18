import _ from 'lodash';



const INITIAL_STATE = {
    emptyData: false,
    isRefreshing: false,
    isLoading: false,
    data: [],
    error: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case 'HOME_SET_PROPS': {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            return {
                ...state,
                ...action.payload
            };
        }
        case 'HOME_GET_TASKLIST_REQUEST': {
            return {
                ...state,
                isLoading: true,
                emptyData: INITIAL_STATE.emptyData,
                error: INITIAL_STATE.error
            };
        }
        case 'HOME_GET_TASKLIST_SUCCESS': {
            return {
                ...state,
                isLoading: false,
                isRefreshing: false,
                data: action.payload.data,
                emptyData: action.payload.data.length === 0,
                error: { hasError: false, error: action.payload.error }
            }
        }
        case 'HOME_GET_TASKLIST_FAILURE': {
            return {
                ...state,
                isLoading: false,
                isRefreshing: false,
                error: {
                    hasError: true,
                }
            };
        }

        default:
            return state;
    }
};