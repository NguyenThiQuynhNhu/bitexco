import _ from 'lodash';


const INITIAL_STATE = {
    initComponent: true,
    emptyData: false,
    isRefreshing: false,
    isLoading: false,
    data: [],
    error: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'BUILDING_DETAIL_RESET_BY_KEY': {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case 'BUILDING_DETAIL_REQUEST': {
            return {
                ...state,
                isLoading: true,
                emptyData: INITIAL_STATE.emptyData,
                error: INITIAL_STATE.error
            };
        }
        case 'BUILDING_DETAIL_SUCCESS': {

            return {
                ...state,
                initComponent:false,
                isLoading: false,
                data: action.payload.data,
                error: {
                    hasError: false,
                    //error: action.payload.error 
                }
            };
        }
        case 'BUILDING_DETAIL_FAILURE': {
            return {
                ...state,
                initList: INITIAL_STATE.initList,
                isLoading: false,
                isRefreshing: false,
                error: {
                    hasError: true,
                    //error: action.payload.error 
                }
            };
        }
        case 'BUILDING_DETAIL_REFRESHING': {
            return {
                ...state,
                currentPage: INITIAL_STATE.currentPage,
                isLoading: true,
                isRefreshing: true,
                outOfStock: INITIAL_STATE.outOfStock,
                data: []
            };
        }
        default: return state;
    }
};
