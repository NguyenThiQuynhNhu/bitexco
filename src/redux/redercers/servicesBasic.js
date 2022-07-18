import _ from 'lodash';
import {
    SERVICES_BASIC_GETLIST_RESET_BY_KEY,
    SERVICES_BASIC_GETLIST_REQUEST,
    SERVICES_BASIC_GETLIST_SUCCESS,
    SERVICES_BASIC_GETLIST_FAILURE,
    SERVICES_BASIC_GETLIST_REFRESHING
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
    dataStatus: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case SERVICES_BASIC_GETLIST_RESET_BY_KEY: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case SERVICES_BASIC_GETLIST_REQUEST: {
            return {
                ...state,
                isLoading: true,
                emptyData: INITIAL_STATE.emptyData,
                error: INITIAL_STATE.error
            };
        }
        case SERVICES_BASIC_GETLIST_SUCCESS: {
            const newData = state.data.concat(action.payload.data.data);
            //const newDataStatus = state.data.concat(action.payload.data.dataStatus);
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
                //dataStatus: newDataStatus
            };
        }
        case SERVICES_BASIC_GETLIST_FAILURE: {
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
        case SERVICES_BASIC_GETLIST_REFRESHING: {
            return {
                ...state,
                currentPage: INITIAL_STATE.currentPage,
                isRefreshing: true,
                outOfStock: INITIAL_STATE.outOfStock,
                data: INITIAL_STATE.data,
                //dataStatus: INITIAL_STATE.dataStatus
            };
        }
        case 'SERVICE_BASIC_GET_TOTAL_STATUS_SUCCESS': {
            return {
                ...state,
                dataStatus: action.payload.data
            };
        }
        default: return state;
    }
};
