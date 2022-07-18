
import _ from 'lodash';
import {
    R_REQUEST_CREATE_REQUEST,
    R_REQUEST_CREATE_FAILURE,
    R_REQUEST_CREATE_SUCCESS
} from '../../actions/actionTypes';

const INITIAL_STATE = {
    isLoading: false,
    error: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case R_REQUEST_CREATE_REQUEST: {
            return {
                ...state,
                isLoading: true,
                error: INITIAL_STATE.error
            }
        }
        case R_REQUEST_CREATE_FAILURE: {
            return {
                ...state,
                isLoading: false,
                error: { hasError: true, message: action.payload.data }
            }
        }
        case R_REQUEST_CREATE_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                error: { hasError: false }
            };
        }
        default: return state;
    }
};