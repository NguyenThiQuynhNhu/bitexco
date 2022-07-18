import _ from 'lodash';
import {
    UTILITIES_SERVICES_BASIC_DETAIL_RESET_BY_KEY,
    UTILITIES_SERVICES_BASIC_DETAIL_REFRESHING,
    UTILITIES_SERVICES_BASIC_DETAIL_REQUEST,
    UTILITIES_SERVICES_BASIC_DETAIL_SUCCESS,
    UTILITIES_SERVICES_BASIC_DETAIL_FAILURE,
    SERVICES_BASIC_FEEDBACK_REQUEST,
    SERVICES_BASIC_FEEDBACK_SUCCESS,
    SERVICES_BASIC_FEEDBACK_FAILURE
} from '../../actions/actionTypes';


const INITIAL_STATE = {
    initComponent: false,
    isLoading: false,
    error: null,
    errorResponse: null,
    data: null,
    isRefreshing: false,
    errorProgress: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case UTILITIES_SERVICES_BASIC_DETAIL_RESET_BY_KEY: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case UTILITIES_SERVICES_BASIC_DETAIL_REQUEST: {
            return {
                ...state,
                initComponent: true,
                isLoading: true,
                error: INITIAL_STATE.error
            }
        }
        case UTILITIES_SERVICES_BASIC_DETAIL_SUCCESS: {
            return {
                ...state,
                initComponent: false,
                isLoading: false,
                isRefreshing: false,
                data: action.payload.data,

            };
        }
        case UTILITIES_SERVICES_BASIC_DETAIL_FAILURE: {
            return {
                ...state,
                initComponent: false,
                isLoading: false,
                isRefreshing: false,
                error: { hasError: true, message: action.payload.data }
            }
        }
        case SERVICES_BASIC_FEEDBACK_REQUEST: {
            return {
                ...state,
                isLoading: true,
                errorResponse: INITIAL_STATE.errorResponse
            }
        }
        case SERVICES_BASIC_FEEDBACK_FAILURE: {
            return {
                ...state,
                isLoading: false,
                errorResponse: { hasError: true, status: action.payload.status, statusText: action.payload.statusText }
            }
        }
        case SERVICES_BASIC_FEEDBACK_SUCCESS: {
            const newHis = [action.payload.dataHis, ...state.data.historys]
            return {
                ...state,
                isLoading: false,
                data: { ...state.data, historys: newHis },
                errorResponse: { hasError: false }
            };
        }

        default: return state;
    }
};
