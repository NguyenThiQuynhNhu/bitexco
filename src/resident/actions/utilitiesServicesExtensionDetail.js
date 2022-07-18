import axios from 'axios';
import { get, helper, post } from '../services/helper';
import firebase from 'firebase';
import {
    UTILITIES_SERVICES_EXTENSION_DETAIL_RESET_BY_KEY,
    UTILITIES_SERVICES_EXTENSION_DETAIL_REFRESHING,
    UTILITIES_SERVICES_EXTENSION_DETAIL_REQUEST,
    UTILITIES_SERVICES_EXTENSION_DETAIL_SUCCESS,
    UTILITIES_SERVICES_EXTENSION_DETAIL_FAILURE,
    SERVICES_EXTENSION_RATE_REQUEST,
    SERVICES_EXTENSION_RATE_FAILURE,
    SERVICES_EXTENSION_RATE_SUCCESS,
    SERVICES_EXTENSION_FEEDBACK_REQUEST,
    SERVICES_EXTENSION_FEEDBACK_SUCCESS,
    SERVICES_EXTENSION_FEEDBACK_FAILURE
} from './actionTypes';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
       // console.log(dataRequest)
        dispatch({ type: UTILITIES_SERVICES_EXTENSION_DETAIL_REQUEST });
        const url = '/Residents/ServiceExtension/Detail';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
              //  console.log(ret.data)
                dispatch({
                    type: UTILITIES_SERVICES_EXTENSION_DETAIL_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
            }
            else {
                dispatch({ type: UTILITIES_SERVICES_EXTENSION_DETAIL_FAILURE, payload: { data: ret.message } });
            }
        }
        else {
            dispatch({ type: UTILITIES_SERVICES_EXTENSION_DETAIL_FAILURE, payload: { data: ret.message } });
        }
    } catch (error) {
        dispatch({ type: UTILITIES_SERVICES_EXTENSION_DETAIL_FAILURE, payload: { data: ret.message } });
    }
};
export const ratingHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest)
        dispatch({ type: SERVICES_EXTENSION_RATE_REQUEST });
        const token = await firebase.auth().currentUser.getIdToken();
        const url = `/Residents/ServiceExtension/Rating`;
        //sửa
        const ret = await post(url, dataRequest);
        // const ret = await axios.post(url, dataRequest,
        //     {
        //         headers: {
        //             Authorization: `bearer ${token}`
        //         }
        //     });
        if (ret.status == 200) {
            dispatch({
                type: SERVICES_EXTENSION_RATE_SUCCESS,
                payload: dataRequest
            });
        } else {
            dispatch({
                type: SERVICES_EXTENSION_RATE_FAILURE,
                payload: {
                    data: ret.message,
                }
            });
        }
    } catch (error) {
        console.log(error);
        dispatch({
            type: SERVICES_EXTENSION_RATE_FAILURE,
            payload: {
                data: 'Xảy ra lỗi không xác định'
            }
        });
    }
};

export const feedbackHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest)
        dispatch({ type: SERVICES_EXTENSION_FEEDBACK_REQUEST });
        const token = await firebase.auth().currentUser.getIdToken();
        const url = `/Residents/Service/Feedback`;
        //sửa
        const response = await post(url, dataRequest);
        // const response = await axios.post(url,
        //     dataRequest,
        //     {
        //         headers: {
        //             Authorization: `bearer ${token}`
        //         }
        //     });
        if (response.status === 200) {
            dispatch({
                type: SERVICES_EXTENSION_FEEDBACK_SUCCESS,
                payload: {
                    // data: response.data,
                    // status: response.status,
                    // statusText: response.statusText,
                    // dataUpdateToList: {
                    //     id: dataRequest.id
                    // },
                    dataHis: {
                        description: dataRequest.description,
                        statusName: 'Tôi phản hồi',
                        userName: '',
                        isCustomer: true,
                        dateActive: new Date()
                    }
                }
            });
        } else {
            dispatch({
                type: SERVICES_EXTENSION_FEEDBACK_FAILURE,
                payload: {
                    data: response.message
                }
            });
        }

    } catch (error) {
        // console.log(error);
        dispatch({
            type: SERVICES_EXTENSION_FEEDBACK_FAILURE,
            payload: {
                data: 'Xảy ra lỗi không xác định'
            }
        });
    }
};
export const resetStateByKey = (payload) => ({
    type: UTILITIES_SERVICES_EXTENSION_DETAIL_RESET_BY_KEY,
    payload
});

export const refreshDataHandle = () => ({
    type: UTILITIES_SERVICES_EXTENSION_DETAIL_REFRESHING
});

