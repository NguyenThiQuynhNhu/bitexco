import _ from 'lodash';

import {
    UTILITIES_SERVICES_DETAIL_RESET_BY_KEY,
    UTILITIES_SERVICES_DETAIL_REQUEST,
    UTILITIES_SERVICES_DETAIL_SUCCESS,
    UTILITIES_SERVICES_DETAIL_FAILURE,
    UTILITIES_SERVICES_BOOKING_REQUEST,
    UTILITIES_SERVICES_BOOKING_SUCCESS,
    UTILITIES_SERVICES_BOOKING_FAILURE
} from '../../actions/actionTypes'

const INITIAL_STATE = {
    data: null,
    isLoading: false,
    error: null,
    initComponent: false,
    isProgress: false,
    errorProgress: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case UTILITIES_SERVICES_DETAIL_RESET_BY_KEY: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            return {
                ...state,
                [action.payload.key]: action.payload.value
            };
        }
        case UTILITIES_SERVICES_DETAIL_REQUEST: {
            return {
                ...state,
                isLoading: true,
                error: INITIAL_STATE.error
            }
        }
        case UTILITIES_SERVICES_DETAIL_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                data: action.payload.data,
                initComponent: INITIAL_STATE.initComponent
            }
        }
        case UTILITIES_SERVICES_DETAIL_FAILURE: {
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
        case UTILITIES_SERVICES_BOOKING_REQUEST: {
            return {
                ...state,
                isProgress: true,
                errorProgress: INITIAL_STATE.error
            }
        }
        case UTILITIES_SERVICES_BOOKING_SUCCESS: {
            return {
                ...state,
                isProgress: false,
                errorProgress: { hasError: false }
            }
        }
        case UTILITIES_SERVICES_BOOKING_FAILURE: {
            return {
                ...state,
                isProgress: false,
                errorProgress: { hasError: true, message: action.payload.data }
            }
        }
        default: return state;
    }
};