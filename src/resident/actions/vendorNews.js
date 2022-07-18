import { get } from '../services/helper';
import {
    VENDOR_NEWS_GETLIST_RESET_BY_KEY,
    VENDOR_NEWS_GETLIST_REFRESHING,
    VENDOR_NEWS_GETLIST_REQUEST,
    VENDOR_NEWS_GETLIST_SUCCESS,
    VENDOR_NEWS_GETLIST_FAILURE
} from './actionTypes';

export const loadDataHandle = (dataRequest) => async (dispatch) => {

    try {

        dispatch({ type: VENDOR_NEWS_GETLIST_REQUEST });
        const url = '/Residents/NewsList';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                dispatch({ type: VENDOR_NEWS_GETLIST_SUCCESS, payload: { data: ret.data } });
            }
            else {
                dispatch({ type: VENDOR_NEWS_GETLIST_FAILURE });
            }
        }
        else {
            dispatch({ type: VENDOR_NEWS_GETLIST_FAILURE });
        }
    } catch (error) {
        dispatch({ type: VENDOR_NEWS_GETLIST_FAILURE });
    }
};
export const refreshDataHandle = () => ({
    type: VENDOR_NEWS_GETLIST_REFRESHING
});
export const resetStateByKey = ({ key, path, value }) => ({
    type: VENDOR_NEWS_GETLIST_RESET_BY_KEY,
    payload: { key, path, value }
});

export const onSubmitEditing = isApplySearchKey => ({
    type: 'VENDOR_NEWS_ON_SUBMIT_EDITING'
})
export const onChangeText = payload => ({
    type: 'VENDOR_NEWS_ON_CHANGE_TEXT',
    payload
})
export const onClearText = payload => ({
    type: 'VENDOR_NEWS_ON_CLEAR_TEXT',
    payload
})