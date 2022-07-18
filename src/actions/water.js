import { get } from '../services/helper';
import {
    WATER_GETLIST_REQUEST,
    WATER_GETLIST_SUCCESS,
    WATER_GETLIST_FAILURE,
    WATER_GETLIST_REFRESHING,
    WATER_GETLIST_RESET_BY_KEY
} from './actionTypes';

export const loadDataHandle = (dataRequest) => async (dispatch) => {

    try {
        //console.log(dataRequest);
        dispatch({ type: WATER_GETLIST_REQUEST });
        const url = '/Water/GetList';
        const ret = await get(url, dataRequest);
        console.log('water', ret);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                dispatch({
                    type: WATER_GETLIST_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
            }
            else {
                dispatch({ type: WATER_GETLIST_FAILURE });
            }
        }
        else {
            dispatch({ type: WATER_GETLIST_FAILURE });
        }
    } catch (error) {
        dispatch({ type: WATER_GETLIST_FAILURE });
    }
};

export const refreshDataHandle = () => ({
    type: WATER_GETLIST_REFRESHING
});

export const resetStateByKey = ({ key, path, value }) => ({
    type: WATER_GETLIST_RESET_BY_KEY,
    payload: { key, path, value }
});

export const onSubmitEditing = isApplySearchKey => ({
    type: 'WATER_ON_SUBMIT_EDITING'
})

export const onChangeText = payload => ({
    type: 'WATER_ON_CHANGE_TEXT',
    payload
})

export const onChangeText2 = payload => ({
    type: 'WATER_ON_CHANGE_TEXT2',
    payload
})

export const onClearText = payload => ({
    type: 'WATER_ON_CLEAR_TEXT',
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

export const onSetItem = payload => ({
    type: 'ON_SET_ITEM',
    payload
})