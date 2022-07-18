import axios from 'axios';
import { get, helper, post } from '../services/helper';
import {
    REQUEST_DETAIL_REQUEST,
    REQUEST_DETAIL_SUCCESS,
    REQUEST_DETAIL_FAILURE,
    REQUEST_DETAIL_REFRESHING,
    REQUEST_DETAIL_RESET_BY_KEY,
    REQUEST_CLOSE_REQUEST,
    REQUEST_CLOSE_SUCCESS,
    REQUEST_CLOSE_FAILURE
} from './actionTypes';
import firebase from 'firebase';
import moment from 'moment';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log('dataRequest', dataRequest);
        dispatch({ type: REQUEST_DETAIL_REQUEST });
        const url = '/Vendors/RequestDetail';
        const ret = await get(url, dataRequest);
        //console.log(ret)
        if(ret == -1) {
            dispatch({ type: REQUEST_DETAIL_FAILURE });
        }else if ( ret !== -1 &&ret !== undefined && ret !== null) {
            //console.log('nhu')
            if (ret.status == 200) {
                dispatch({ type: REQUEST_DETAIL_SUCCESS, payload: { data: ret.data } });
            }
            else {
                dispatch({ type: REQUEST_DETAIL_FAILURE });
            }
        }
        else {
            dispatch({ type: REQUEST_DETAIL_FAILURE });
        }
    } catch (error) {
        dispatch({ type: REQUEST_DETAIL_FAILURE });
    }
};

export const updateRequestHandle = (dataRequest, api) => async (dispatch) => {
    try {

        //console.log({ dataRequest, api })

        dispatch({ type: 'REQUEST_UPDATE_REQUEST' });
        const token = await firebase.auth().currentUser.getIdToken();
        const url = `/Vendors/${api}`;
        try {
            // const response = await axios.post(url, dataRequest, {
            //     headers: {
            //         Authorization: `bearer ${token}`
            //     }
            // });
            //sửa
            const response = await post(url, dataRequest);
            console.log('REQUEST_UPDATE_REQUEST', response)
            if (response.status === 200) {
                dispatch({
                    type: 'REQUEST_UPDATE_SUCCESS',
                    payload: {
                        data: response.data,
                        status: response.status,
                        statusText: response.statusText,
                        // dataUpdateToList: {
                        //     id: dataRequest.id
                        // },
                        // dataHis: {
                        //     content: dataRequest.request.content,
                        //     statusName: 'Tôi phản hồi',
                        //     userName: '',
                        //     isCustomer: true,
                        //     dateActive: new Date()
                        // }
                    }
                });
            } else {
                dispatch({
                    type: 'REQUEST_UPDATE_FAILURE',
                    payload: {
                        data: null,
                        status: response.status,
                        statusText: response.statusText
                    }
                });
            }
        } catch (error) {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
                dispatch({
                    type: 'REQUEST_UPDATE_FAILURE',
                    payload: {
                        data: error.response.data,
                        status: error.response.status,
                        statusText: error.response.headers
                    }
                });
            }
        }
    } catch (error) {
        // console.log(error);
        dispatch({
            type: 'REQUEST_UPDATE_FAILURE',
            payload: {
                data: null,
                status: -99,
                statusText: null
            }
        });
    }
};

export const refreshDataHandle = () => ({
    type: REQUEST_DETAIL_REFRESHING
});
export const resetStateByKey = ({ key, path, value }) => ({
    type: REQUEST_DETAIL_RESET_BY_KEY,
    payload: { key, path, value }
});