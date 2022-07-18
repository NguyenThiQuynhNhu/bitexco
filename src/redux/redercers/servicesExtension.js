import _ from 'lodash';
import {
    SERVICES_EXTENSION_GETLIST_RESET_BY_KEY,
    SERVICES_EXTENSION_GETLIST_REQUEST,
    SERVICES_EXTENSION_GETLIST_SUCCESS,
    SERVICES_EXTENSION_GETLIST_FAILURE,
    SERVICES_EXTENSION_GETLIST_REFRESHING
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
    //dataStatus: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case SERVICES_EXTENSION_GETLIST_RESET_BY_KEY: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case SERVICES_EXTENSION_GETLIST_REQUEST: {
            return {
                ...state,
                isLoading: true,
                emptyData: INITIAL_STATE.emptyData,
                error: INITIAL_STATE.error
            };
        }
        case SERVICES_EXTENSION_GETLIST_SUCCESS: {
            const newData = state.data.concat(action.payload.data.data);
            return {
                ...state,
                initList: INITIAL_STATE.initList,
                isLoading: false,
                isRefreshing: false,
                data: newData,
                outOfStock: action.payload.data.data.length < state.rowPerPage,
                emptyData: newData.length === 0,
                currentPage: action.payload.data.data.length > 0 ? state.currentPage + 1 : state.currentPage,
                error: INITIAL_STATE.error,
                //: action.payload.data.dataStatus
            };
        }
        case SERVICES_EXTENSION_GETLIST_FAILURE: {
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
        case SERVICES_EXTENSION_GETLIST_REFRESHING: {
            return {
                ...state,
                currentPage: INITIAL_STATE.currentPage,
                isRefreshing: true,
                outOfStock: INITIAL_STATE.outOfStock,
                data: INITIAL_STATE.data
            };
        }
        // case 'SERVICE_EXTENSION_GET_TOTAL_STATUS_SUCCESS': {
        //     return {
        //         ...state,
        //         dataStatus: action.payload.data
        //     };
        // }
        default: return state;
    }
};
