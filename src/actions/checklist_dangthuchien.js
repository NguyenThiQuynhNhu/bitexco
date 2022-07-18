import { get, helper, post } from '../services/helper';
import {

    CHECKLIST_GETLIST_RESET_BY_KEY1,
    CHECKLIST_GETLIST_REFRESHING1,
    CHECKLIST_GETLIST_REQUEST1,
    CHECKLIST_GETLIST_SUCCESS1,
    CHECKLIST_GETLIST_FAILURE1,
    CHECKLIST_GO_LIST_TAISAN,

    CHECKLIST_STATUS_GETLIST_REQUEST,
    CHECKLIST_STATUS_GETLIST_SUCCESS,
    CHECKLIST_STATUS_GETLIST_FAILURE,

    CHECKLIST_STATUS_CHANGE_REQUEST,
    CHECKLIST_STATUS_CHANGE_SUCCESS,
    CHECKLIST_STATUS_CHANGE_FAILURE,

    CHECKLIST_FINISH_DATE_REQUEST,
    CHECKLIST_FINISH_DATE_SUCCESS,
    CHECKLIST_FINISH_DATE_FAILURE,

    CHECKLIST_STATUS_NAME_GETLIST_REQUEST,
    CHECKLIST_STATUS_NAME_GETLIST_SUCCESS,
    CHECKLIST_STATUS_NAME_GETLIST_FAILURE,

} from './actionTypes';
import moment from 'moment';
export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        // console.log(new Date.UTC())
        //console.log(dataRequest)
        dispatch({ type: CHECKLIST_GETLIST_REQUEST1 });

        var params = {
            employeeId: dataRequest.employeeId,
            statusId:dataRequest.StatusId,
            statusName:dataRequest.StatusName,
            // tuNgay: moment(new Date(dataRequest.tuNgay)).format('DD/MM/YYYY'),
            // denNgay: moment(new Date(dataRequest.denNgay)).format('DD/MM/YYYY'),
            tuNgay: dataRequest.tuNgay,
            denNgay: dataRequest.denNgay,
            buildingId:dataRequest.BuildingId
          }
        // const url = 'Api/GetHandOverLocal/'+dataRequest.username+'/'+dataRequest.password;
        const url = '/HandOverLocal/GetList';
        // const ret = await get(url, dataRequest);
        //console.log(JSON.stringify(params))
        const ret = await post(url,params);
        //console.log(ret)
        // return
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                //console.log(ret.data)

                dispatch({
                    type: CHECKLIST_GETLIST_SUCCESS1,
                    payload: {
                        data: ret.data
                    }
                });
                return
                if(ret.data.ErrorId===6){
                    
                }
                else{
                    dispatch({ type: CHECKLIST_GETLIST_FAILURE1, payload: { data: ret.data.ErrorName } });
                }
                
            }
            else {
                dispatch({ type: CHECKLIST_GETLIST_FAILURE1, payload: { data: ret.message } });
            }
        }
        else {
            dispatch({ type: CHECKLIST_GETLIST_FAILURE1, payload: { data: ret.message } });
        }
    } catch (error) {
        dispatch({ type: CHECKLIST_GETLIST_FAILURE1, payload: { data: ret.message } });
    }
};

export const HandOverStatus = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest)
        
        dispatch({ type: CHECKLIST_STATUS_GETLIST_REQUEST });
        // return
        const url = '/HandOver/HandOverStatus';
        const ret = await post(url,dataRequest);
        //console.log(ret)
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                //console.log(ret.data)

                dispatch({
                    type: CHECKLIST_STATUS_GETLIST_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });

                return ret.data
                
            }
            else {
                dispatch({ type: CHECKLIST_STATUS_GETLIST_FAILURE, payload: { data: ret.message } });
                return []
            }
        }
        else {
            dispatch({ type: CHECKLIST_STATUS_GETLIST_FAILURE, payload: { data: ret.message } });
            return []
        }
    } catch (error) {
        dispatch({ type: CHECKLIST_STATUS_GETLIST_FAILURE, payload: { data: ret.message } });
        return []
    }
};

export const CheckListStatusName = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest)
        
        dispatch({ type: CHECKLIST_STATUS_NAME_GETLIST_REQUEST });
        //console.log('CheckListStatusName')
        // return
        const url = '/HandOver/CheckListStatusName';
        const ret = await post(url,dataRequest);
        
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                //console.log(ret.data)

                dispatch({
                    type: CHECKLIST_STATUS_NAME_GETLIST_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });

                //return ret.data
                return ret.data
            }
            else {
                dispatch({ type: CHECKLIST_STATUS_NAME_GETLIST_FAILURE, payload: { data: ret.message } });
                return []
            }
        }
        else {
            dispatch({ type: CHECKLIST_STATUS_NAME_GETLIST_FAILURE, payload: { data: ret.message } });
            return []
        }
    } catch (error) {
        dispatch({ type: CHECKLIST_STATUS_NAME_GETLIST_FAILURE, payload: { data: ret.message } });
        return []
    }
};

export const HandOverChangeStatus = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest)
        
        dispatch({ type: CHECKLIST_STATUS_CHANGE_REQUEST });
        // return
        const url = '/HandOver/HandOverChangeStatus';
        const ret = await post(url,dataRequest);
        //console.log(ret)
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                //console.log(ret.data)

                dispatch({
                    type: CHECKLIST_STATUS_CHANGE_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });

                return ret.data
                
            }
            else {
                dispatch({ type: CHECKLIST_STATUS_CHANGE_FAILURE, payload: { data: ret.message } });
                return {
                    status:2,
                    message: ret.message
                }
            }
        }
        else {
            dispatch({ type: CHECKLIST_STATUS_CHANGE_FAILURE, payload: { data: ret.message } });
            return {
                status:2,
                message: ret.message
            }
        }
    } catch (error) {
        dispatch({ type: CHECKLIST_STATUS_CHANGE_FAILURE, payload: { data: ret.message } });
        return {
            status:2,
            message: ret.message
        }
    }
};

export const HandOverFinishDate = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest)
        
        dispatch({ type: CHECKLIST_FINISH_DATE_REQUEST });
        // return
        const url = 'HandOverFinishDate';
        const ret = await post(url,dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                //console.log(ret.data)

                dispatch({
                    type: CHECKLIST_FINISH_DATE_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });

                return ret.data
                
            }
            else {
                dispatch({ type: CHECKLIST_FINISH_DATE_FAILURE, payload: { data: ret.message } });
                return {
                    status:2,
                    message: ret.message
                }
            }
        }
        else {
            dispatch({ type: CHECKLIST_FINISH_DATE_FAILURE, payload: { data: ret.message } });
            return {
                status:2,
                message: ret.message
            }
        }
    } catch (error) {
        dispatch({ type: CHECKLIST_FINISH_DATE_FAILURE, payload: { data: ret.message } });
        return {
            status:2,
            message: ret.message
        }
    }
};


export const resetStateByKey = (payload) => ({
    type: CHECKLIST_GETLIST_RESET_BY_KEY1,
    payload
});

export const refreshDataHandle = () => ({
    type: CHECKLIST_GETLIST_REFRESHING1
});

export const goListTaiSan = payload => ({
    type: CHECKLIST_GO_LIST_TAISAN,
    payload
});

