import _ from 'lodash';


const INITIAL_STATE = {
    initList: false,
    emptyData: false,
    isRefreshing: false,
    isLoading: false,
    data: [],
    error: null,
    isLoadingIns: false,
    errorIns: null,
};

export default (state = INITIAL_STATE, action) => {
    //console.log(action)
    switch (action.type) {
        case 'LOGOUT_SUCCESS': {
            return INITIAL_STATE
        }
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case 'SURVERY_DETAIL_GETLIST_RESET_BY_KEY': {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case 'SURVERY_DETAIL_GETLIST_REQUEST': {
            return {
                ...state,
                isLoading: true,
                emptyData: INITIAL_STATE.emptyData,
                error: INITIAL_STATE.error
            };
        }
        case 'SURVERY_DETAIL_GETLIST_SUCCESS': {
            const newData = action.payload.data;
            return {
                ...state,
                initList: INITIAL_STATE.initList,
                isLoading: false,
                isRefreshing: false,
                data: newData,
                emptyData: newData.length === 0,
                error: { hasError: false, error: action.payload.error }
            };
        }
        case 'SURVERY_DETAIL_GETLIST_FAILURE': {
            return {
                ...state,
                initList: INITIAL_STATE.initList,
                isLoading: false,
                isRefreshing: false,
                error: {
                    hasError: true
                }
            };
        }
        case 'SURVERY_DETAIL_GETLIST_REFRESHING': {
            return {
                ...state,
                isRefreshing: true,
                data: INITIAL_STATE.data
            };
        }
        case 'SURVEY_INS_REQUEST': {
            return {
                ...state,
                isLoadingIns: true,
                errorIns: INITIAL_STATE.error
            }
        }
        case 'SURVEY_INS_FAILURE': {
            return {
                ...state,
                isLoadingIns: false,
                errorIns: { hasError: true, message: action.payload.data }
            }
        }
        case 'SURVEY_INS_SUCCESS': {
            return {
                ...state,
                isLoadingIns: false,
                errorIns: { hasError: false }
            };
        }
        default:
            return state;
    }
};
