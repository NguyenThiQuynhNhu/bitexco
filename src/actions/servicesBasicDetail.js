import axios from 'axios';
import {
    get,
    helper,
    post
} from '../services/helper';
import firebase from 'firebase';
import {
    SERVICES_BASIC_DETAIL_RESET_BY_KEY,
    SERVICES_BASIC_DETAIL_REFRESHING,
    SERVICES_BASIC_DETAIL_REQUEST,
    SERVICES_BASIC_DETAIL_SUCCESS,
    SERVICES_BASIC_DETAIL_FAILURE,
    SERVICES_BASIC_DETAIL_UPDATE_REQUEST,
    SERVICES_BASIC_DETAIL_UPDATE_SUCCESS,
    SERVICES_BASIC_DETAIL_UPDATE_FAILURE
} from './actionTypes';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest)
        dispatch({
            type: SERVICES_BASIC_DETAIL_REQUEST
        });
        const url = '/Vendors/ServiceBasic/Detail';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
               // console.log(ret.data)
                dispatch({
                    type: SERVICES_BASIC_DETAIL_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
            } else {
                dispatch({
                    type: SERVICES_BASIC_DETAIL_FAILURE,
                    payload: {
                        data: ret.message
                    }
                });
            }
        } else {
            dispatch({
                type: SERVICES_BASIC_DETAIL_FAILURE,
                payload: {
                    data: ret.message
                }
            });
        }
    } catch (error) {
        dispatch({
            type: SERVICES_BASIC_DETAIL_FAILURE,
            payload: {
                data: ret.message
            }
        });
    }
};

export const updateRequestHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest)
        dispatch({
            type: SERVICES_BASIC_DETAIL_UPDATE_REQUEST
        });
        const token = await firebase.auth().currentUser.getIdToken();
        const url = `/Vendors/ServiceBasic/Update`;

        // const response = await axios.post(url, dataRequest, {
        //     headers: {
        //         Authorization: `bearer ${token}`
        //     }
        // });
        const response = await post(url, dataRequest);
        console.log(response)
        if (response.status === 200) {
            dispatch({
                type: SERVICES_BASIC_DETAIL_UPDATE_SUCCESS
            });
        } else {
            dispatch({
                type: SERVICES_BASIC_DETAIL_UPDATE_FAILURE,
                payload: {
                    data: ret.message
                }
            });
        }
    } catch (error) {
        console.log(error);
        dispatch({
            type: SERVICES_BASIC_DETAIL_UPDATE_FAILURE,
            payload: {
                data: 'Xảy ra lỗi không xác định',
            }
        });
    }
};

export const resetStateByKey = (payload) => ({
    type: SERVICES_BASIC_DETAIL_RESET_BY_KEY,
    payload
});

export const refreshDataHandle = () => ({
    type: SERVICES_BASIC_DETAIL_REFRESHING
});