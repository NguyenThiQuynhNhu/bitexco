
import _ from 'lodash';
import {
    CHECKLIST_DETAIL_REQUEST,
    CHECKLIST_DETAIL_SUCCESS,
    CHECKLIST_DETAIL_FAILURE,
    CHECKLIST_DETAIL_REFRESHING,
    CHECKLIST_DETAIL_RESET_BY_KEY,
    CHECKLIST_CLOSE_REQUEST,
    CHECKLIST_CLOSE_SUCCESS,
    CHECKLIST_CLOSE_FAILURE
} from '../../actions/actionTypes';

const INITIAL_STATE = {
    initComponent: false,
    isLoading: false,
    error: null,
    errorResponse: null,
    data: [],
    isRefreshing: false,
    errorUpdate: null,
    
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case 'CHECKLIST_DETAIL_SETPROPS': {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            return {
                ...state,
                ...action.payload
            };
        }
        case CHECKLIST_DETAIL_REQUEST: {
            return {
                ...state,
                isLoading: true,
                error: null
            }
        }
        case CHECKLIST_DETAIL_FAILURE: {
            return {
                ...state,
                initComponent: false,
                isLoading: false,
                isRefreshing: false,
                error: { hasError: true, status: action.payload.status }
            }
        }
        case CHECKLIST_DETAIL_SUCCESS: {
            return {
                ...state,
                initComponent: false,
                isLoading: false,
                isRefreshing: false,
                data: action.payload.data,

                error: { hasError: false }
            };
        }
        case 'CHECKLIST_DETAIL_UPDATE_SUCCESS': {
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

        case 'CHECKLIST_DETAIL_UPDATE_STATUS_SUCCESS': {
            const methodProcess = action.payload.data
            return {
                ...state,
                errorUpdate: action.payload.errorUpdate,
                data:{
                    ...state.data,
                    methodProcess
                }
            }
        }

        case 'CHECKLIST_DETAIL_INSERT_PROPOSAL_SUCCESS': {
            return {
                ...state,
                errorUpdate: action.payload.errorUpdate
            }
        }
        default:
            return state;
    }
};