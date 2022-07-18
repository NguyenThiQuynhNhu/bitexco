import { get } from '../services/helper';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    //console.log(dataRequest)
    dispatch({ type: 'HOTLINE_GETLIST_REQUEST' });
    const url = '/Residents/Hotline';
    const ret = await get(url, dataRequest);
    //console.log(ret)
    if (ret !== -1) {
        dispatch({ type: 'HOTLINE_GETLIST_SUCCESS', payload: { data: ret.data } });
    }
    else {
        dispatch({ type: 'HOTLINE_GETLIST_FAILURE' });
    }
};
export const refreshDataHandle = () => ({
    type: 'HOTLINE_GETLIST_REFRESHING'
});
export const resetStateByKey = ({ key, path, value }) => ({
    type: 'HOTLINE_GETLIST_RESET_BY_KEY',
    payload: { key, path, value }
});
export const onSubmitEditing = isApplySearchKey => ({
    type: 'HOTLINE_ON_SUBMIT_EDITING'
})
export const onChangeText = payload => ({
    type: 'HOTLINE_ON_CHANGE_TEXT',
    payload
})
export const onClearText = payload => ({
    type: 'HOTLINE_ON_CLEAR_TEXT',
    payload
})