import _ from 'lodash';
import {
    GAS_CREATE_SUCCESS,
    GAS_GETLIST_REQUEST,
    GAS_GETLIST_SUCCESS,
    GAS_GETLIST_FAILURE,
    GAS_GETLIST_REFRESHING,
    GAS_GETLIST_RESET_BY_KEY,
    GAS_CLOSE_SUCCESS,
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
    searchKey: new Date().getMonth() + 1,
    searchKey2: new Date().getFullYear(),
    navigationkey: null,
    createStatus: null,
    statusId: -1,
    isMine: false,
    blockSelected: null,
    floorSelected: null,
    itemSelected: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'LOGOUT_SUCCESS': {
            return INITIAL_STATE
        }
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case GAS_GETLIST_RESET_BY_KEY: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case GAS_GETLIST_REQUEST: {
            return {
                ...state,
                isLoading: true,
                emptyData: INITIAL_STATE.emptyData,
                error: INITIAL_STATE.error
            };
        }
        case GAS_GETLIST_SUCCESS: {
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
        case GAS_GETLIST_FAILURE: {
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
        case GAS_GETLIST_REFRESHING: {
            return {
                ...state,
                currentPage: INITIAL_STATE.currentPage,
                isRefreshing: true,
                outOfStock: INITIAL_STATE.outOfStock,
                data: INITIAL_STATE.data
            };
        }
        case 'GAS_ON_SUBMIT_EDITING': {
            return {
                ...state,
                isApplySearchKey: true,
                currentPage: INITIAL_STATE.currentPage,
                isRefreshing: true,
                outOfStock: INITIAL_STATE.outOfStock,
                data: INITIAL_STATE.data
            }
        }
        case 'GAS_ON_CLEAR_TEXT': {
            if (state.isApplySearchKey) {
                return {
                    ...state,
                    searchKey: '',
                    searchKey2: '',
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
                searchKey2: '',
                isApplySearchKey: false
            }
        }
        case 'GAS_ON_CHANGE_TEXT': {
            const { searchKey } = action.payload;
            return {
                ...state,
                searchKey
            }
        }
        case 'GAS_ON_CHANGE_TEXT2': {
            const { searchKey2 } = action.payload;
            return {
                ...state,
                searchKey2
            }
        }
        case 'SAVE_KEY': {
            return {
                ...state,
                navigationkey: action.payload
            }
        }
        case 'GAS_CREATE_SUCCESS': {
            let newData = state.data;
            newData = newData.map((item) => {
                if (item.id === action.payload.data.id) {
                  return { ...item, 
                        indexId: action.payload.data.indexId,
                        indexOld: action.payload.data.indexOld,
                        indexNew: action.payload.data.indexNew,
                        indexUse: action.payload.data.indexUse,
                        dateFrom: action.payload.data.dateFrom,
                        dateTo: action.payload.data.dateTo,
                        dateNotify: action.payload.data.dateNotify,
                        dateCreate: action.payload.data.dateCreate,
                        employeeId: action.payload.data.employeeId,
                        employeeName: action.payload.data.employeeName,
                        amount: action.payload.data.amount,
                        peoplePromotion: action.payload.data.peoplePromotion,
                        m3PerPeople: action.payload.data.m3PerPeople,
                        rateFeeEnviroment: action.payload.data.rateFeeEnviroment,
                        rateFeeVAT: action.payload.data.rateFeeVAT,
                        description: action.payload.data.description
                    };
                }
                return item
              });
              return { ...state, data: newData };
        }

        case 'GAS_DELETE_SUCCESS': {
            let newData = state.data;
            newData = newData.map((item) => {
                if (item.id === action.payload.data.id) {
                  return { ...item, 
                        indexId: 0,
                        indexOld: action.payload.data.indexOld,
                        indexNew: action.payload.data.indexNew,
                        indexUse: action.payload.data.indexUse,
                        dateFrom: action.payload.data.dateFrom,
                        dateTo: action.payload.data.dateTo,
                        dateNotify: action.payload.data.dateNotify,
                        dateCreate: action.payload.data.dateCreate,
                        employeeId: action.payload.data.employeeId,
                        employeeName: action.payload.data.employeeName,
                        amount: action.payload.data.amount,
                        peoplePromotion: action.payload.data.peoplePromotion,
                        m3PerPeople: action.payload.data.m3PerPeople,
                        rateFeeEnviroment: action.payload.data.rateFeeEnviroment,
                        rateFeeVAT: action.payload.data.rateFeeVAT,
                        description: action.payload.data.description
                    };
                }
                return item
              });
              return { ...state, data: newData };
        }

        case 'GAS_CLOSE_SUCCESS': {
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
                blockSelected: action.payload.blockSelected,
                floorSelected: action.payload.floorSelected,
                itemSelected: null,
                searchKey: action.payload.searchKey,
                searchKey2: action.payload.searchKey2,
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
                searchKey2:INITIAL_STATE.searchKey2,
                blockSelected: INITIAL_STATE.blockSelected,
                floorSelected: INITIAL_STATE.floorSelected,
                itemSelected: null,
                isRefreshing:true,
                currentPage: INITIAL_STATE.currentPage,
                outOfStock: INITIAL_STATE.outOfStock,
                data: INITIAL_STATE.data
            };
        }

        case 'ON_SET_ITEM': {
            return {
                ...state,
                itemSelected: action.payload.itemSelected
            };
        }

        case 'GAS_UPDATE_ITEM_TOLIST':
            let newData = state.data;
            newData = newData.map((item) => {
                if (item.id === action.payload.data.id) {
                    const data = {
                        dateAction: item.dateAction,
                        employeeName: item.employeeName,
                        id: item.id,
                        imageUrl: item.imageUrl, 
                        status: action.payload.data.status,
                        title: item.title,
                    };
                    return data;
                }
                return item;
            });

            return { ...state, data: newData };
        default:
            return state;
    }
};
