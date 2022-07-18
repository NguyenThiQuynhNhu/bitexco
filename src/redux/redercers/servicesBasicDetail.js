import _ from 'lodash';
import {
    SERVICES_BASIC_DETAIL_RESET_BY_KEY,
    SERVICES_BASIC_DETAIL_REFRESHING,
    SERVICES_BASIC_DETAIL_REQUEST,
    SERVICES_BASIC_DETAIL_SUCCESS,
    SERVICES_BASIC_DETAIL_FAILURE,
    SERVICES_BASIC_DETAIL_UPDATE_REQUEST,
    SERVICES_BASIC_DETAIL_UPDATE_SUCCESS,
    SERVICES_BASIC_DETAIL_UPDATE_FAILURE

} from '../../actions/actionTypes';
import { initializeApp } from 'firebase';


const INITIAL_STATE = {
    initComponent: false,
    isLoading: false,
    error: null,
    errorResponse: null,
    data: null,
    isRefreshing: false,
    errorProgress: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case SERVICES_BASIC_DETAIL_RESET_BY_KEY: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case SERVICES_BASIC_DETAIL_REQUEST: {
            return {
                ...state,
                initComponent: true,
                isLoading: true,
                error: INITIAL_STATE.error
            }
        }
        case SERVICES_BASIC_DETAIL_SUCCESS: {
            return {
                ...state,
                initComponent: false,
                isLoading: false,
                isRefreshing: false,
                data: action.payload.data,

            };
        }
        case SERVICES_BASIC_DETAIL_FAILURE: {
            return {
                ...state,
                initComponent: false,
                isLoading: false,
                isRefreshing: false,
                error: { hasError: true, message: action.payload.data }
            }
        }
        case SERVICES_BASIC_DETAIL_UPDATE_REQUEST: {
            return {
                ...state,
                isLoading: true,
                errorResponse: INITIAL_STATE.errorResponse
            }
        }
        case SERVICES_BASIC_DETAIL_UPDATE_FAILURE: {
            return {
                ...state,
                isLoading: false,
                errorResponse: { hasError: true, message:action.payload.data }
            }
        }
        case SERVICES_BASIC_DETAIL_UPDATE_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                errorResponse: { hasError: false }
            };
        }
        default: return state;
    }
};
