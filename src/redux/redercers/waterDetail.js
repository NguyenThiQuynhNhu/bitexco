
import _ from 'lodash';
import {
    WATER_DETAIL_REQUEST,
    WATER_DETAIL_SUCCESS,
    WATER_DETAIL_FAILURE,
    WATER_DETAIL_REFRESHING,
    WATER_DETAIL_RESET_BY_KEY,
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
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case WATER_DETAIL_RESET_BY_KEY: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case WATER_DETAIL_REQUEST: {
            return {
                ...state,
                isLoading: true,
                error: null
            }
        }
        case WATER_DETAIL_FAILURE: {
            return {
                ...state,
                initComponent: false,
                isLoading: false,
                isRefreshing: false,
                error: { hasError: true, status: action.payload.status }
            }
        }
        case WATER_DETAIL_SUCCESS: {
            return {
                ...state,
                initComponent: false,
                isLoading: false,
                isRefreshing: false,
                data: action.payload.data,

                error: { hasError: false }
            };
        }
        
        case 'WATER_DELETE_REQUEST': {
            return {
                ...state,
                isLoadingProcess: true,
                processError: { hasError: false, status: 0, statusText: '' }
            }
        }
        case 'WATER_DELETE_FAILURE': {
            return {
                ...state,
                isLoadingProcess: false,
                processError: { hasError: true, status: action.payload.status, statusText: action.payload.statusText }
            }
        }
        case 'WATER_DELETE_SUCCESS': {
            return {
                ...state,
                isLoadingProcess: false,
                processError: { hasError: false, status: action.payload.status, statusText: '' }
            };
        }

        case 'WATER_CREATE_REQUEST': {
            return {
                ...state,
                isLoadingProcess: true,
                processError: { hasError: false, status: 0, statusText: '' }
            }
        }
        case 'WATER_CREATE_FAILURE': {
            return {
                ...state,
                isLoadingProcess: false,
                processError: { hasError: true, status: action.payload.status, statusText: action.payload.statusText }
            }
        }
        case 'WATER_CREATE_SUCCESS': {
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