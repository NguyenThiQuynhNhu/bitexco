import { get, helper, post } from '../services/helper';
import {
    CHECKLIST_HANDOVERMORE_GETLIST_RESET_BY_KEY,
    CHECKLIST_HANDOVERMORE_GETLIST_REFRESHING,
    CHECKLIST_HANDOVERMORE_GETLIST_REQUEST,
    CHECKLIST_HANDOVERMORE_GETLIST_SUCCESS,
    CHECKLIST_HANDOVERMORE_GETLIST_FAILURE,
    CHECKLIST_HANDOVERMORE_DATA,
    CHECKLIST_HANDOVERMORE_SAVE

} from './actionTypes';
import firebase from 'firebase';
import axios from 'axios';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        dispatch({ type: CHECKLIST_HANDOVERMORE_GETLIST_REQUEST });
        //console.log(dataRequest)
        const url = '/HandOverLocal/GetList';
        const ret = await post(url,{
            "tuNgay": dataRequest.tuNgay,
            "denNgay": dataRequest.denNgay,
            "statusId": dataRequest.statusId,
            "employeeId": dataRequest.employeeId,
            "buildingId": dataRequest.buildingId
          });
        //console.log(ret)
        // return
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                // console.log(ret.data)
                dispatch({
                    type: CHECKLIST_HANDOVERMORE_GETLIST_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
            }
            else {
                dispatch({ type: CHECKLIST_HANDOVERMORE_GETLIST_FAILURE, payload: { data: ret.message } });
            }
        }
        else {
            dispatch({ type: CHECKLIST_HANDOVERMORE_GETLIST_FAILURE, payload: { data: ret.message } });
        }
    } catch (error) {
        dispatch({ type: CHECKLIST_HANDOVERMORE_GETLIST_FAILURE, payload: { data: ret.message } });
    }
};

export const HandOverPlanData = (dataRequest) => async (dispatch) => {
    try {
        dispatch({ type: CHECKLIST_HANDOVERMORE_DATA });
        //console.log(dataRequest)
        const url = '/HandOver/PlanData';
        const ret = await post(url,dataRequest);
        //console.log(ret)
        // return
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                // console.log(ret.data)
                let data ={
                    status: ret.status,
                    dataDetail: ret.data
                }
                return data
                dispatch({
                    type: CHECKLIST_HANDOVERMORE_GETLIST_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
            }
            else {
                let data ={
                    status: 404
                }
                return data
                dispatch({ type: CHECKLIST_HANDOVERMORE_GETLIST_FAILURE, payload: { data: ret.message } });
            }
        }
        else {
            let data ={
                status: 404
            }
            return data
            dispatch({ type: CHECKLIST_HANDOVERMORE_GETLIST_FAILURE, payload: { data: ret.message } });
        }
    } catch (error) {
        let data ={
            status: 404
        }
        return data
        dispatch({ type: CHECKLIST_HANDOVERMORE_GETLIST_FAILURE, payload: { data: ret.message } });
    }
};

export const HandOverPlanAdd = (dataRequest) => async (dispatch) => {
    try {
        dispatch({ type: CHECKLIST_HANDOVERMORE_SAVE });
        //console.log(dataRequest)
        const url = '/HandOverLocal/PlanAdd';
        const ret = await post(url,dataRequest);
        //console.log(ret)
        // return
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                return ret.data
            }
            else {
                return ret.message
            }
        }
        else {
            return ret.message
        }
    } catch (error) {
        return error
    }
};

export const resetStateByKey = (payload) => ({
    type: CHECKLIST_HANDOVERMORE_GETLIST_RESET_BY_KEY,
    payload
});

export const refreshDataHandle = () => ({
    type: CHECKLIST_HANDOVERMORE_GETLIST_REFRESHING
});

