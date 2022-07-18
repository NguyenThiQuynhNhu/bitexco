import { get } from '../services/helper';
import {
    SERVICES_EXTENSION_GETLIST_REFRESHING,
    SERVICES_EXTENSION_GETLIST_RESET_BY_KEY,
    SERVICES_EXTENSION_GETLIST_REQUEST,
    SERVICES_EXTENSION_GETLIST_SUCCESS,
    SERVICES_EXTENSION_GETLIST_FAILURE
} from './actionTypes';

export const getServicesExtensionStatusTotal = (dataRequest) => async (dispatch) => {
    try {
        const url = '/Vendors/ServiceExtension/GetTotalStatus';
        const ret = await get(url, dataRequest);
        //console.log('getServicesExtensionStatusTotal', ret)
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                dispatch({
                    type: 'SERVICE_EXTENSION_GET_TOTAL_STATUS_SUCCESS',
                    payload: {
                        data: ret.data
                    }
                });
            }
            else {
                console.log('Lỗi', ret)
            }
        }
        else {
            console.log('Lỗi', ret)
        }
    } catch (error) {
        console.log('Lỗi', error)
    }
}
export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest)
        dispatch({ type: SERVICES_EXTENSION_GETLIST_REQUEST });
        const url = '/Vendors/ServiceExtension/List';
        const ret = await get(url, dataRequest);
        console.log('ServiceExtension', ret)
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
               // console.log(ret.data)
                //const retStatusR = await get('/Vendors/ServiceExtension/GetTotalStatus', {towerId: dataRequest.towerId})
                
                //if(retStatusR !== undefined && retStatusR !== null){
                    //if (retStatusR.status == 200) {
                        await dispatch({
                            type: SERVICES_EXTENSION_GETLIST_SUCCESS,
                            payload: {
                                data: {data: ret.data}
                            }
                        });
                        const retStatusR = await get('/Vendors/ServiceExtension/GetTotalStatus', {towerId: dataRequest.towerId,  isMine: dataRequest.isMine})
                        if(retStatusR !== undefined && retStatusR !== null){
                            if (retStatusR.status == 200) {
                                dispatch({
                                    type: 'SERVICE_EXTENSION_GET_TOTAL_STATUS_SUCCESS',
                                    payload: {
                                        data: retStatusR.data
                                    }
                                });
                            }
                        }
                    //}else {
                        //dispatch({ type: SERVICES_EXTENSION_GETLIST_FAILURE, payload: { data: retStatusR.message } });
                    //}
                //}else {
                    //dispatch({ type: SERVICES_EXTENSION_GETLIST_FAILURE, payload: { data: retStatusR.message } });
                //}
            }
            else {
                dispatch({ type: SERVICES_EXTENSION_GETLIST_FAILURE, payload: { data: ret.message } });
            }
        }
        else {
            dispatch({ type: SERVICES_EXTENSION_GETLIST_FAILURE, payload: { data: ret.message } });
        }
    } catch (error) {
        dispatch({ type: SERVICES_EXTENSION_GETLIST_FAILURE, payload: { data: ret.message } });
    }
};

export const resetStateByKey = (payload) => ({
    type: SERVICES_EXTENSION_GETLIST_RESET_BY_KEY,
    payload
});
export const refreshDataHandle = () => ({
    type: SERVICES_EXTENSION_GETLIST_REFRESHING
});

