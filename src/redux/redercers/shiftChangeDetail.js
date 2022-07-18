
import _ from 'lodash';
import {
    SHIFTCHANGE_DETAIL_REQUEST,
    SHIFTCHANGE_DETAIL_SUCCESS,
    SHIFTCHANGE_DETAIL_FAILURE,
    SHIFTCHANGE_DETAIL_REFRESHING,
    SHIFTCHANGE_DETAIL_RESET_BY_KEY,
    SHIFTCHANGE_CLOSE_REQUEST,
    SHIFTCHANGE_CLOSE_SUCCESS,
    SHIFTCHANGE_CLOSE_FAILURE
} from '../../actions/actionTypes';

const INITIAL_STATE = {
    initComponent: false,
    isLoading: false,
    error: null,
    errorResponse: null,
    data: null,
    isRefreshing: false,
    errorUpdate: null,
    
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case 'SHIFTCHANGE_DETAIL_SETPROPS': {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            return {
                ...state,
                ...action.payload
            };
        }
        case SHIFTCHANGE_DETAIL_REQUEST: {
            return {
                ...state,
                isLoading: true,
                error: null
            }
        }
        case SHIFTCHANGE_DETAIL_FAILURE: {
            return {
                ...state,
                initComponent: false,
                isLoading: false,
                isRefreshing: false,
                error: { hasError: true, status: action.payload.status }
            }
        }
        case SHIFTCHANGE_DETAIL_SUCCESS: {
            return {
                ...state,
                initComponent: false,
                isLoading: false,
                isRefreshing: false,
                data: action.payload.data,

                error: { hasError: false }
            };
        }
        case 'SHIFTCHANGE_DETAIL_UPDATE_SUCCESS': {
            const items = state.data.items.map(o => {
                if (action.payload.data.id == o.id) {
                    return action.payload.data
                }
                return o
            })
            return {
                ...state,
                errorUpdate: action.payload.errorUpdate,
                data:{
                    ...state.data,
                    items
                }
            }
        }

        case 'SHIFTCHANGE_DETAIL_UPDATE_STATUS_SUCCESS': {
            const methodProcess = action.payload.data
            return {
                ...state,
                errorUpdate: action.payload.errorUpdate,
                data:{
                    ...state.data,
                    methodProcess
                }
            };
        }
        
        default:
            return state;
    }
};