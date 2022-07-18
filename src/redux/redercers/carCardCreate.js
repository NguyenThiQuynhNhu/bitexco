
import _ from 'lodash';
const INITIAL_STATE = {
    isLoading: false,
    error: null,
    isLoadingDe: false,
    errorDe: null,
    isLoadingStop: false,
    errorStop: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case 'CARCARD_CREATE_REQUEST': {
            return {
                ...state,
                isLoading: true,
                error: INITIAL_STATE.error
            }
        }
        case 'CARCARD_CREATE_FAILURE': {
            return {
                ...state,
                isLoading: false,
                error: { hasError: true, message: action.payload.data }
            }
        }
        case 'CARCARD_CREATE_SUCCESS': {
            return {
                ...state,
                isLoading: false,
                error: { hasError: false }
            };
        }

        case 'CARCARD_DELETE_REQUEST': {
            return {
                ...state,
                isLoadingDe: true,
                errorDe: INITIAL_STATE.error
            }
        }
        case 'CARCARD_DELETE_FAILURE': {
            return {
                ...state,
                isLoadingDe: false,
                errorDe: { hasError: true, message: action.payload.data }
            }
        }
        case 'CARCARD_DELETE_SUCCESS': {
            return {
                ...state,
                isLoadingDe: false,
                errorDe: { hasError: false }
            };
        }

        case 'CARCARD_STOP_REQUEST': {
            return {
                ...state,
                isLoadingStop: true,
                errorStop: INITIAL_STATE.error
            }
        }
        case 'CARCARD_STOP_FAILURE': {
            return {
                ...state,
                isLoadingStop: false,
                errorStop: { hasError: true, message: action.payload.data }
            }
        }
        case 'CARCARD_STOP_SUCCESS': {
            return {
                ...state,
                isLoadingStop: false,
                errorStop: { hasError: false }
            };
        }
        default: return state;
    }
};