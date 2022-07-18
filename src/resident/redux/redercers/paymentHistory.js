import _ from 'lodash';
import {
    PAYMENTHIS_GETLIST_REFRESHING,
    PAYMENTHIS_GETLIST_REQUEST,
    PAYMENTHIS_GETLIST_SUCCESS,
    PAYMENTHIS_GETLIST_FAILURE,
    PAYMENTHIS_GETLIST_RESET_BY_KEY

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
    isApplySearchKey: false,
    searchKey: ''
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PAYMENTHIS_GETLIST_RESET_BY_KEY: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case PAYMENTHIS_GETLIST_REQUEST: {
            return {
                ...state,
                isLoading: true,
                emptyData: INITIAL_STATE.emptyData,
                error: INITIAL_STATE.error
            };
        }
        case PAYMENTHIS_GETLIST_SUCCESS: {
            const newData = [...state.data, ...action.payload.data]
            return {
                ...state,
                initList: INITIAL_STATE.initList,
                isLoading: INITIAL_STATE.initList,
                isRefreshing: INITIAL_STATE.initList,
                data: newData,
                outOfStock: action.payload.data.length < state.rowPerPage,
                emptyData: newData.length === 0,
                currentPage: action.payload.data.length > 0 ? state.currentPage + 1 : state.currentPage,
            };
        }
        case PAYMENTHIS_GETLIST_FAILURE: {
            return {
                ...state,
                initList: INITIAL_STATE.initList,
                isLoading: INITIAL_STATE.isLoading,
                isRefreshing: INITIAL_STATE.isRefreshing,
                error: {
                    hasError: true,
                    message: action.payload.data
                }
            };
        }
        case PAYMENTHIS_GETLIST_REFRESHING: {
            return {
                ...state,
                currentPage: INITIAL_STATE.currentPage,
                isRefreshing: true,
                outOfStock: INITIAL_STATE.outOfStock,
                data: INITIAL_STATE.data
            };
        }
        default: return state;
    }
};
