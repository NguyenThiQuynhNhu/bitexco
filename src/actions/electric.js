import { get } from '../services/helper';
import {
    ELECTRIC_GETLIST_REQUEST,
    ELECTRIC_GETLIST_SUCCESS,
    ELECTRIC_GETLIST_FAILURE,
    ELECTRIC_GETLIST_REFRESHING,
    ELECTRIC_GETLIST_RESET_BY_KEY
} from './actionTypes';

export const loadDataHandle = (dataRequest) => async (dispatch) => {

    try {
        //console.log(dataRequest);
        dispatch({ type: ELECTRIC_GETLIST_REQUEST });
        const url = '/Electric/GetList';
        const ret = await get(url, dataRequest);
        console.log('/Electric/GetList', ret)
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                dispatch({
                    type: ELECTRIC_GETLIST_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
            }
            else {
                dispatch({ type: ELECTRIC_GETLIST_FAILURE });
            }
        }
        else {
            dispatch({ type: ELECTRIC_GETLIST_FAILURE });
        }
    } catch (error) {
        dispatch({ type: ELECTRIC_GETLIST_FAILURE });
    }
};

export const refreshDataHandle = () => ({
    type: ELECTRIC_GETLIST_REFRESHING
});

export const resetStateByKey = ({ key, path, value }) => ({
    type: ELECTRIC_GETLIST_RESET_BY_KEY,
    payload: { key, path, value }
});

export const onSubmitEditing = isApplySearchKey => ({
    type: 'ELECTRIC_ON_SUBMIT_EDITING'
})

export const onChangeText = payload => ({
    type: 'ELECTRIC_ON_CHANGE_TEXT',
    payload
})

export const onChangeText2 = payload => ({
    type: 'ELECTRIC_ON_CHANGE_TEXT2',
    payload
})

export const onClearText = payload => ({
    type: 'ELECTRIC_ON_CLEAR_TEXT',
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