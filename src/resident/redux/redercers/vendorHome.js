import _ from 'lodash';
import {

    VENDORS_HOME_REQUEST,
    VENDORS_HOME_SUCCESS,
    VENDORS_HOME_FAILURE,
    VENDORS_HOME_RESET_BY_KEY

} from '../../actions/actionTypes';


const INITIAL_STATE = {
    data: null,
    initComponent: true,
    isRefreshing: false,
    isLoading: false,
    error: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case VENDORS_HOME_RESET_BY_KEY: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case VENDORS_HOME_REQUEST: {
            return {
                ...state,
                initComponent: true,
                isLoading: true,
                error: null
            };
        }
        case VENDORS_HOME_SUCCESS: {
            return {
                ...state,
                initComponent: false,
                isLoading: false,
                data: action.payload.data,
                error: { hasError: false }
            };
        }
        case VENDORS_HOME_FAILURE: {
            return {
                ...state,
                initComponent: false,
                isLoading: false,
                error: {
                    hasError: true,
                    error: action.payload.data.message
                }
            };
        }

        default:
            return state;
    }
};
