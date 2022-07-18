import _ from 'lodash';

import {
    UTILITIES_GETLIST_RESET_BY_KEY,
    UTILITIES_GETLIST_REQUEST,
    UTILITIES_GETLIST_FAILURE,
    UTILITIES_GETLIST_SUCCESS
} from '../../actions/actionTypes'

const INITIAL_STATE = {
    data: null,
    isLoading: false,
    error: null,
    initComponent: false,
    emptyData: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case UTILITIES_GETLIST_RESET_BY_KEY: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            return {
                ...state,
                [action.payload.key]: action.payload.value
            };
        }
        case UTILITIES_GETLIST_REQUEST: {
            return {
                ...state,
                isLoading: true,
                emptyData: false,
                error: INITIAL_STATE.error
            }
        }
        case UTILITIES_GETLIST_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                data: action.payload.data,
                emptyData: action.payload.data.length === 0,
                initComponent: INITIAL_STATE.initComponent
            }
        }
        case UTILITIES_GETLIST_FAILURE: {
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

        default: return state;
    }
};