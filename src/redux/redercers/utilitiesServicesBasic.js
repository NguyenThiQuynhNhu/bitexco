import _ from 'lodash';
import {
    UTILITIES_SERVICES_BASIC_GETLIST_RESET_BY_KEY,
    UTILITIES_SERVICES_BASIC_GETLIST_REQUEST,
    UTILITIES_SERVICES_BASIC_GETLIST_SUCCESS,
    UTILITIES_SERVICES_BASIC_GETLIST_FAILURE,
    UTILITIES_SERVICES_BASIC_GETLIST_REFRESHING
} from '../../actions/actionTypes';


const INITIAL_STATE = {
    initList: false,
    currentPage: 0,
    rowPerPage: 20,
    outOfStock: false, // đánh dấu dữ liệu trên API đã load hết,
    emptyData: false,
    isRefreshing2: false,
    isRefreshing: false,
    isLoading: false,
    data: [],
    error: null,
    dataStatus: [],
    isLoadingDe: false,
    errorDe: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case UTILITIES_SERVICES_BASIC_GETLIST_RESET_BY_KEY: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case UTILITIES_SERVICES_BASIC_GETLIST_REQUEST: {
            return {
                ...state,
                isLoading: true,
                emptyData: INITIAL_STATE.emptyData,
                error: INITIAL_STATE.error
            };
        }
        case UTILITIES_SERVICES_BASIC_GETLIST_SUCCESS: {
            const newData = state.data.concat(action.payload.data.data);
            return {
                ...state,
                initList: INITIAL_STATE.initList,
                isLoading: false,
                isRefreshing: false,
                isRefreshing2: false,
                data: newData,
                outOfStock: action.payload.data.data.length < state.rowPerPage,
                emptyData: newData.length === 0,
                currentPage: action.payload.data.data.length > 0 ? state.currentPage + 1 : state.currentPage,
                error: INITIAL_STATE.error,
                dataStatus: action.payload.data.dataStatus
            };
        }
        case UTILITIES_SERVICES_BASIC_GETLIST_FAILURE: {
            return {
                ...state,
                initList: INITIAL_STATE.initList,
                isLoading: false,
                isRefreshing: false,
                isRefreshing2: false,
                error: {
                    hasError: true,
                    //error: action.payload.error 
                }
            };
        }
        case UTILITIES_SERVICES_BASIC_GETLIST_REFRESHING: {
            return {
                ...state,
                currentPage: INITIAL_STATE.currentPage,
                isRefreshing: true,
                outOfStock: INITIAL_STATE.outOfStock,
                data: INITIAL_STATE.data
            };
        }
        case 'UTILITIES_SERVICES_BASIC_GETLIST_REFRESHING2': {
            return {
                ...state,
                currentPage: INITIAL_STATE.currentPage,
                isRefreshing2: true,
                outOfStock: INITIAL_STATE.outOfStock,
                data: INITIAL_STATE.data
            };
        }
        case 'SERVICE_DELETE_REQUEST': {
            return {
                ...state,
                isLoadingDe: true,
                errorDe: INITIAL_STATE.error
            }
        }
        case 'SERVICE_DELETE_FAILURE': {
            return {
                ...state,
                isLoadingDe: false,
                errorDe: { hasError: true, message: action.payload.data }
            }
        }
        case 'SERVICE_DELETE_SUCCESS': {
            return {
                ...state,
                isLoadingDe: false,
                errorDe: { hasError: false }
            };
        }
        default: return state;
    }
};
