import { get } from '../services/helper';
import {
    SERVICES_BASIC_GETLIST_REFRESHING,
    SERVICES_BASIC_GETLIST_RESET_BY_KEY,
    SERVICES_BASIC_GETLIST_REQUEST,
    SERVICES_BASIC_GETLIST_SUCCESS,
    SERVICES_BASIC_GETLIST_FAILURE
} from './actionTypes';
export const getServicesBasicStatusTotal = (dataRequest) => async (dispatch) => {
    try {
        const url = '/Vendors/ServiceBasic/GetTotalStatus';
        const ret = await get(url, dataRequest);
        //console.log('getServicesBasicStatusTotal', ret)
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                dispatch({
                    type: 'SERVICE_BASIC_GET_TOTAL_STATUS_SUCCESS',
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
        dispatch({ type: SERVICES_BASIC_GETLIST_REQUEST });
        const url = '/Vendors/ServiceBasic/List';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                //const retStatusR = await get('/Vendors/ServiceBasic/GetTotalStatus', {towerId: dataRequest.towerId})
                //if(retStatusR !== undefined && retStatusR !== null){
                //if (retStatusR.status == 200) {
                //console.log(ret)
                dispatch({
                    type: SERVICES_BASIC_GETLIST_SUCCESS,
                    payload: {
                        data: { data: ret.data }
                    }
                });
                //}else {
                //dispatch({ type: SERVICES_BASIC_GETLIST_FAILURE, payload: { data: retStatusR.message } });
                //}
                //}else {
                //dispatch({ type: SERVICES_BASIC_GETLIST_FAILURE, payload: { data: retStatusR.message } });
                //}
                const retStatusR = await get('/Vendors/ServiceBasic/GetTotalStatus', { towerId: dataRequest.towerId, isMine: dataRequest.isMine })
                //console.log('getServicesBasicStatusTotal2', retStatusR)
                if (retStatusR !== undefined && retStatusR !== null) {
                    if (retStatusR.status == 200) {
                        dispatch({
                            type: 'SERVICE_BASIC_GET_TOTAL_STATUS_SUCCESS',
                            payload: {
                                data: retStatusR.data
                            }
                        });
                    }
                }

            }
            else {
                dispatch({ type: SERVICES_BASIC_GETLIST_FAILURE, payload: { data: ret.message } });
            }
        }
        else {
            dispatch({ type: SERVICES_BASIC_GETLIST_FAILURE, payload: { data: ret.message } });
        }
    } catch (error) {
        dispatch({ type: SERVICES_BASIC_GETLIST_FAILURE, payload: { data: ret.message } });
    }
};

export const resetStateByKey = (payload) => ({
    type: SERVICES_BASIC_GETLIST_RESET_BY_KEY,
    payload
});
export const refreshDataHandle = () => ({
    type: SERVICES_BASIC_GETLIST_REFRESHING
});

