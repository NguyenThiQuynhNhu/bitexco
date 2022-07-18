import _ from 'lodash';

import {
    UTILITIES_SERVICES_GETLIST_RESET_BY_KEY,
    UTILITIES_SERVICES_GETLIST_REQUEST,
    UTILITIES_SERVICES_GETLIST_SUCCESS,
    UTILITIES_SERVICES_GETLIST_FAILURE,
    UTILITIES_SERVICES_GETLIST_REFRESHING
} from '../../actions/actionTypes'

const INITIAL_STATE = {
    data: null,
    isLoading: false,
    error: null,
    initComponent: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case UTILITIES_SERVICES_GETLIST_RESET_BY_KEY: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            return {
                ...state,
                [action.payload.key]: action.payload.value
            };
        }
        case UTILITIES_SERVICES_GETLIST_REQUEST: {
            return {
                ...state,
                isLoading: true,
                error: INITIAL_STATE.error
            }
        }
        case UTILITIES_SERVICES_GETLIST_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                data: action.payload.data,
                initComponent: INITIAL_STATE.initComponent
            }
        }
        case UTILITIES_SERVICES_GETLIST_FAILURE: {
            return {
                ...state,
                isLoading: false,
                initComponent: INITIAL_STATE.initComponent,
                error: {
                    hasError: true,
                    message: action.payload.data
                }
            }
        }
        case UTILITIES_SERVICES_GETLIST_REFRESHING: {
            return {
                ...state,
                isRefreshing: true,
                data: INITIAL_STATE.data
            };
        }
        default: return state;
    }
};