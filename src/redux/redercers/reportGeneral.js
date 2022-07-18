import _ from 'lodash';
import {
    REPORT_GENERAL_GETLIST_RESET_BY_KEY,
    REPORT_GENERAL_LOAD_DATA_REFRESHING,
    REPORT_GENERAL_LOAD_DATA_REQUEST,
    REPORT_GENERAL_LOAD_DATA_SUCCESS,
    REPORT_GENERAL_LOAD_DATA_FAILURE
} from '../../actions/actionTypes';


const INITIAL_STATE = {
    initComponent: false,
    isRefreshing: false,
    isLoading: false,
    data: null,
    error: null,

};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case REPORT_GENERAL_GETLIST_RESET_BY_KEY: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case REPORT_GENERAL_LOAD_DATA_REFRESHING: {
            return {
                ...state,
                isRefreshing: true,
                data: INITIAL_STATE.data
            };
        }
        case REPORT_GENERAL_LOAD_DATA_REQUEST: {
            return {
                ...state,
                isLoading: true,
                error: INITIAL_STATE.error
            };
        }
        case REPORT_GENERAL_LOAD_DATA_SUCCESS: {
            return {
                ...state,
                isRefreshing:INITIAL_STATE.isRefreshing,
                isLoading: INITIAL_STATE.isLoading,
                data: action.payload.data
            };
        }
        case REPORT_GENERAL_LOAD_DATA_FAILURE: {
            return {
                ...state,
                isRefreshing:INITIAL_STATE.isRefreshing,
                isLoading: INITIAL_STATE.isLoading,
                error: { hasError: true, message: action.payload.data }
            };
        }

        default: return state;
    }
};
