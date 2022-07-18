import _ from 'lodash';
import {
    FEE_DETAIL_REQUEST,
    FEE_DETAIL_FAILURE,
    FEE_DETAIL_SUCCESS,
    FEE_DETAIL_RESET_BY_KEY,
    FEE_DETAIL_REFRESHING

} from '../../actions/actionTypes';


const INITIAL_STATE = {
    initComponent: true,
    currentPage: 0,
    rowPerPage: 20,
    outOfStock: false, // đánh dấu dữ liệu trên API đã load hết,
    emptyData: false,
    isRefreshing: false,
    isLoading: false,
    data: [],
    error: null,
    errorPayment: -1,
    isLoadingPayment: false,
    orderId: '',
    billCode: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FEE_DETAIL_RESET_BY_KEY: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case FEE_DETAIL_REQUEST: {
            return {
                ...state,
                isLoading: true,
                emptyData: INITIAL_STATE.emptyData,
                error: INITIAL_STATE.error
            };
        }
        case FEE_DETAIL_SUCCESS: {

            return {
                ...state,
                initComponent:false,
                isLoading: false,
                data: action.payload.data,
                error: {
                    hasError: false,
                    //error: action.payload.error 
                }
            };
        }
        case FEE_DETAIL_FAILURE: {
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
        case FEE_DETAIL_REFRESHING: {
            return {
                ...state,
                currentPage: INITIAL_STATE.currentPage,
                isLoading: true,
                isRefreshing: true,
                outOfStock: INITIAL_STATE.outOfStock,
                data: []
            };
        }

        case 'MOMO_PAYMENT_REQUEST': {
            return {
                ...state,
                isLoadingPayment: true
            };
        }

        case 'MOMO_PAYMENT_SUCCESS': {
            return {
                ...state,
                isLoadingPayment: false,
                errorPayment: 0
            };
        }

        case 'MOMO_PAYMENT_FAILURE': {
            return {
                ...state,
                isLoadingPayment: false,
                errorPayment: 1
            };
        }

        case 'FEE_DETAIL_BILLCODE_FAILURE': {
            return {
                ...state,
                billCode: null
            };
        }
        case 'FEE_DETAIL_BILLCODE_SUCCESS': {
            //console.log('FEE_DETAIL_BILLCODE_SUCCESS', action)
            return {
                ...state,
                billCode: action.payload.billCode.length > 0 ? action.payload.billCode[0] : null
            };
        }

        default: return state;
    }
};
