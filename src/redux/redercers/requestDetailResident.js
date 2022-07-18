
import _ from 'lodash';
import {
    R_REQUEST_DETAIL_REQUEST,
    R_REQUEST_DETAIL_SUCCESS,
    R_REQUEST_DETAIL_FAILURE,
    R_REQUEST_DETAIL_REFRESHING,
    R_REQUEST_DETAIL_RESET_BY_KEY,
    R_REQUEST_CLOSE_REQUEST,
    R_REQUEST_CLOSE_SUCCESS,
    R_REQUEST_CLOSE_FAILURE,
    R_REQUEST_RATE_REQUEST,
    R_REQUEST_RATE_SUCCESS,
    R_REQUEST_RATE_FAILURE
} from '../../actions/actionTypes';

const INITIAL_STATE = {
    initComponent: false,
    isLoading: false,
    error: null,
    errorResponse: null,
    data: null,
    isRefreshing: false,
    errorProgress: null,
    emptyData: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case R_REQUEST_DETAIL_RESET_BY_KEY: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case R_REQUEST_DETAIL_REQUEST: {
            return {
                ...state,
                isLoading: true,
                error: null
            }
        }
        case R_REQUEST_DETAIL_FAILURE: {
            return {
                ...state,
                initComponent: false,
                isLoading: false,
                isRefreshing: false,
                error: { hasError: true, status: action.payload.status }
            }
        }
        case R_REQUEST_DETAIL_SUCCESS: {
            return {
                ...state,
                initComponent: false,
                isLoading: false,
                isRefreshing: false,
                data: action.payload.data,
                emptyData: action.payload.data.id == 0 ? true : false,
                error: { hasError: false }
            };
        }
        case R_REQUEST_CLOSE_REQUEST: {
            return {
                ...state,
                isLoading: true,
                errorResponse: INITIAL_STATE.errorResponse
            }
        }
        case R_REQUEST_CLOSE_FAILURE: {
            return {
                ...state,
                isLoading: false,
                errorResponse: { hasError: true, status: action.payload.status, statusText: action.payload.statusText }
            }
        }
        case R_REQUEST_CLOSE_SUCCESS: {
            const newHis = [action.payload.dataHis, ...state.data.historyContent]
            return {
                ...state,
                isLoading: false,
                data: { ...state.data, historyContent: newHis },
                errorResponse: { hasError: false }
            };
        }
        case R_REQUEST_RATE_REQUEST: {
            return {
                ...state,
                isLoading: true,
                errorProgress: INITIAL_STATE.errorProgress
            }
        }
        case R_REQUEST_RATE_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                errorProgress: { hasError: false }
            }
        }
        case R_REQUEST_RATE_FAILURE: {
            return {
                ...state,
                isLoading: false,
                errorProgress: { hasError: true, message: action.payload.data }
            }
        }
        default:
            return state;
    }
};