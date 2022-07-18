import _ from 'lodash';
import {
    VENDOR_NEWS_GETLIST_RESET_BY_KEY,
    VENDOR_NEWS_GETLIST_REFRESHING,
    VENDOR_NEWS_GETLIST_REQUEST,
    VENDOR_NEWS_GETLIST_SUCCESS,
    VENDOR_NEWS_GETLIST_FAILURE
} from '../../actions/actionTypes';


const INITIAL_STATE = {
    isRefreshing: false,
    data: [],
    initList: false,
    currentPage: 0,
    rowPerPage: 10,
    outOfStock: false, // đánh dấu dữ liệu trên API đã load hết,
    emptyData: false,
    isLoading: false,
    error: null,
    isApplySearchKey: false,
    searchKey: ''
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case VENDOR_NEWS_GETLIST_RESET_BY_KEY: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case VENDOR_NEWS_GETLIST_REQUEST: {
            return {
                ...state,
                isLoading: true,
                emptyData: INITIAL_STATE.emptyData,
                error: INITIAL_STATE.error
            };
        }
        case VENDOR_NEWS_GETLIST_SUCCESS: {
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
        case VENDOR_NEWS_GETLIST_FAILURE: {
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
        case VENDOR_NEWS_GETLIST_REFRESHING: {
            return {
                ...state,
                currentPage: INITIAL_STATE.currentPage,
                isRefreshing: true,
                outOfStock: INITIAL_STATE.outOfStock,
                data: INITIAL_STATE.data
            };
        }
        case 'VENDOR_NEWS_ON_SUBMIT_EDITING': {
            return {
                ...state,
                isApplySearchKey: true,
                currentPage: INITIAL_STATE.currentPage,
                isRefreshing: true,
                outOfStock: INITIAL_STATE.outOfStock,
                data: INITIAL_STATE.data
            }
        }


        case 'VENDOR_NEWS_ON_CLEAR_TEXT': {
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

        case 'VENDOR_NEWS_ON_CHANGE_TEXT':
            const { searchKey } = action.payload;
            return {
                ...state,
                searchKey
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
        default:
            return state;
    }
};
