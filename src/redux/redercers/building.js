import _ from 'lodash';
import {
    BUILDING_GETLIST_REQUEST,
    BUILDING_GETLIST_SUCCESS,
    BUILDING_GETLIST_FAILURE,
    BUILDING_GETLIST_REFRESHING,
    BUILDING_GETLIST_RESET_BY_KEY
} from '../../actions/actionTypes';


const INITIAL_STATE = {
    initList: false,
    currentPage: 0,
    rowPerPage: 15,
    outOfStock: false, // đánh dấu dữ liệu trên API đã load hết,
    emptyData: false,
    isRefreshing: false,
    isLoading: false,
    data: [],
    error: null,
    isApplySearchKey: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'LOGOUT_SUCCESS': {
            return INITIAL_STATE
        }
        case BUILDING_GETLIST_RESET_BY_KEY: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case BUILDING_GETLIST_REQUEST: {
            return {
                ...state,
                isLoading: true,
                emptyData: INITIAL_STATE.emptyData,
                error: INITIAL_STATE.error
            };
        }
        case BUILDING_GETLIST_SUCCESS: {
            //const newData = state.data.concat(action.payload.data);
            return {
                ...state,
                initList: INITIAL_STATE.initList,
                isLoading: false,
                isRefreshing: false,
                //data: newData,
                data: action.payload.data,
                //outOfStock: action.payload.data.length < state.rowPerPage,
                //emptyData: newData.length === 0,
                emptyData: action.payload.data.length === 0,
                //currentPage: action.payload.data.length > 0 ? state.currentPage + 1 : state.currentPage,
                error: { hasError: false, error: action.payload.error }
            };
        }
        case BUILDING_GETLIST_FAILURE: {
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
        case BUILDING_GETLIST_REFRESHING: {
            return {
                ...state,
                currentPage: INITIAL_STATE.currentPage,
                isRefreshing: true,
                outOfStock: INITIAL_STATE.outOfStock,
                data: INITIAL_STATE.data
            };
        }
        default:
            return state;
    }
};
