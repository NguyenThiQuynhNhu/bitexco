import { get } from '../services/helper';
import {
    SHIFTCHANGE_GETLIST_REQUEST,
    SHIFTCHANGE_GETLIST_SUCCESS,
    SHIFTCHANGE_GETLIST_FAILURE,
    SHIFTCHANGE_GETLIST_REFRESHING,
    SHIFTCHANGE_GETLIST_RESET_BY_KEY,
    SHIFTCHANGE_GET_TOTAL_STATUS_REQUEST,
    SHIFTCHANGE_GET_TOTAL_STATUS_SUCCESS,
    SHIFTCHANGE_GET_TOTAL_STATUS_FAILURE
} from './actionTypes';

export const loadDataHandle = (dataRequest) => async (dispatch) => {

    try {
        //console.log(dataRequest);
        dispatch({ type: SHIFTCHANGE_GETLIST_REQUEST });
        const url = '/Vendors/ShiftChange/List';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                dispatch({
                    type: SHIFTCHANGE_GETLIST_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
            }
            else {
                dispatch({ type: SHIFTCHANGE_GETLIST_FAILURE });
            }
        }
        else {
            dispatch({ type: SHIFTCHANGE_GETLIST_FAILURE });
        }
    } catch (error) {
        dispatch({ type: SHIFTCHANGE_GETLIST_FAILURE });
    }
};
export const refreshDataHandle = () => ({
    type: SHIFTCHANGE_GETLIST_REFRESHING
});
export const resetStateByKey = ({ key, path, value }) => ({
    type: SHIFTCHANGE_GETLIST_RESET_BY_KEY,
    payload: { key, path, value }
});
export const onSubmitEditing = isApplySearchKey => ({
    type: 'SHIFTCHANGE_ON_SUBMIT_EDITING'
})
export const onChangeText = payload => ({
    type: 'SHIFTCHANGE_ON_CHANGE_TEXT',
    payload
})
export const onClearText = payload => ({
    type: 'SHIFTCHANGE_ON_CLEAR_TEXT',
    payload
})

export const onSelectedStatus = payload => ({
    type: 'ON_STATUS_CHANGE',
    payload
})

export const onFilter = payload => ({
    type: 'ON_FILTER',
    payload
})

export const onClearFilter = () => ({
    type: 'ON_CLEAR_FILTER'
})
