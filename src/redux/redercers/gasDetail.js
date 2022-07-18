
import _ from 'lodash';
import {
    GAS_DETAIL_REQUEST,
    GAS_DETAIL_SUCCESS,
    GAS_DETAIL_FAILURE,
    GAS_DETAIL_REFRESHING,
    GAS_DETAIL_RESET_BY_KEY,

    GAS_UNIT_REQUEST,
    GAS_UNIT_SUCCESS,
    GAS_UNIT_FAILURE,
    GAS_UNIT_REFRESHING,
    GAS_UNIT_RESET_BY_KEY,
} from '../../actions/actionTypes';

const INITIAL_STATE = {
    initComponent: false,
    isLoading: false,
    error: null,
    errorResponse: null,
    data: null,
    isRefreshing: false,
    processError: null,
    isLoadingProcess: false,
    dataUnit: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case GAS_DETAIL_RESET_BY_KEY: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case GAS_UNIT_RESET_BY_KEY: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case GAS_DETAIL_REQUEST: {
            return {
                ...state,
                isLoading: true,
                error: null
            }
        }
        case GAS_UNIT_REQUEST: {
            return {
                ...state,
                isLoading: true,
                error: null
            }
        }
        case GAS_DETAIL_FAILURE: {
            return {
                ...state,
                initComponent: false,
                isLoading: false,
                isRefreshing: false,
                error: { hasError: true, status: action.payload.status }
            }
        }
        case GAS_UNIT_FAILURE: {
            return {
                ...state,
                initComponent: false,
                isLoading: false,
                isRefreshing: false,
                error: { hasError: true, status: action.payload.status }
            }
        }
        case GAS_DETAIL_SUCCESS: {
            return {
                ...state,
                initComponent: false,
                isLoading: false,
                isRefreshing: false,
                data: action.payload.data,

                error: { hasError: false }
            };
        }
        case GAS_UNIT_SUCCESS: {
            return {
                ...state,
                initComponent: false,
                isLoading: false,
                isRefreshing: false,
                dataUnit: action.payload.data,

                error: { hasError: false }
            };
        }
        
        case 'GAS_DELETE_REQUEST': {
            return {
                ...state,
                isLoadingProcess: true,
                processError: { hasError: false, status: 0, statusText: '' }
            }
        }
        case 'GAS_DELETE_FAILURE': {
            return {
                ...state,
                isLoadingProcess: false,
                processError: { hasError: true, status: action.payload.status, statusText: action.payload.statusText }
            }
        }
        case 'GAS_DELETE_SUCCESS': {
            return {
                ...state,
                isLoadingProcess: false,
                processError: { hasError: false, status: action.payload.status, statusText: '' }
            };
        }

        case 'GAS_CREATE_REQUEST': {
            return {
                ...state,
                isLoadingProcess: true,
                processError: { hasError: false, status: 0, statusText: '' }
            }
        }
        case 'GAS_CREATE_FAILURE': {
            return {
                ...state,
                isLoadingProcess: false,
                processError: { hasError: true, status: action.payload.status, statusText: action.payload.statusText }
            }
        }
        case 'GAS_CREATE_SUCCESS': {
            return {
                ...state,
                isLoadingProcess: false,
                processError: { hasError: false, status: action.payload.status, statusText: '' }
            };
        }

        default:
            return state;
    }
};