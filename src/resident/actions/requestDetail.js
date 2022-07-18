import axios from 'axios';
import { get, helper, post } from '../services/helper';
import {
    R_REQUEST_DETAIL_REQUEST,
    R_REQUEST_DETAIL_SUCCESS,
    R_REQUEST_DETAIL_FAILURE,
    R_REQUEST_DETAIL_REFRESHING,
    R_REQUEST_DETAIL_RESET_BY_KEY,
    R_REQUEST_CLOSE_REQUEST,
    R_REQUEST_CLOSE_SUCCESS,
    R_REQUEST_CLOSE_FAILURE,
    R_REQUEST_RATE_REQUEST,
    R_REQUEST_RATE_SUCCESS,
    R_REQUEST_RATE_FAILURE,
} from './actionTypes';
import firebase from 'firebase';


export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        dispatch({ type: R_REQUEST_DETAIL_REQUEST });
        const url = '/Residents/RequestDetail';
        const ret = await get(url, dataRequest);
        //console.log(ret)
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
              //  console.log(ret.data)
                dispatch({ type: R_REQUEST_DETAIL_SUCCESS, payload: { data: ret.data } });
            }
            else {
                dispatch({ type: R_REQUEST_DETAIL_FAILURE });
            }
        }
        else {
            dispatch({ type: R_REQUEST_DETAIL_FAILURE });
        }
    } catch (error) {
        dispatch({ type: R_REQUEST_DETAIL_FAILURE });
    }
};
export const ratingHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest)
        dispatch({ type: R_REQUEST_RATE_REQUEST });
        const token = await firebase.auth().currentUser.getIdToken();
        const url = `/Residents/RequestRating`;
        //sửa
        const ret = await post(url, dataRequest);
        // const ret = await axios.post(url, dataRequest,
        //     {
        //         headers: {
        //             Authorization: `bearer ${token}`
        //         }
        //     });
        //console.log(ret);
        if (ret.status == 200) {
            dispatch({
                type: R_REQUEST_RATE_SUCCESS,
                payload: dataRequest
            });
        } else {
            dispatch({
                type: R_REQUEST_RATE_FAILURE,
                payload: {
                    data: ret.message,
                }
            });
        }
    } catch (error) {
        console.log(error);
        dispatch({
            type: R_REQUEST_RATE_FAILURE,
            payload: {
                data: 'Xảy ra lỗi không xác định'
            }
        });
    }
};

export const closeRequestHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest)
        dispatch({ type: R_REQUEST_CLOSE_REQUEST });
        const token = await firebase.auth().currentUser.getIdToken();
        const url = `/Residents/RequestUpdateStatus`;
        try {
            // const response = await axios.post(url, dataRequest.request, {
            //     headers: {
            //         Authorization: `bearer ${token}`
            //     }
            // });
            //sửa
            const response = await post(url, dataRequest.request);
            if (response.status === 200) {
                dispatch({
                    type: R_REQUEST_CLOSE_SUCCESS,
                    payload: {
                        data: response.data,
                        status: response.status,
                        statusText: response.statusText,
                        dataUpdateToList: {
                            id: dataRequest.id
                        },
                        dataHis: {
                            content: dataRequest.request.content,
                            statusName: 'Tôi phản hồi',
                            userName: '',
                            isCustomer: true,
                            dateActive: new Date()
                        }
                    }
                });
            } else {
                dispatch({
                    type: R_REQUEST_CLOSE_FAILURE,
                    payload: {
                        data: response.message
                    }
                });
            }
        } catch (error) {
            if (error.response) {
                dispatch({
                    type: R_REQUEST_CLOSE_FAILURE,
                    payload: {
                        data: error.response.headers
          
                    }
                });
            }
        }
    } catch (error) {
        // console.log(error);
        dispatch({
            type: R_REQUEST_CLOSE_FAILURE,
            payload: {
                data: 'Xảy ra lỗi không xác định'
            }
        });
    }
};
export const refreshDataHandle = () => ({
    type: R_REQUEST_DETAIL_REFRESHING
});
export const resetStateByKey = ({ key, path, value }) => ({
    type: R_REQUEST_DETAIL_RESET_BY_KEY,
    payload: { key, path, value }
});