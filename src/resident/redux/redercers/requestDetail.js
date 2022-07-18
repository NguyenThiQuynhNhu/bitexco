
import _ from 'lodash';
import {
    REQUEST_DETAIL_REQUEST,
    REQUEST_DETAIL_SUCCESS,
    REQUEST_DETAIL_FAILURE,
    REQUEST_DETAIL_REFRESHING,
    REQUEST_DETAIL_RESET_BY_KEY,
    REQUEST_CLOSE_REQUEST,
    REQUEST_CLOSE_SUCCESS,
    REQUEST_CLOSE_FAILURE,
    REQUEST_RATE_REQUEST,
    REQUEST_RATE_SUCCESS,
    REQUEST_RATE_FAILURE
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
        case REQUEST_DETAIL_RESET_BY_KEY: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case REQUEST_DETAIL_REQUEST: {
            return {
                ...state,
                isLoading: true,
                error: null
            }
        }
        case REQUEST_DETAIL_FAILURE: {
            return {
                ...state,
                initComponent: false,
                isLoading: false,
                isRefreshing: false,
                error: { hasError: true, status: action.payload.status }
            }
        }
        case REQUEST_DETAIL_SUCCESS: {
            return {
                ...state,
                initComponent: false,
                isLoading: false,
                isRefreshing: false,
                data: action.payload.data,

                error: { hasError: false }
            };
        }
        case REQUEST_CLOSE_REQUEST: {
            return {
                ...state,
                isLoading: true,
                errorResponse: INITIAL_STATE.errorResponse
            }
        }
        case REQUEST_CLOSE_FAILURE: {
            return {
                ...state,
                isLoading: false,
                errorResponse: { hasError: true, status: action.payload.status, statusText: action.payload.statusText }
            }
        }
        case REQUEST_CLOSE_SUCCESS: {
            const newHis = [action.payload.dataHis, ...state.data.historyContent]
            return {
                ...state,
                isLoading: false,
                data: { ...state.data, historyContent: newHis },
                errorResponse: { hasError: false }
            };
        }
        case REQUEST_RATE_REQUEST: {
            return {
                ...state,
                isLoading: true,
                errorProgress: INITIAL_STATE.errorProgress
            }
        }
        case REQUEST_RATE_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                errorProgress: { hasError: false }
            }
        }
        case REQUEST_RATE_FAILURE: {
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