import _ from 'lodash';
import {
    HANDOVER_SCHEDULE_SUCCESS,
    HANDOVER_SCHEDULE_REQUEST,
    HANDOVER_SCHEDULE_FAILURE,
    HANDOVER_SCHEDULE_REFRESHING,
    HANDOVER_SCHEDULE_RESET_BY_KEY
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
    isApplySearchKey:false,
    searchKey:'',
    dataPieSet: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'LOGOUT_SUCCESS': {
            return INITIAL_STATE
        }
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case HANDOVER_SCHEDULE_RESET_BY_KEY: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case HANDOVER_SCHEDULE_REQUEST: {
            return {
                ...state,
                isLoading: true,
                emptyData: INITIAL_STATE.emptyData,
                error: INITIAL_STATE.error
            };
        }
        case HANDOVER_SCHEDULE_SUCCESS: {
            //const newData = [...state.data, ...action.payload.data]
            //const newData = state.data.concat(action.payload.data);
            return {
                ...state,
                initList: false,
                isLoading: false,
                isRefreshing: false,
                data: action.payload.data,
                dataPieSet: action.payload.dataPieSet,
                outOfStock: action.payload.data.length < state.rowPerPage,
                emptyData: action.payload.data.length === 0,
                currentPage: action.payload.data.length > 0 ? state.currentPage + 1 : state.currentPage,
                error: {
                    hasError: false,
                }
            };
        }
        case HANDOVER_SCHEDULE_FAILURE: {
            return {
                ...state,
                initList: INITIAL_STATE.initList,
                isLoading: false,
                isRefreshing: false,
                error: {
                    hasError: true,
                    error: action.payload.data.message 
                }
            };
        }
        case HANDOVER_SCHEDULE_REFRESHING: {
            return {
                ...state,
                currentPage: INITIAL_STATE.currentPage,
                isRefreshing: true,
                outOfStock: INITIAL_STATE.outOfStock,
                data: INITIAL_STATE.data
            };
        }

        default:return state;
    }
};