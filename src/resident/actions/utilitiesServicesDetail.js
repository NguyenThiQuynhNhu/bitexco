import axios from 'axios';
import { get, helper, post } from '../services/helper';
import firebase from 'firebase';
import {
    UTILITIES_SERVICES_DETAIL_RESET_BY_KEY,
    UTILITIES_SERVICES_DETAIL_REQUEST,
    UTILITIES_SERVICES_DETAIL_SUCCESS,
    UTILITIES_SERVICES_DETAIL_FAILURE,
    UTILITIES_SERVICES_BOOKING_REQUEST,
    UTILITIES_SERVICES_BOOKING_SUCCESS,
    UTILITIES_SERVICES_BOOKING_FAILURE
} from './actionTypes';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        dispatch({ type: UTILITIES_SERVICES_DETAIL_REQUEST });
        const url = '/Residents/Service/Detail';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
              //  console.log(ret.data)
                dispatch({
                    type: UTILITIES_SERVICES_DETAIL_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
            }
            else {
                dispatch({ type: UTILITIES_SERVICES_DETAIL_FAILURE, payload: { data: ret.message } });
            }
        }
        else {
            dispatch({ type: UTILITIES_SERVICES_DETAIL_FAILURE, payload: { data: ret.message } });
        }
    } catch (error) {
        dispatch({ type: UTILITIES_SERVICES_DETAIL_FAILURE, payload: { data: ret.message } });
    }
};

export const createBookingHandle = (dataRequest) => async (dispatch) => {

    //console.log(dataRequest)
    dispatch({ type: UTILITIES_SERVICES_BOOKING_REQUEST });
    try {
        const token = await firebase.auth().currentUser.getIdToken();
        // const response = await axios.post(`${helper.URL_API}/Residents/ServiceExtension/Insert`,
        //     dataRequest,
        //     {
        //         headers: {
        //             Authorization: `bearer ${token}`
        //         }
        //     });
        //sửa
        const response = await post(`/Residents/ServiceExtension/Insert`, dataRequest);
        console.log('ServiceExtension', response)
        if (response) {
            if (response.status === 200) {
                dispatch({
                    type: UTILITIES_SERVICES_BOOKING_SUCCESS
                });
            } else {
                dispatch({
                    type: UTILITIES_SERVICES_BOOKING_FAILURE,
                    payload: {
                        data: response.message
                    }
                });
            }
        } else {
            dispatch({
                type: UTILITIES_SERVICES_BOOKING_FAILURE,
                payload: {
                    data: response.message
                }
            });
        }
    } catch (error) {
        console.log(error.response);
        dispatch({
            type: UTILITIES_SERVICES_BOOKING_FAILURE,
            payload: {
                data: 'Xảy ra lỗi không xác định'
            }
        });
    }
};

export const resetStateByKey = (payload) => ({
    type: UTILITIES_SERVICES_DETAIL_RESET_BY_KEY,
    payload
});
