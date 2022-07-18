import _ from 'lodash';
import {
    REQUEST_GET_TOTAL_STATUS_REQUEST,
    REQUEST_GET_TOTAL_STATUS_FAILURE,
    REQUEST_GET_TOTAL_STATUS_SUCCESS,
} from '../../actions/actionTypes';


const INITIAL_STATE = {
    initList: false,
    isRefreshing: false,
    isLoading: false,
    data: [],
    error: null,
    dataStatusServiecBasic: [],
    dataStatusSeviceExtension: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        // case REQUESTS_GETLIST_RESET_BY_KEY: {
        //     if (action.payload.key === 'state') {
        //         return INITIAL_STATE;
        //     }
        //     const newValues = state[action.payload.key];
        //     return {
        //         ...state,
        //         [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
        //     };
        // }
        case 'SERVICE_BASIC_GET_TOTAL_STATUS_SUCCESS': {
            return {
                ...state,
                dataStatusServiecBasic: action.payload.data
            };
        }
        case 'SERVICE_EXTENSION_GET_TOTAL_STATUS_SUCCESS': {
            return {
                ...state,
                dataStatusSeviceExtension: action.payload.data
            };
        }
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case 'ON_VENDOR_CHANGE': {
            return {
                ...state,
                data: INITIAL_STATE.data
            };
        }
        case REQUEST_GET_TOTAL_STATUS_REQUEST: {
            return {
                ...state,
                isLoading: true,
                error: INITIAL_STATE.error
            };
        }
        case REQUEST_GET_TOTAL_STATUS_SUCCESS: {
            return {
                ...state,
                initList: INITIAL_STATE.initList,
                isLoading: false,
                data: action.payload.data,
                error: { hasError: false, error: action.payload.error }
            };
        }
        case REQUEST_GET_TOTAL_STATUS_FAILURE: {
            return {
                ...state,
                initList: INITIAL_STATE.initList,
                isLoading: false,
                error: {
                    hasError: true
                }
            };
        }
        // case REQUESTS_GETLIST_REFRESHING: {
        //     return {
        //         ...state,
        //         currentPage: INITIAL_STATE.currentPage,
        //         isRefreshing: true,
        //         outOfStock: INITIAL_STATE.outOfStock,
        //         data: INITIAL_STATE.data
        //     };
        // }
        default:
            return state;
    }
};
