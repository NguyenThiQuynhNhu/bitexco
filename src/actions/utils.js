import { get, helper, post } from '../services/helper';
import {

    CHECKLIST_FINISH_DATE_REQUEST,
    CHECKLIST_FINISH_DATE_SUCCESS,
    CHECKLIST_FINISH_DATE_FAILURE,

    UTILS_TU_NGAY,
    UTILS_DEN_NGAY,
    UTILS_NAME,
    UTILS_DATE,

} from './actionTypes';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest)
        
        dispatch({ type: CHECKLIST_GETLIST_REQUEST });

        var params = {
            name:dataRequest.username,
            pass:dataRequest.password
          }
        // const url = 'Api/GetHandOverLocal/'+dataRequest.username+'/'+dataRequest.password;
        const url = 'GetHandOverLocal';
        // const ret = await get(url, dataRequest);
        // console.log(params)
        const ret = await post(url,params);
        //console.log(ret)
        // return
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
               // console.log(ret.data)

                dispatch({
                    type: CHECKLIST_GETLIST_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
                return
                if(ret.data.ErrorId===6){
                    
                }
                else{
                    dispatch({ type: CHECKLIST_GETLIST_FAILURE, payload: { data: ret.data.ErrorName } });
                }
                
            }
            else {
                dispatch({ type: CHECKLIST_GETLIST_FAILURE, payload: { data: ret.message } });
            }
        }
        else {
            dispatch({ type: CHECKLIST_GETLIST_FAILURE, payload: { data: ret.message } });
        }
    } catch (error) {
        dispatch({ type: CHECKLIST_GETLIST_FAILURE, payload: { data: ret.message } });
    }
};

export const HandOverStatus = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest)
        
        dispatch({ type: CHECKLIST_STATUS_GETLIST_REQUEST });
        // return
        const url = 'HandOverStatus';
        const ret = await post(url,dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
              //  console.log(ret.data)

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

export const HandOverChangeStatus = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest)
        
        dispatch({ type: CHECKLIST_STATUS_CHANGE_REQUEST });
        // return
        const url = 'HandOverChangeStatus';
        const ret = await post(url,dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
              //  console.log(ret.data)

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
              //  console.log(ret.data)

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

export const onChangetuNgay = payload => ({
    type: UTILS_TU_NGAY,
    payload
});

export const onChangedenNgay = payload => ({
    type: UTILS_DEN_NGAY,
    payload
});

export const onChangeDateName = payload => ({
    type: UTILS_NAME,
    payload
});

export const loadDate = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest)
        
        var params = { }
        const url = '/HandOver/ListDate';
        const ret = await post(url);
        console.log('ListDate', ret)
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
              //  console.log(ret.data)

                dispatch({
                    type: UTILS_DATE,
                    payload: ret.data
                });
                
            }
        }
    } catch (error) {
        console.log(ret.message)
    }
};

