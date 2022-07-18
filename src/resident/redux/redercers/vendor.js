import _ from 'lodash';
import {
    VENDORS_GETLIST_REFRESHING,
    VENDORS_GETLIST_REQUEST,
    VENDORS_GETLIST_SUCCESS,
    VENDORS_GETLIST_FAILURE,
    VENDORS_GETLIST_RESET_BY_KEY

} from '../../actions/actionTypes';


const INITIAL_STATE = {
    initList: false,
    currentPage: 0,
    rowPerPage: 20,
    outOfStock: false, // đánh dấu dữ liệu trên API đã load hết,
    emptyData: false,
    isRefreshing: false,
    isLoading: false,
    data: [],
    error: null,

};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'LOGOUT_SUCCESS':{
            return INITIAL_STATE
        }
        case VENDORS_GETLIST_RESET_BY_KEY: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case VENDORS_GETLIST_REQUEST: {
            return {
                ...state,
                isComplete:false,
                isLoading: true,
                emptyData: INITIAL_STATE.emptyData,
                error: INITIAL_STATE.error
            };
        }
        case VENDORS_GETLIST_SUCCESS: {
            const newData = [...state.data, ...action.payload.data]
            return {
                ...state,
                initList: false,
                isLoading: false,
                isRefreshing: false,
                data: newData,
                outOfStock: action.payload.data.length < state.rowPerPage,
                emptyData: newData.length === 0,
                currentPage: action.payload.data.length > 0 ? state.currentPage + 1 : state.currentPage,
                error: {
                    hasError: false,
                    //error: action.payload.error 
                }
            };
        }
        case VENDORS_GETLIST_FAILURE: {
            return {
                ...state,
                initList: INITIAL_STATE.initList,
                isLoading: false,
                isRefreshing: false,
                error: {
                    hasError: true,
                    //error: action.payload.error 
                }
            };
        }
        case VENDORS_GETLIST_REFRESHING: {
            return {
                ...state,
                currentPage: INITIAL_STATE.currentPage,
                isLoading: true,
                isRefreshing: true,
                outOfStock: INITIAL_STATE.outOfStock,
                data: []
            };
        }
        case 'VENDOR_UPDATE_STATUS_SUCCESS': {
            return {
                ...state,
                currentPage: INITIAL_STATE.currentPage,
                isLoading: true,
                isRefreshing: true,
                outOfStock: INITIAL_STATE.outOfStock,
                data: []
            };
        }
        default:
            return state;
    }
};
