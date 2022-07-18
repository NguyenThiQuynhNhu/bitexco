import axios from 'axios';
import { get, helper } from '../services/helper';
import {
    CHANGE_STATE_ISLOADING,
    CHANGE_STATE_ERROR,
    VENDORS_GETLIST_REQUEST,
    VENDORS_GETLIST_SUCCESS,
    VENDORS_GETLIST_FAILURE,
    VENDORS_GETLIST_REFRESHING,
    VENDORS_GETLIST_RESET_BY_KEY
} from './actionTypes';
import firebase from 'firebase';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest);
        dispatch({ type: VENDORS_GETLIST_REQUEST });
        const url = '/Vendors/TowerList';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                dispatch({ type: VENDORS_GETLIST_SUCCESS, payload: { data: ret.data } });
            }
            else {
                dispatch({ type: VENDORS_GETLIST_FAILURE });
            }
        }
        else {
            dispatch({ type: VENDORS_GETLIST_FAILURE });
        }
    } catch (error) {
        dispatch({ type: VENDORS_GETLIST_FAILURE });
    }


};
export const refreshDataHandle = () => ({
    type: VENDORS_GETLIST_REFRESHING
});
export const resetStateByKey = ({ key, path, value }) => ({
    type: VENDORS_GETLIST_RESET_BY_KEY,
    payload: { key, path, value }
});