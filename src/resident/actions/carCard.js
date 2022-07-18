import axios from 'axios';
import { get, helper, post, post2 } from '../services/helper';

export const loadDataHandle = (dataRequest) => async (dispatch) => {

    try {
        //console.log(dataRequest);
        dispatch({ type: 'CARCARD_GETLIST_REQUEST' });
        const url = '/Car/GetList';
        const ret = await get(url, dataRequest);
        console.log(ret);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                await dispatch({
                    type: 'CARCARD_GETLIST_SUCCESS',
                    payload: {
                        data: ret.data.card
                    }
                })
            }
            else {
                dispatch({ type: 'CARCARD_GETLIST_FAILURE' });
            }
        }
        else {
            dispatch({ type: 'CARCARD_GETLIST_FAILURE' });
        }
    } catch (error) {
        dispatch({ type: 'CARCARD_GETLIST_FAILURE' });
    }
};
export const refreshDataHandle = () => ({
    type: 'CARCARD_GETLIST_REFRESHING'
});
export const resetStateByKey = ({ key, path, value }) => ({
    type: 'CARCARD_GETLIST_RESET_BY_KEY',
    payload: { key, path, value }
});

export const createCarCardHandle = (dataRequest) => async (dispatch) => {
    dispatch({ type: 'CARCARD_CREATE_REQUEST' });
    try {
        const response = await post(`/Car/Insert`, dataRequest);
        console.log(response);
        if (response) {
            if (response.status === 200) {
                dispatch({
                    type: 'CARCARD_CREATE_SUCCESS',
                    payload: {
                        data: response.data
                    }
                });
            } else {
                console.log(response.data.message);
                dispatch({
                    type: 'CARCARD_CREATE_FAILURE',
                    payload: {
                        data: 'Xảy ra lỗi không xác định'
                    }
                });
            }
        } else {
            dispatch({
                type: 'CARCARD_CREATE_FAILURE',
                payload: {
                    data: response.data.message || 'Xảy ra lỗi không xác định'
                }
            });
        }
    } catch (error) {
        console.log(error);
        dispatch({
            type: 'CARCARD_CREATE_FAILURE',
            payload: {
                data: 'Xảy ra lỗi không xác định'
            }
        });
    }
};
export const deleteCarCardHandle = (dataRequest) => async (dispatch) => {
    dispatch({ type: 'CARCARD_DELETE_REQUEST' });
    try {
        const response = await post2(`/Car/Delete?CardID=${dataRequest.CardID}`, dataRequest);
        console.log(response);
        if (response) {
            if (response.status === 200) {
                dispatch({
                    type: 'CARCARD_DELETE_SUCCESS',
                    payload: {
                        data: response.data
                    }
                });
            } else {
                console.log(response.data.message);
                dispatch({
                    type: 'CARCARD_DELETE_FAILURE',
                    payload: {
                        data: 'Xảy ra lỗi không xác định'
                    }
                });
            }
        } else {
            dispatch({
                type: 'CARCARD_DELETE_FAILURE',
                payload: {
                    data: response.data.message || 'Xảy ra lỗi không xác định'
                }
            });
        }
    } catch (error) {
        console.log(error);
        dispatch({
            type: 'CARCARD_DELETE_FAILURE',
            payload: {
                data: 'Xảy ra lỗi không xác định'
            }
        });
    }
};
export const requestStopCarCardHandle = (dataRequest) => async (dispatch) => {
    dispatch({ type: 'CARCARD_STOP_REQUEST' });
    try {
        const response = await post2(`/Car/RequestStop?CardID=${dataRequest.CardID}&departmentID=${dataRequest.departmentID}&IsStop=${dataRequest.IsStop}`, dataRequest);
        console.log(response);
        if (response) {
            if (response.status === 200) {
                dispatch({
                    type: 'CARCARD_STOP_SUCCESS',
                    payload: {
                        data: response.data
                    }
                });
            } else {
                console.log(response.data.message);
                dispatch({
                    type: 'CARCARD_STOP_FAILURE',
                    payload: {
                        data: 'Xảy ra lỗi không xác định'
                    }
                });
            }
        } else {
            dispatch({
                type: 'CARCARD_STOP_FAILURE',
                payload: {
                    data: response.data.message || 'Xảy ra lỗi không xác định'
                }
            });
        }
    } catch (error) {
        console.log(error);
        dispatch({
            type: 'CARCARD_STOP_FAILURE',
            payload: {
                data: 'Xảy ra lỗi không xác định'
            }
        });
    }
};