import axios from 'axios';
import { get, helper } from '../services/helper';

import firebase from 'firebase';

export const getVendorsList = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest);
        dispatch({ type: VENDORS_GETLIST_REQUEST });
        const url = '/Vendors/TowerList';
        const ret = await get(url, dataRequest);
        //console.log(ret);
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
export const resetStateByKey = ({ key, path, value }) => ({
    type: VENDORS_GETLIST_RESET_BY_KEY,
    payload: { key, path, value }
});