import _ from 'lodash';
import {
    DEPARMENT_ON_VALUE_CHANGE,
    DEPARMENT_DETAIL_REQUEST,
    DEPARMENT_DETAIL_SUCCESS,
    DEPARMENT_DETAIL_FAILURE,
    DEPARMENT_DETAIL_RESET_BY_KEY,
    DEPARMENT_UPDATE_REQUEST,
    DEPARMENT_UPDATE_SUCCESS,
    DEPARMENT_UPDATE_FAILURE
} from '../../actions/actionTypes';


const INITIAL_STATE = {
    data: null,
    initComponent: true,
    isLoading: false,
    error: null,
    progressing: false,
    errorProgress: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case DEPARMENT_DETAIL_RESET_BY_KEY: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.value
            };
        }
        case DEPARMENT_DETAIL_REQUEST: {
            return {
                ...state,
                initComponent: false,
                isLoading: true,
                error: null
            };
        }
        case DEPARMENT_DETAIL_SUCCESS: {
            return {
                ...state,
                initComponent: false,
                isLoading: false,
                data: action.payload.data,
                error: { hasError: false }
            };
        }
        case DEPARMENT_DETAIL_FAILURE: {
            return {
                ...state,
                isLoading: false,
                error: {
                    hasError: true,
                    error: action.payload.data
                }
            };
        }
        case DEPARMENT_UPDATE_REQUEST: {
            return {
                ...state,
                progressing: true,
                errorProgress: INITIAL_STATE.errorProgress
            };
        }
        case DEPARMENT_UPDATE_SUCCESS: {
            return {
                ...state,
                progressing: false,
                errorProgress: {
                    hasError: false
                }
            };
        }
        case DEPARMENT_UPDATE_FAILURE: {
            return {
                ...state,
                progressing: false,
                errorProgress: {
                    hasError: true,
                    message: action.payload.data
                }
            };
        }
        case DEPARMENT_ON_VALUE_CHANGE: {
            const newData = state.data.map(o => {
                const newItems = o.items.map(e => {
                    if (e.id == action.payload.id) {
                        return { ...e, isDefault: action.payload.value }
                    }
                    return { ...e, isDefault: false }
                })
                return { ...o, items: newItems }
            })
            return {
                ...state,
                data: newData
            };
        }
        default: return state;
    }
};
