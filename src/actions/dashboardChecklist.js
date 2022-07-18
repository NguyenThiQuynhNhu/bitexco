import axios from 'axios';
import { get, helper } from '../services/helper';
import {
    DASHBOARD_CHECKLIST_GETLIST_REQUEST,
    DASHBOARD_CHECKLIST_GETLIST_SUCCESS,
    DASHBOARD_CHECKLIST_GETLIST_FAILURE,
    DASHBOARD_CHECKLIST_GETLIST_REFRESHING
} from './actionTypes';
import firebase from 'firebase';

export const loadDataHandle = (dataRequest) => async (dispatch) => {

    try {
        //console.log(dataRequest);
        dispatch({ type: DASHBOARD_CHECKLIST_GETLIST_REQUEST });
        const url = `/Vendors/Dashboard/ChecklistList`;
        //console.log(url)
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                //
                dispatch({
                    type: DASHBOARD_CHECKLIST_GETLIST_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
            }
            else {
                dispatch({ type: DASHBOARD_CHECKLIST_GETLIST_FAILURE });
            }
        }
        else {
            dispatch({ type: DASHBOARD_CHECKLIST_GETLIST_FAILURE });
        }
    } catch (error) {
        dispatch({ type: DASHBOARD_CHECKLIST_GETLIST_FAILURE });
    }
};
export const refreshDataHandle = () => ({
    type: DASHBOARD_CHECKLIST_GETLIST_REFRESHING
});
export const resetStateByKey = ({ key, path, value }) => ({
    type: 'DASHBOARD_CHECKLIST_GETLIST_RESET_BY_KEY',
    payload: { key, path, value }
});