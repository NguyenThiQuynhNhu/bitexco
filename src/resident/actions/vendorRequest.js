import axios from 'axios';
import { get, helper } from '../services/helper';
import {
    VENDOR_REQUESTS_GETLIST_REQUEST,
    VENDOR_REQUESTS_GETLIST_SUCCESS,
    VENDOR_REQUESTS_GETLIST_FAILURE,
    VENDOR_REQUESTS_GETLIST_REFRESHING,
    VENDOR_REQUESTS_GETLIST_RESET_BY_KEY
} from './actionTypes';
import firebase from 'firebase';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest);
        dispatch({ type: VENDOR_REQUESTS_GETLIST_REQUEST });
        const url = '/Residents/RequestList';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
      
                dispatch({
                    type: VENDOR_REQUESTS_GETLIST_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
            }
            else {
                dispatch({ type: VENDOR_REQUESTS_GETLIST_FAILURE });
            }
        }
        else {
            dispatch({ type: VENDOR_REQUESTS_GETLIST_FAILURE });
        }
    } catch (error) {
        dispatch({ type: VENDOR_REQUESTS_GETLIST_FAILURE, payload: { error: error.response.data } });
    }


};
export const refreshDataHandle = () => ({
    type: VENDOR_REQUESTS_GETLIST_REFRESHING
});
export const resetStateByKey = ({ key, path, value }) => ({
    type: VENDOR_REQUESTS_GETLIST_RESET_BY_KEY,
    payload: { key, path, value }
});
export const onSubmitEditing = isApplySearchKey => ({
    type: 'VENDOR_REQUEST_ON_SUBMIT_EDITING'
})
export const onChangeText = payload => ({
    type: 'VENDOR_REQUEST_ON_CHANGE_TEXT',
    payload
})
export const onClearText = payload => ({
    type: 'VENDOR_REQUEST_ON_CLEAR_TEXT',
    payload
})