import _ from 'lodash';
import {

    CHECKLIST_GETLIST_RESET_BY_KEY1,
    CHECKLIST_GETLIST_REFRESHING1,
    CHECKLIST_GETLIST_REQUEST1,
    CHECKLIST_GETLIST_SUCCESS1,
    CHECKLIST_GETLIST_FAILURE1,
    CHECKLIST_GO_LIST_TAISAN
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
    errorResponse: null,
    item:{
        Id:7
    }
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case CHECKLIST_GETLIST_RESET_BY_KEY1: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case CHECKLIST_GETLIST_REQUEST1: {
            return {
                ...state,
                isLoading: true,
                emptyData: INITIAL_STATE.emptyData,
                error: INITIAL_STATE.error
            };
        }
        case CHECKLIST_GETLIST_SUCCESS1: {
            const newData = state.data.concat(action.payload.data);

            return {
                ...state,
                initList: INITIAL_STATE.initList,
                isLoading: false,
                isRefreshing: false,
                data: newData,
                outOfStock: action.payload.data.length < state.rowPerPage,
                emptyData: newData.length === 0,
                //emptyData: newData[0].ErrorId === 2,
                currentPage: action.payload.data.length > 0 ? state.currentPage + 1 : state.currentPage,
                error: INITIAL_STATE.error
            };
        }
        case CHECKLIST_GETLIST_FAILURE1: {
            return {
                ...state,
                initList: INITIAL_STATE.initList,
                isLoading: false,
                isRefreshing: false,
                error: {
                    hasError: true,
                    error: action.payload.data 
                }
            };
        }
        case CHECKLIST_GETLIST_REFRESHING1: {
            return {
                ...state,
                currentPage: INITIAL_STATE.currentPage,
                isRefreshing: true,
                outOfStock: INITIAL_STATE.outOfStock,
                data: INITIAL_STATE.data
            };
        }

        case CHECKLIST_GO_LIST_TAISAN: {
            return {
                ...state,
                item:action.payload
            };
        }

        default: return state;
    }
};
