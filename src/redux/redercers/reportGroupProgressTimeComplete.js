import _ from 'lodash';
import {
    REPORT_GROUP_PROGRESS_TIMECOMPLETE_SET_PROPS,
    REPORT_GROUP_PROGRESS_TIMECOMPLETE_RERESHING,
    REPORT_GROUP_PROGRESS_TIMECOMPLETE_REQUEST,
    REPORT_GROUP_PROGRESS_TIMECOMPLETE_SUCCESS,
    REPORT_GROUP_PROGRESS_TIMECOMPLETE_FAILURE
} from '../../actions/actionTypes';


const INITIAL_STATE = {
    initComponent: false,
    isRefreshing: false,
    isLoading: false,
    data: [],
    error: null,

};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case REPORT_GROUP_PROGRESS_TIMECOMPLETE_SET_PROPS: {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            return {
                ...state,
                ...action.payload
            }
        }
        case REPORT_GROUP_PROGRESS_TIMECOMPLETE_RERESHING: {
            return {
                ...state,
                isRefreshing: true,
                data: INITIAL_STATE.data
            };
        }
        case REPORT_GROUP_PROGRESS_TIMECOMPLETE_REQUEST: {
            return {
                ...state,
                isLoading: true,
                error: INITIAL_STATE.error
            };
        }
        case REPORT_GROUP_PROGRESS_TIMECOMPLETE_SUCCESS: {
            return {
                ...state,
                isRefreshing: INITIAL_STATE.isRefreshing,
                isLoading: INITIAL_STATE.isLoading,
                data: action.payload.data
            };
        }
        case REPORT_GROUP_PROGRESS_TIMECOMPLETE_FAILURE: {
            return {
                ...state,
                isRefreshing: INITIAL_STATE.isRefreshing,
                isLoading: INITIAL_STATE.isLoading,
                error: { hasError: true, message: action.payload.data }
            };
        }

        default: return state;
    }
};
