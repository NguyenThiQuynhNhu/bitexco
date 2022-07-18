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
        case 'LOGOUT_SUCCESS': {
            return INITIAL_STATE
        }
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case 'HANDOVER_DAYLIST_PROPS': {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            return {
                ...state,
                ...action.payload
            };
        }
        case 'HANDOVER_DAYLIST_GETLIST_REQUEST': {
            return {
                ...state,
                isLoading: true,
                error: INITIAL_STATE.error
            };
        }
        case 'HANDOVER_DAYLIST_GETLIST_SUCCESS': {
            return {
                ...state,
                isLoading: false,
                isRefreshing: false,
                data: action.payload.data,
            };
        }
        case 'HANDOVER_DAYLIST_GETLIST_FAILURE': {
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