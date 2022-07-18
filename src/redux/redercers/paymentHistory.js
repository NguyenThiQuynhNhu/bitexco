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
    searchKey: '',
    //
    initListEwallet: false,
    emptyDataEwallet: false,
    isRefreshingEwallet: false,
    isLoadingEwallet: false,
    dataEwallet: null,
    errorEwallet: null,
    //TRANS_INQUIRY
    isLoadingTransInquiry: false,
    errorTransInquiry: null,
    dataTransInquiry: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
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

        case 'PAYMENTHIS_EWALLET_GETLIST_RESET_BY_KEY': {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case 'PAYMENTHIS_EWALLET_GETLIST_REQUEST': {
            return {
                ...state,
                isLoadingEwallet: true,
                emptyDataEwallet: INITIAL_STATE.emptyData,
                errorEwallet: INITIAL_STATE.error
            };
        }
        case 'PAYMENTHIS_EWALLET_GETLIST_SUCCESS': {
            return {
                ...state,
                initListEwallet: INITIAL_STATE.initListEwallet,
                isLoadingEwallet: INITIAL_STATE.isLoadingEwallet,
                isRefreshingEwallet: INITIAL_STATE.isRefreshingEwallet,
                dataEwallet: action.payload.data,
                emptyDataEwallet: action.payload.data.length === 0
            };
        }
        case 'PAYMENTHIS_EWALLET_GETLIST_FAILURE': {
            return {
                ...state,
                initListEwallet: INITIAL_STATE.initListEwallet,
                isLoadingEwallet: INITIAL_STATE.isLoadingEwallet,
                isRefreshingEwallet: INITIAL_STATE.isRefreshingEwallet,
                errorEwallet: {
                    hasError: true,
                    message: action.payload.data
                }
            };
        }
        case 'PAYMENTHIS_EWALLET_GETLIST_REFRESHING': {
            return {
                ...state,
                isRefreshingEwallet: true,
                dataEwallet: INITIAL_STATE.dataEwallet
            };
        }
        case 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST': {
            return {
                ...state,
                isLoadingTransInquiry: true,
                errorTransInquiry: INITIAL_STATE.errorTransInquiry,
                dataTransInquiry: INITIAL_STATE.dataTransInquiry
            };
        }
        case 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_FAILURE': {
            return {
                ...state,
                isLoadingTransInquiry: false,
                errorTransInquiry: {
                    hasError: true,
                    message: action.payload.data,
                    status: 400
                }
            };
        }
        case 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_SUCCESS': {
            return {
                ...state,
                isLoadingTransInquiry: false,
                //dataTransInquiry: action.payload.data,
                errorTransInquiry: {
                    hasError: false,
                    message: action.payload.data,
                    status: 200
                }
            };
        }
        default: return state;
    }
};
