import _ from 'lodash';
import {
    R_NOTIFICATION_GETLIST_RESET_BY_KEY,
    R_NOTIFICATION_GETLIST_REFRESHING,
    R_NOTIFICATION_GETLIST_REQUEST,
    R_NOTIFICATION_GETLIST_SUCCESS,
    R_NOTIFICATION_GETLIST_FAILURE
} from '../../actions/actionTypes';



const INITIAL_STATE = {
    isRefreshing: false,
    data: [],
    initList: false,
    currentPage: 0,
    rowPerPage: 2,
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
        case R_NOTIFICATION_GETLIST_RESET_BY_KEY: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case R_NOTIFICATION_GETLIST_REQUEST: {
            return {
                ...state,
                isLoading: true,
                emptyData: INITIAL_STATE.emptyData,
                error: INITIAL_STATE.error
            };
        }
        case R_NOTIFICATION_GETLIST_SUCCESS: {
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
        case R_NOTIFICATION_GETLIST_FAILURE: {
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
        case R_NOTIFICATION_GETLIST_REFRESHING: {
            return {
                ...state,
                currentPage: INITIAL_STATE.currentPage,
                isRefreshing: true,
                outOfStock: INITIAL_STATE.outOfStock,
                data: INITIAL_STATE.data
            };
        }
        case 'R_NOTIFICATION_ON_SUBMIT_EDITING': {
            return {
                ...state,
                isApplySearchKey: true,
                currentPage: INITIAL_STATE.currentPage,
                isRefreshing: true,
                outOfStock: INITIAL_STATE.outOfStock,
                data: INITIAL_STATE.data
            }
        }
        case 'R_NOTIFICATION_ON_CLEAR_TEXT': {
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
        case 'R_NOTIFICATION_ON_CHANGE_TEXT': {
            const { searchKey } = action.payload;
            return {
                ...state,
                searchKey
            }
        }
        case 'R_NOTIFICATION_ONRECIVE': {
            return {
                ...state,
                message: action.payload
            }
        }
        case 'R_NEWS_LIST_UPDATE': {
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
        case 'R_NOTIFICATION_UPDATE_ITEM_ISREAD':
            let dataIsRead = state.data;
            // const item = _.find(state.data, ['id', action.payload.data.id])
            // console.log(item)
            // if (item) {
            //     const newData = state.data.map(o => {
            //         if (o.id == action.payload.data.id) {
            //             return { ...o, isRead: true }
            //         }
            //         return o
            //     })
            //     return {
            //         ...state,
            //         data: newData
            //     }
            // }
            // console.log(state)
            // return state;
            dataIsRead = dataIsRead.map((item) => {
                if (item.id === action.payload.data.id) {
                    return {...item, isRead: true};
                }
                return item;
            });

            return { ...state, data: dataIsRead };

        default:
        case 'R_NOTIFICATION_ADD_ITEM_TO_LIST': {
            return {
                ...state,
                data: [action.payload, ...state.data]
            }
        }
        default: return state;
    }
};
