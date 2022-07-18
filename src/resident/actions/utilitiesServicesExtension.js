import axios from 'axios';
import { get, post } from '../services/helper';
import {
    UTILITIES_SERVICES_EXTENSION_GETLIST_REFRESHING,
    UTILITIES_SERVICES_EXTENSION_GETLIST_RESET_BY_KEY,
    UTILITIES_SERVICES_EXTENSION_GETLIST_REQUEST,
    UTILITIES_SERVICES_EXTENSION_GETLIST_SUCCESS,
    UTILITIES_SERVICES_EXTENSION_GETLIST_FAILURE
} from './actionTypes';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    const dataStatus = [
        {
            "statusId": 1,
            "statusName": "Mới",
            "statusKey": null,
            "currentValue": 0
        },
        {
            "statusId": 2,
            "statusName": "Đang xử lý",
            "statusKey": null,
            "currentValue": 0
        },
        {
            "statusId": 3,
            "statusName": "Hoàn thành",
            "statusKey": null,
            "currentValue": 0
        },
        {
            "statusId": 5,
            "statusName": "Đã đóng",
            "statusKey": null,
            "currentValue": 0
        }
    ]
    try {
        //console.log(dataRequest)
        dispatch({ type: UTILITIES_SERVICES_EXTENSION_GETLIST_REQUEST });
        const url = '/Residents/ServiceExtension/List';
        const ret = await get(url, dataRequest);
        console.log('/Residents/ServiceExtension/List', ret)
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                const retStatusR = await get('/Residents/ServiceExtension/GetTotalStatus', {towerId: dataRequest.towerId, serviceId: dataRequest.serviceId})
                //console.log(retStatusR)
                if(retStatusR !== undefined && retStatusR !== null){
                    if (retStatusR.status == 200) {
                        await dataStatus.forEach(item1 => {
                            item1.total = 0;
                            retStatusR.data.forEach(item2 => {
                                if(item1.statusId == item2.statusId){
                                     item1.total = item2.total
                                }
                            });
                        });
                        await dispatch({
                            type: UTILITIES_SERVICES_EXTENSION_GETLIST_SUCCESS,
                            payload: {
                                data: {data: ret.data, dataStatus: dataStatus}
                            }
                        });
                    }else {
                        dispatch({ type: UTILITIES_SERVICES_EXTENSION_GETLIST_FAILURE, payload: { data: retStatusR.message } });
                    }
                }else {
                    dispatch({ type: UTILITIES_SERVICES_EXTENSION_GETLIST_FAILURE, payload: { data: retStatusR.message } });
                }
            }
            else {
                dispatch({ type: UTILITIES_SERVICES_EXTENSION_GETLIST_FAILURE, payload: { data: ret.message } });
            }
        }
        else {
            dispatch({ type: UTILITIES_SERVICES_EXTENSION_GETLIST_FAILURE, payload: { data: ret.message } });
        }
    } catch (error) {
        dispatch({ type: UTILITIES_SERVICES_EXTENSION_GETLIST_FAILURE, payload: { data: ret.message } });
    }
};

export const resetStateByKey = (payload) => ({
    type: UTILITIES_SERVICES_EXTENSION_GETLIST_RESET_BY_KEY,
    payload
});
export const refreshDataHandle = () => ({
    type: UTILITIES_SERVICES_EXTENSION_GETLIST_REFRESHING
});
export const refreshDataHandle2 = () => ({
    type: 'UTILITIES_SERVICES_EXTENSION_GETLIST_REFRESHING2'
});
export const deleteServiceExdHandle = (dataRequest) => async (dispatch) => {
    dispatch({ type: 'SERVICEEXTENSION_DELETE_REQUEST' });
    try {
        const response = await post(`/Vendors/ServiceExtension/CancelStatus`, dataRequest);
        console.log(response);
        if (response) {
            if (response.status === 200) {
                dispatch({
                    type: 'SERVICEEXTENSION_DELETE_SUCCESS',
                    payload: {
                        data: response.data
                    }
                });
            } else {
                dispatch({
                    type: 'SERVICEEXTENSION_DELETE_FAILURE',
                    payload: {
                        data: 'Xảy ra lỗi không xác định'
                    }
                });
            }
        } else {
            dispatch({
                type: 'SERVICEEXTENSION_DELETE_FAILURE',
                payload: {
                    data: response.data.message || 'Xảy ra lỗi không xác định'
                }
            });
        }
    } catch (error) {
        console.log(error);
        dispatch({
            type: 'SERVICEEXTENSION_DELETE_FAILURE',
            payload: {
                data: 'Xảy ra lỗi không xác định'
            }
        });
    }
};
