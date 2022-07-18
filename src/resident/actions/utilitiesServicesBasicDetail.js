import axios from 'axios';
import { get, helper, post } from '../services/helper';
import firebase from 'firebase';
import {
    UTILITIES_SERVICES_BASIC_DETAIL_RESET_BY_KEY,
    UTILITIES_SERVICES_BASIC_DETAIL_REFRESHING,
    UTILITIES_SERVICES_BASIC_DETAIL_REQUEST,
    UTILITIES_SERVICES_BASIC_DETAIL_SUCCESS,
    UTILITIES_SERVICES_BASIC_DETAIL_FAILURE,
    SERVICES_BASIC_FEEDBACK_REQUEST,
    SERVICES_BASIC_FEEDBACK_SUCCESS,
    SERVICES_BASIC_FEEDBACK_FAILURE
} from './actionTypes';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest)
        dispatch({ type: UTILITIES_SERVICES_BASIC_DETAIL_REQUEST });
        const url = '/Residents/ServiceBasic/Detail';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
              //  console.log(ret.data)
                dispatch({
                    type: UTILITIES_SERVICES_BASIC_DETAIL_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
            }
            else {
                dispatch({ type: UTILITIES_SERVICES_BASIC_DETAIL_FAILURE, payload: { data: ret.message } });
            }
        }
        else {
            dispatch({ type: UTILITIES_SERVICES_BASIC_DETAIL_FAILURE, payload: { data: ret.message } });
        }
    } catch (error) {
        dispatch({ type: UTILITIES_SERVICES_BASIC_DETAIL_FAILURE, payload: { data: ret.message } });
    }
};

export const feedbackHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest)
        dispatch({ type: SERVICES_BASIC_FEEDBACK_REQUEST });
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
                type: SERVICES_BASIC_FEEDBACK_SUCCESS,
                payload: {
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
                type: SERVICES_BASIC_FEEDBACK_FAILURE,
                payload: {
                    data: response.message
                }
            });
        }

    } catch (error) {
        // console.log(error);
        dispatch({
            type: SERVICES_BASIC_FEEDBACK_FAILURE,
            payload: {
                data: 'Xảy ra lỗi không xác định'
            }
        });
    }
};
export const resetStateByKey = (payload) => ({
    type: UTILITIES_SERVICES_BASIC_DETAIL_RESET_BY_KEY,
    payload
});

export const refreshDataHandle = () => ({
    type: UTILITIES_SERVICES_BASIC_DETAIL_REFRESHING
});

