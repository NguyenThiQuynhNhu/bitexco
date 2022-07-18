
import _ from 'lodash';
import {
    PROPOSAL_DETAIL_REQUEST,
    PROPOSAL_DETAIL_SUCCESS,
    PROPOSAL_DETAIL_FAILURE,
    PROPOSAL_DETAIL_REFRESHING,
    PROPOSAL_DETAIL_RESET_BY_KEY,
    PROPOSAL_CLOSE_REQUEST,
    PROPOSAL_CLOSE_SUCCESS,
    PROPOSAL_CLOSE_FAILURE
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
        case 'PROPOSAL_DETAIL_SETPROPS': {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            return {
                ...state,
                ...action.payload
            };
        }
        case PROPOSAL_DETAIL_REQUEST: {
            return {
                ...state,
                isLoading: true,
                error: null
            }
        }
        case PROPOSAL_DETAIL_FAILURE: {
            return {
                ...state,
                initComponent: false,
                isLoading: false,
                isRefreshing: false,
                error: { hasError: true, status: action.payload.status }
            }
        }
        case PROPOSAL_DETAIL_SUCCESS: {
            return {
                ...state,
                initComponent: false,
                isLoading: false,
                isRefreshing: false,
                data: action.payload.data,

                error: { hasError: false }
            };
        }
        case 'PROPOSAL_DETAIL_UPDATE_SUCCESS': {
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

        case 'PROPOSAL_DETAIL_UPDATE_STATUS_SUCCESS': {
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