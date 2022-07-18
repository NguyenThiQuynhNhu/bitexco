import _ from 'lodash';

import {
    UTILITIES_BASIC_ZONETIME_RESET_BY_KEY,
    UTILITIES_BASIC_ZONETIME_REQUEST,
    UTILITIES_BASIC_ZONETIME_SUCCESS,
    UTILITIES_BASIC_ZONETIME_FAILURE,
    UTILITIES_BASIC_DETAIL_REFRESHING,

    UTILITIES_BASIC_BOOKING_REQUEST,
    UTILITIES_BASIC_BOOKING_SUCCESS,
    UTILITIES_BASIC_BOOKING_FAILURE,
    UTILITIES_BASIC_BOOKING_ON_VALUE_CHANGE
} from '../../actions/actionTypes'

const INITIAL_STATE = {
    data: null,
    isLoading: false,
    error: null,
    initComponent: false,
    isProgress: false,
    errorProgress: null,
    zoneSelected:{
        id: 0,
        name: ''
    }
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case UTILITIES_BASIC_ZONETIME_RESET_BY_KEY: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            return {
                ...state,
                [action.payload.key]: action.payload.value
            };
        }
        case UTILITIES_BASIC_ZONETIME_REQUEST: {
            return {
                ...state,
                isLoading: true,
                error: INITIAL_STATE.error
            }
        }
        case UTILITIES_BASIC_ZONETIME_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                data: action.payload.data,
                initComponent: INITIAL_STATE.initComponent
            }
        }
        case UTILITIES_BASIC_ZONETIME_FAILURE: {
            return {
                ...state,
                isLoading: false,
                initComponent: INITIAL_STATE.initComponent,
                error: {
                    hasError: true,
                    message: action.payload.data
                }
            }
        }
        case UTILITIES_BASIC_BOOKING_REQUEST: {
            return {
                ...state,
                isProgress: true,
                errorProgress: INITIAL_STATE.error
            }
        }
        case UTILITIES_BASIC_BOOKING_SUCCESS: {
            return {
                ...state,
                isProgress: false,
                errorProgress: { hasError: false }
            }
        }
        case UTILITIES_BASIC_BOOKING_FAILURE: {
            return {
                ...state,
                isProgress: false,
                errorProgress: { hasError: true, message: action.payload.data }
            }
        }
        case UTILITIES_BASIC_BOOKING_ON_VALUE_CHANGE: {
            const newData = state.data.map(o => {
                if (o.id == action.payload.id) {
                    return { ...o, isSelect: action.payload.value }
                }
                return { ...o, isSelect: o.isSelect }
            })
            return {
                ...state,
                data: newData
            };
        }
        case UTILITIES_BASIC_DETAIL_REFRESHING: {
            return {
                ...state,
                isRefreshing: true,
                data: INITIAL_STATE.data
            };
        }
        default: return state;
    }
};