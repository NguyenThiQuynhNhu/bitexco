import axios from 'axios';
import {
    get,
    helper,
    post
} from '../services/helper';
import firebase from 'firebase';
import {
    SERVICES_EXTENSION_DETAIL_RESET_BY_KEY,
    SERVICES_EXTENSION_DETAIL_REFRESHING,
    SERVICES_EXTENSION_DETAIL_REQUEST,
    SERVICES_EXTENSION_DETAIL_SUCCESS,
    SERVICES_EXTENSION_DETAIL_FAILURE,
    SERVICES_EXTENSION_DETAIL_UPDATE_REQUEST,
    SERVICES_EXTENSION_DETAIL_UPDATE_SUCCESS,
    SERVICES_EXTENSION_DETAIL_UPDATE_FAILURE
} from './actionTypes';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest)
        dispatch({
            type: SERVICES_EXTENSION_DETAIL_REQUEST
        });
        const url = '/Vendors/ServiceExtension/Detail2';
        const ret = await get(url, dataRequest);
        console.log(ret)
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
              //console.log(ret)
                dispatch({
                    type: SERVICES_EXTENSION_DETAIL_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
            } else {
                dispatch({
                    type: SERVICES_EXTENSION_DETAIL_FAILURE,
                    payload: {
                        data: ret.message
                    }
                });
            }
        } else {
            dispatch({
                type: SERVICES_EXTENSION_DETAIL_FAILURE,
                payload: {
                    data: ret.message
                }
            });
        }
    } catch (error) {
        dispatch({
            type: SERVICES_EXTENSION_DETAIL_FAILURE,
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
            type: SERVICES_EXTENSION_DETAIL_UPDATE_REQUEST
        });
        const token = await firebase.auth().currentUser.getIdToken();
        const url = `/Vendors/ServiceExtension/Update`;

        // const response = await axios.post(url, dataRequest, {
        //     headers: {
        //         Authorization: `bearer ${token}`
        //     }
        // });
        //sửa
        const response = await post(url, dataRequest);
        console.log(response)
        if (response.status === 200) {
            dispatch({
                type: SERVICES_EXTENSION_DETAIL_UPDATE_SUCCESS
            });
        } else {
            dispatch({
                type: SERVICES_EXTENSION_DETAIL_UPDATE_FAILURE,
                payload: {
                    data: ret.message
                }
            });
        }
    } catch (error) {
        console.log(error);
        dispatch({
            type: SERVICES_EXTENSION_DETAIL_UPDATE_FAILURE,
            payload: {
                data: 'Xảy ra lỗi không xác định',
            }
        });
    }
};

export const resetStateByKey = (payload) => ({
    type: SERVICES_EXTENSION_DETAIL_RESET_BY_KEY,
    payload
});

export const refreshDataHandle = () => ({
    type: SERVICES_EXTENSION_DETAIL_REFRESHING
});