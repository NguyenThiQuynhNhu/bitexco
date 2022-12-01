import { get, helper, post } from '../services/helper';
import firebase from 'firebase';
import axios from 'axios';
import {
    DEPARMENT_DETAIL_RESET_BY_KEY,
    DEPARMENT_DETAIL_REQUEST,
    DEPARMENT_DETAIL_SUCCESS,
    DEPARMENT_DETAIL_FAILURE,
    DEPARMENT_UPDATE_REQUEST,
    DEPARMENT_UPDATE_SUCCESS,
    DEPARMENT_UPDATE_FAILURE,
    DEPARMENT_ON_VALUE_CHANGE
} from './actionTypes';

export const loadDataHandle = (dataRequest) => async (dispatch) => {

    try {

        dispatch({ type: DEPARMENT_DETAIL_REQUEST });
        const url = '/Residents/TowerJoined';
        const ret = await get(url, dataRequest);
        console.log(ret)
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                dispatch({ type: DEPARMENT_DETAIL_SUCCESS, payload: { data: ret.data } });
            }
            else {
                dispatch({ type: DEPARMENT_DETAIL_FAILURE });
            }
        }
        else {
            dispatch({ type: DEPARMENT_DETAIL_FAILURE });
        }
    } catch (error) {
        dispatch({ type: DEPARMENT_DETAIL_FAILURE });
    }
};

export const updateDepartmentDefault = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest)
        dispatch({ type: DEPARMENT_UPDATE_REQUEST });
        const token = await firebase.auth().currentUser.getIdToken();
        const url = `/Residents/UpdateDepartmentDefault`;
        // const ret = await axios.post(url, dataRequest,
        //     {
        //         headers: {
        //             Authorization: `bearer ${token}`
        //         }
        //     });
        //sửa
        const ret = await post(url, dataRequest);
        if (ret.status == 200) {
            dispatch({
                type: DEPARMENT_UPDATE_SUCCESS,
                payload: dataRequest
            });
        } else {
            dispatch({
                type: DEPARMENT_UPDATE_FAILURE,
                payload: {
                    data: ret.message,
                }
            });
        }
    } catch (error) {
        console.log(error);
        dispatch({
            type: DEPARMENT_UPDATE_FAILURE,
            payload: {
                data: 'Xảy ra lỗi không xác định'
            }
        });
    }
};

export const resetStateByKey = ({ key, path, value }) => ({
    type: DEPARMENT_DETAIL_RESET_BY_KEY,
    payload: { key, path, value }
});

export const refreshDataHandle = () => ({
    type: 'DEPARMENT_DETAIL_REFRESHING'
});

export const onValueChange = (payload) => ({
    type: DEPARMENT_ON_VALUE_CHANGE,
    payload
});

