import axios from 'axios';
import { get, helper, post } from '../services/helper';
import firebase from 'firebase';
import {
    UTILITIES_BASIC_ZONETIME_RESET_BY_KEY,
    UTILITIES_BASIC_ZONETIME_REQUEST,
    UTILITIES_BASIC_ZONETIME_SUCCESS,
    UTILITIES_BASIC_ZONETIME_FAILURE,

    UTILITIES_BASIC_BOOKING_REQUEST,
    UTILITIES_BASIC_BOOKING_SUCCESS,
    UTILITIES_BASIC_BOOKING_FAILURE,
    UTILITIES_BASIC_BOOKING_ON_VALUE_CHANGE
} from './actionTypes';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        dispatch({ type: UTILITIES_BASIC_ZONETIME_REQUEST });
        const url = '/Residents/ServiceBasic/ZoneTime/List';
        const ret = await get(url, dataRequest);
        console.log(ret)
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                dispatch({
                    type: UTILITIES_BASIC_ZONETIME_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
            }
            else {
                dispatch({ type: UTILITIES_BASIC_ZONETIME_FAILURE, payload: { data: ret.message } });
            }
        }
        else {
            dispatch({ type: UTILITIES_BASIC_ZONETIME_FAILURE, payload: { data: ret.message } });
        }
    } catch (error) {
        dispatch({ type: UTILITIES_BASIC_ZONETIME_FAILURE, payload: { data: ret.message } });
    }
};

export const reloadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        dispatch({ type: UTILITIES_BASIC_ZONETIME_REQUEST });
        const url = '/Residents/ServiceBasic/ZoneTime/List';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
              //  console.log(ret.data)
                dispatch({
                    type: UTILITIES_BASIC_ZONETIME_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
            }
            else {
                dispatch({ type: UTILITIES_BASIC_ZONETIME_FAILURE, payload: { data: ret.message } });
            }
        }
        else {
            dispatch({ type: UTILITIES_BASIC_ZONETIME_FAILURE, payload: { data: ret.message } });
        }
    } catch (error) {
        dispatch({ type: UTILITIES_BASIC_ZONETIME_FAILURE, payload: { data: ret.message } });
    }
};

export const createBookingHandle = (dataRequest) => async (dispatch) => {

    //console.log(JSON.stringify(dataRequest))
    dispatch({ type: UTILITIES_BASIC_BOOKING_REQUEST });
    try {
        const token = await firebase.auth().currentUser.getIdToken();
        // const response = await axios.post(`${helper.URL_API}/Residents/ServiceBasic/Insert`,
        //     dataRequest,
        //     {
        //         headers: {
        //             Authorization: `bearer ${token}`
        //         }
        //     });
        //sửa
        const response = await post(`/Residents/ServiceBasic/Insert`, dataRequest);
        console.log(response);
        if (response) {
            if (response.status === 200) {
                dispatch({
                    type: UTILITIES_BASIC_BOOKING_SUCCESS
                });
            } else {
                dispatch({
                    type: UTILITIES_BASIC_BOOKING_FAILURE,
                    payload: {
                        data: response.message
                    }
                });
            }
        } else {
            dispatch({
                type: UTILITIES_BASIC_BOOKING_FAILURE,
                payload: {
                    data: response.message
                }
            });
        }
    } catch (error) {
        console.log(error.response);
        dispatch({
            type: UTILITIES_BASIC_BOOKING_FAILURE,
            payload: {
                data: error.response.data.message
            }
        });
    }
};

export const resetStateByKey = (payload) => ({
    type: UTILITIES_BASIC_ZONETIME_RESET_BY_KEY,
    payload
});

export const onValueChange = (payload) => ({
    type: UTILITIES_BASIC_BOOKING_ON_VALUE_CHANGE,
    payload
});