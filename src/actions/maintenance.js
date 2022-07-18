import axios from 'axios';
import { get, helper } from '../services/helper';
import {
    MAINTENANCE_GETLIST_REQUEST,
    MAINTENANCE_GETLIST_SUCCESS,
    MAINTENANCE_GETLIST_FAILURE,
    MAINTENANCE_GETLIST_REFRESHING,
    MAINTENANCE_GETLIST_RESET_BY_KEY,
    MAINTENANCE_GET_TOTAL_STATUS_REQUEST,
    MAINTENANCE_GET_TOTAL_STATUS_SUCCESS,
    MAINTENANCE_GET_TOTAL_STATUS_FAILURE
} from './actionTypes';
import firebase from 'firebase';


export const getRequestStatusTotal = (dataRequest) => async (dispatch) => {
    try {
        dispatch({ type: MAINTENANCE_GET_TOTAL_STATUS_REQUEST });
        const url = '/Vendors/RequestStatusTotal';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                //
                dispatch({
                    type: MAINTENANCE_GET_TOTAL_STATUS_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
            }
            else {
                dispatch({ type: MAINTENANCE_GET_TOTAL_STATUS_FAILURE });
            }
        }
        else {
            dispatch({ type: MAINTENANCE_GET_TOTAL_STATUS_FAILURE });
        }
    } catch (error) {
        console.log(error)
        dispatch({ type: MAINTENANCE_GET_TOTAL_STATUS_FAILURE });
    }
}
export const loadDataHandle = (dataRequest) => async (dispatch) => {

    try {
        //console.log(dataRequest);
        dispatch({ type: MAINTENANCE_GETLIST_REQUEST });
        const url = '/Vendors/Home/MaintenanceList';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                dispatch({
                    type: MAINTENANCE_GETLIST_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
            }
            else {
                dispatch({ type: MAINTENANCE_GETLIST_FAILURE });
            }
        }
        else {
            dispatch({ type: MAINTENANCE_GETLIST_FAILURE });
        }
    } catch (error) {
        dispatch({ type: MAINTENANCE_GETLIST_FAILURE });
    }
};
export const refreshDataHandle = () => ({
    type: MAINTENANCE_GETLIST_REFRESHING
});
export const resetStateByKey = ({ key, path, value }) => ({
    type: MAINTENANCE_GETLIST_RESET_BY_KEY,
    payload: { key, path, value }
});
export const onSubmitEditing = isApplySearchKey => ({
    type: 'MAINTENANCE_ON_SUBMIT_EDITING'
})
export const onChangeText = payload => ({
    type: 'MAINTENANCE_ON_CHANGE_TEXT',
    payload
})
export const onClearText = payload => ({
    type: 'MAINTENANCE_ON_CLEAR_TEXT',
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
