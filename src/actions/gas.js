import { get } from '../services/helper';
import {
    GAS_CREATE_SUCCESS,
    GAS_GETLIST_REQUEST,
    GAS_GETLIST_SUCCESS,
    GAS_GETLIST_FAILURE,
    GAS_GETLIST_REFRESHING,
    GAS_GETLIST_RESET_BY_KEY,
    GAS_CLOSE_SUCCESS,
} from './actionTypes';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest);
        dispatch({ type: GAS_GETLIST_REQUEST });
        const url = '/Gas/GetList';
        const ret = await get(url, dataRequest);
        console.log('data', ret);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                dispatch({
                    type: GAS_GETLIST_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
            }
            else {
                dispatch({ type: GAS_GETLIST_FAILURE });
            }
        }
        else {
            dispatch({ type: GAS_GETLIST_FAILURE });
        }
    } catch (error) {
        dispatch({ type: GAS_GETLIST_FAILURE });
    }
};

export const refreshDataHandle = () => ({
    type: GAS_GETLIST_REFRESHING
});

export const resetStateByKey = ({ key, path, value }) => ({
    type: GAS_GETLIST_RESET_BY_KEY,
    payload: { key, path, value }
});

export const onSubmitEditing = isApplySearchKey => ({
    type: 'GAS_ON_SUBMIT_EDITING'
})

export const onChangeText = payload => ({
    type: 'GAS_ON_CHANGE_TEXT',
    payload
})

export const onChangeText2 = payload => ({
    type: 'GAS_ON_CHANGE_TEXT2',
    payload
})

export const onClearText = payload => ({
    type: 'GAS_ON_CLEAR_TEXT',
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