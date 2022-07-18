
import _ from 'lodash';
import {
    REQUEST_CREATE_REQUEST,
    REQUEST_CREATE_FAILURE,
    REQUEST_CREATE_SUCCESS
} from '../../actions/actionTypes';

const INITIAL_STATE = {
    isLoading: false,
    error: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case REQUEST_CREATE_REQUEST: {
            return {
                ...state,
                isLoading: true,
                error: INITIAL_STATE.error
            }
        }
        case REQUEST_CREATE_FAILURE: {
            return {
                ...state,
                isLoading: false,
                error: { hasError: true, message: payload.data }
            }
        }
        case REQUEST_CREATE_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                error: { hasError: false }
            };
        }
        default: return state;
    }
};