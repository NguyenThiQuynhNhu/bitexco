import { get, helper, post } from '../services/helper';
import {
    VENDORS_DETAIL_REQUEST,
    VENDORS_DETAIL_SUCCESS,
    VENDORS_DETAIL_FAILURE,
    VENDORS_DETAIL_REFRESHING,
    VENDORS_DETAIL_RESET_BY_KEY
} from './actionTypes';
import axios from 'axios';
import firebase from 'firebase';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {

        dispatch({ type: VENDORS_DETAIL_REQUEST });
        const url = '/Residents/TowerDetail';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret === -1) {
                // dispatch({ type: NO_HASANY_COMPANY });
            }
            else if (ret !== -1 && ret.status == 200) {
                dispatch({ type: VENDORS_DETAIL_SUCCESS, payload: { data: ret.data } });
            }
            else {
                dispatch({ type: VENDORS_DETAIL_FAILURE });
            }
        }
        else {
            dispatch({ type: VENDORS_DETAIL_FAILURE });
        }
    } catch (error) {

        dispatch({ type: VENDORS_DETAIL_FAILURE });
    }
};
export const loadHandle = (dataRequest) => async (dispatch) => {
    try {
        dispatch({ type: VENDORS_DETAIL_REQUEST });
        const url = '/Residents/TowerDetail';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret === -1) {
                // dispatch({ type: NO_HASANY_COMPANY });
            }
            else if (ret !== -1 && ret.status == 200) {
                dispatch({ type: VENDORS_DETAIL_SUCCESS, payload: { data: ret.data } });
            }
            else {
                dispatch({ type: VENDORS_DETAIL_FAILURE, payload: { data: ret.data } });
            }
        }
        else {
            dispatch({ type: VENDORS_DETAIL_FAILURE });
        }
    } catch (error) {

        dispatch({ type: VENDORS_DETAIL_FAILURE });
    }
};
export const refreshDataHandle = () => ({
    type: VENDORS_DETAIL_REFRESHING
});
export const resetStateByKey = ({ key, path, value }) => ({
    type: VENDORS_DETAIL_RESET_BY_KEY,
    payload: { key, path, value }
});

export const updateStatusVendorHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest)
        dispatch({ type: 'VENDOR_UPDATE_STATUS_REQUEST' });
        const token = await firebase.auth().currentUser.getIdToken();
        const url = `/Residents/TowerStatus`;
        try {
            //sửa
            const response = await post(url, dataRequest);
            // const response = await axios.post(url, dataRequest, {
            //     headers: {
            //         Authorization: `bearer ${token}`
            //     }
            // });
            //console.log(response)
            if (response.status === 200) {
                dispatch({
                    type: 'VENDOR_UPDATE_STATUS_SUCCESS',
                    payload: {
                        data: dataRequest.statusId,
                        status: response.status,
                        statusText: response.statusText
                    }
                });
            } else {
                dispatch({
                    type: 'VENDOR_UPDATE_STATUS_FAILURE',
                    payload: {
                        data: null,
                        status: response.status,
                        statusText: response.statusText
                    }
                });
            }
        } catch (error) {
            if (error.response) {
                dispatch({
                    type: 'VENDOR_UPDATE_STATUS_FAILURE',
                    payload: {
                        data: error.response.data,
                        status: error.response.status,
                        statusText: error.response.headers
                    }
                });
            }
        }
    } catch (error) {
        dispatch({
            type: 'VENDOR_UPDATE_STATUS_FAILURE',
            payload: {
                data: null,
                status: -99,
                statusText: null
            }
        });
    }
};