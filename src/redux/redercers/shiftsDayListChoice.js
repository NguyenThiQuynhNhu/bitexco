import _ from 'lodash';
import moment from 'moment';
import { converTypeToColor } from '../../utils/shifts'


const INITIAL_STATE = {
    isRefreshing: false,
    isLoading: false,
    data: [],
    error: null,
    markedDates: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case 'SHIFTS_DAYLIST_CHOICE_SET_PROPS': {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            return {
                ...state,
                ...action.payload
            };
        }
        case 'SHIFTS_DAYLIST_CHOICE_GETLIST_REQUEST': {
            return {
                ...state,
                isLoading: true,
                error: INITIAL_STATE.error
            };
        }
        case 'SHIFTS_DAYLIST_CHOICE_GETLIST_SUCCESS': {
            return {
                ...state,
                isLoading: false,
                isRefreshing: false,
                data: action.payload.data,
            };
        }
        case 'SHIFTS_DAYLIST_CHOICE_GETLIST_FAILURE': {
            return {
                ...state,
                isLoading: false,
                isRefreshing: false,
                error: {
                    message: 'Xảy ra lỗi'
                }
            };
        }
        default:
            return state;
    }
};