import _ from 'lodash';
import {
    CHECKLIST_CREATE_SUCCESS,
    CHECKLIST_GETLIST_REQUEST,
    CHECKLIST_GETLIST_SUCCESS,
    CHECKLIST_GETLIST_FAILURE,
    CHECKLIST_GETLIST_REFRESHING,
    CHECKLIST_GETLIST_RESET_BY_KEY,
    CHECKLIST_CLOSE_SUCCESS,
    CHECKLIST_GET_TOTAL_STATUS_REQUEST,
    CHECKLIST_GET_TOTAL_STATUS_FAILURE,
    CHECKLIST_GET_TOTAL_STATUS_SUCCESS
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
    isApplySearchKey: false,
    searchKey: '',
    navigationkey: null,
    createStatus: null,
    statusId: 0,
    isMine: false,
    statusSelected: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'LOGOUT_SUCCESS': {
            return INITIAL_STATE
        }
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case CHECKLIST_GETLIST_RESET_BY_KEY: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case CHECKLIST_GETLIST_REQUEST: {
            return {
                ...state,
                isLoading: true,
                emptyData: INITIAL_STATE.emptyData,
                error: INITIAL_STATE.error
            };
        }
        case CHECKLIST_GETLIST_SUCCESS: {
            const newData = state.data.concat(action.payload.data);
            return {
                ...state,
                initList: INITIAL_STATE.initList,
                isLoading: false,
                isRefreshing: false,
                data: newData,
                outOfStock: action.payload.data.length < state.rowPerPage,
                emptyData: newData.length === 0,
                currentPage: action.payload.data.length > 0 ? state.currentPage + 1 : state.currentPage,
                error: { hasError: false, error: action.payload.error }
            };
        }
        case CHECKLIST_GETLIST_FAILURE: {
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
        case CHECKLIST_GETLIST_REFRESHING: {
            return {
                ...state,
                currentPage: INITIAL_STATE.currentPage,
                isRefreshing: true,
                outOfStock: INITIAL_STATE.outOfStock,
                data: INITIAL_STATE.data
            };
        }
        case 'CHECKLIST_ON_SUBMIT_EDITING': {
            return {
                ...state,
                isApplySearchKey: true,
                currentPage: INITIAL_STATE.currentPage,
                isRefreshing: true,
                outOfStock: INITIAL_STATE.outOfStock,
                data: INITIAL_STATE.data
            }
        }
        case 'CHECKLIST_ON_CLEAR_TEXT': {
            if (state.isApplySearchKey) {
                return {
                    ...state,
                    searchKey: '',
                    isApplySearchKey: false,
                    currentPage: INITIAL_STATE.currentPage,
                    isRefreshing: true,
                    outOfStock: INITIAL_STATE.outOfStock,
                    data: INITIAL_STATE.data
                }
            }
            return {
                ...state,
                searchKey: '',
                isApplySearchKey: false
            }
        }
        case 'CHECKLIST_ON_CHANGE_TEXT': {
            const { searchKey } = action.payload;
            return {
                ...state,
                searchKey
            }
        }
        case 'SAVE_KEY': {
            return {
                ...state,
                navigationkey: action.payload
            }
        }
        case CHECKLIST_CREATE_SUCCESS: {
            return {
                ...state,
                data: [action.payload.dataAddToList, ...state.data],
                createStatus: action.payload.createStatus
            }
        }
        case CHECKLIST_CLOSE_SUCCESS: {
            return {
                ...state,
                currentPage: INITIAL_STATE.currentPage,
                isRefreshing: true,
                outOfStock: INITIAL_STATE.outOfStock,
                data: INITIAL_STATE.data
            };
        }
        case 'ON_STATUS_CHANGE': {
            return {
                ...state,
                statusId: action.payload,
                currentPage: INITIAL_STATE.currentPage,
                isRefreshing: true,
                outOfStock: INITIAL_STATE.outOfStock,
                data: INITIAL_STATE.data
            };
        }
        case 'ON_FILTER': {
            return {
                ...state,
                statusSelected: action.payload.statusSelected,
                isRefreshing:true,
                currentPage: INITIAL_STATE.currentPage,
                outOfStock: INITIAL_STATE.outOfStock,
                data: INITIAL_STATE.data
            };
        }
        case 'ON_CLEAR_FILTER': {
            return {
                ...state,
                searchKey:INITIAL_STATE.searchKey,
                statusSelected: INITIAL_STATE.statusSelected,
                isRefreshing:true,
                currentPage: INITIAL_STATE.currentPage,
                outOfStock: INITIAL_STATE.outOfStock,
                data: INITIAL_STATE.data
            };
        }

        case 'CHECKLIST_UPDATE_ITEM_TOLIST':
            let newData = state.data;
            newData = newData.map((item) => {
                if (item.id === action.payload.data.id) {
                    return { ...item, status: action.payload.data.status };
                }
                return item;
            });

            return { ...state, data: newData };

        case 'CHECKLIST_UPDATE_ITEM_TOLIST_UNNORMAL':
            let dataNormal = state.data;
            dataNormal = dataNormal.map((item) => {
                if (item.id === action.payload.data.id) {
                    return { ...item, isUnNormal: action.payload.data.isUnNormal };
                }
                return item;
            });
            return { ...state, data: dataNormal };

        default:
            return state;
    }
};
