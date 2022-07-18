import _ from 'lodash';
import {
    VENDORS_DETAIL_REFRESHING,
    VENDORS_DETAIL_REQUEST,
    VENDORS_DETAIL_SUCCESS,
    VENDORS_DETAIL_FAILURE,
    VENDORS_DETAIL_RESET_BY_KEY

} from '../../actions/actionTypes';


const INITIAL_STATE = {
    data: null,
    initComponent: false,
    isRefreshing: false,
    isLoading: false,
    error: null,
    errorUpdate: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case VENDORS_DETAIL_RESET_BY_KEY: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case VENDORS_DETAIL_REQUEST: {
            return {
                ...state,

                isLoading: true,
                error: null
            };
        }
        case VENDORS_DETAIL_SUCCESS: {
            return {
                ...state,
                initComponent: false,
                isLoading: false,
                isRefreshing: false,
                data: action.payload.data,
                error: { hasError: false }
            };
        }
        case VENDORS_DETAIL_FAILURE: {
            return {
                ...state,
                initComponent: false,
                isLoading: false,
                isRefreshing: false,
                error: {
                    hasError: true,
                    error: action.payload.data.message
                }
            };
        }
        case VENDORS_DETAIL_REFRESHING: {
            return {
                ...state,
                isLoading: true,
                isRefreshing: true,
                data: INITIAL_STATE.data
            };
        }
        case 'VENDOR_UPDATE_STATUS_REQUEST': {
            return {
                ...state,
                isLoading: true,
                errorUpdate: { hasError: false }
            }
        }
        case 'VENDOR_UPDATE_STATUS_FAILURE': {
            return {
                ...state,
                isLoading: false,
                errorUpdate: { hasError: true, status: action.payload.status, statusText: action.payload.statusText }
            }
        }
        case 'VENDOR_UPDATE_STATUS_SUCCESS': {
            return {
                ...state,
                isLoading: false,
                data: {
                    ...state.data,
                    typeId: action.payload.data
                },
                errorUpdate: { hasError: false, status: action.payload.status }
            }
        }
        default:
            return state;
    }
};
