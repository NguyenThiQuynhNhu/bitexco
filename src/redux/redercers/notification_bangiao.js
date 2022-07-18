import _ from 'lodash';
import {
    NOTIFICATION_BG_GETLIST_RESET_BY_KEY,
    NOTIFICATION_BG_GETLIST_REFRESHING,
    NOTIFICATION_BG_GETLIST_REQUEST,
    NOTIFICATION_BG_GETLIST_SUCCESS,
    NOTIFICATION_BG_GETLIST_FAILURE
} from '../../actions/actionTypes';



const INITIAL_STATE = {
    isRefreshing: false,
    data: [],
    initList: false,
    currentPage: 0,
    rowPerPage: 20,
    outOfStock: false, // đánh dấu dữ liệu trên API đã load hết,
    emptyData: false,
    isLoading: false,
    error: null,
    searchKey: '',
    isApplySearchKey: false,
    message: null

};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        
        case 'LOGOUT_SUCCESS': {
            return INITIAL_STATE
        }
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case NOTIFICATION_BG_GETLIST_RESET_BY_KEY: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case NOTIFICATION_BG_GETLIST_REQUEST: {
            return {
                ...state,
                isLoading: true,
                emptyData: INITIAL_STATE.emptyData,
                error: INITIAL_STATE.error
            };
        }
        case NOTIFICATION_BG_GETLIST_SUCCESS: {
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
        case NOTIFICATION_BG_GETLIST_FAILURE: {
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
        case NOTIFICATION_BG_GETLIST_REFRESHING: {
            return {
                ...state,
                currentPage: INITIAL_STATE.currentPage,
                isRefreshing: true,
                outOfStock: INITIAL_STATE.outOfStock,
                data: INITIAL_STATE.data
            };
        }
        case 'NOTIFICATION_BG_ON_SUBMIT_EDITING': {
            return {
                ...state,
                isApplySearchKey: true,
                currentPage: INITIAL_STATE.currentPage,
                isRefreshing: true,
                outOfStock: INITIAL_STATE.outOfStock,
                data: INITIAL_STATE.data
            }
        }
        case 'NOTIFICATION_BG_ON_CLEAR_TEXT': {
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
        case 'NOTIFICATION_BG_ON_CHANGE_TEXT': {
            const { searchKey } = action.payload;
            return {
                ...state,
                searchKey
            }
        }
        case 'NOTIFICATION_BG_ONRECIVE': {
            return {
                ...state,
                message: action.payload
            }
        }
        case 'NEWS_LIST_UPDATE': {
            const item = _.find(state.data, ['id', action.payload.id])
            if (item) {
                const newData = state.data.map(o => {
                    if (o.id == action.payload.id) {
                        return { ...o, isRead: true }
                    }
                    return o
                })
                return {
                    ...state,
                    data: newData
                }
            }
            return state;
        }
        case 'NOTIFICATION_BG_ADD_ITEM_TO_LIST': {
            return {
                ...state,
                data: [action.payload, ...state.data]
            }
        }
        default: return state;
    }
};
