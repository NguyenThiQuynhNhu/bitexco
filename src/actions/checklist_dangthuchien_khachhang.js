import { get, helper, post } from '../services/helper';
import {
    // FEEDBACK_GETLIST_REFRESHING,
    // // FEEDBACK_GETLIST_RESET_BY_KEY,
    // // FEEDBACK_GETLIST_REQUEST,
    // FEEDBACK_GETLIST_SUCCESS,
    // FEEDBACK_GETLIST_FAILURE,
    // FEEDBACK_PROGRESS_REQUEST,
    // FEEDBACK_PROGRESS_SUCCESS,
    // FEEDBACK_PROGRESS_FAILURE,
    // CHECKLIST_RESET_BY_KEY,

    CHECKLIST_CUSTOMER_GETLIST_RESET_BY_KEY,
    CHECKLIST_CUSTOMER_GETLIST_REFRESHING,
    CHECKLIST_CUSTOMER_GETLIST_REQUEST,
    CHECKLIST_CUSTOMER_GETLIST_SUCCESS,
    CHECKLIST_CUSTOMER_GETLIST_FAILURE,

    CHECKLIST_CUSTOMER_GO_LIST_TAISAN

} from './actionTypes';
import moment from 'moment';
export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest)
        
        dispatch({ type: CHECKLIST_CUSTOMER_GETLIST_REQUEST });
        var params = {
            //name:dataRequest.username,
            //pass:dataRequest.password,
            employeeId: dataRequest.employeeId,
            StatusId:dataRequest.StatusId,
            StatusName:dataRequest.StatusName,
            tuNgay: dataRequest.tuNgay,
            denNgay: dataRequest.denNgay,
            buildingId: dataRequest.BuildingId
          }
          //console.log('params', params)
        const url = '/HandOverCustomer/GetList';
        const ret = await post(url,params);
        //console.log(ret)
        // return
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {

                dispatch({
                    type: CHECKLIST_CUSTOMER_GETLIST_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
                return
                if(ret.data.ErrorId===6){
                    
                }
                else{
                    dispatch({ type: CHECKLIST_CUSTOMER_GETLIST_FAILURE, payload: { data: ret.data.ErrorName } });
                }
                
            }
            // else if (ret.status == 400) {
            //     dispatch({
            //         type: CHECKLIST_CUSTOMER_GETLIST_SUCCESS,
            //         payload: {
            //             data: ret.data
            //         }
            //     });
            // }
            else {
                dispatch({ type: CHECKLIST_CUSTOMER_GETLIST_FAILURE, payload: { data: ret.message } });
            }
        }
        else {
            dispatch({ type: CHECKLIST_CUSTOMER_GETLIST_FAILURE, payload: { data: ret.message } });
        }
    } catch (error) {
        dispatch({ type: CHECKLIST_CUSTOMER_GETLIST_FAILURE, payload: { data: ret.message } });
    }
};

export const resetStateByKey = (payload) => ({
    type: CHECKLIST_CUSTOMER_GETLIST_RESET_BY_KEY,
    payload
});
export const refreshDataHandle = () => ({
    type: CHECKLIST_CUSTOMER_GETLIST_REFRESHING
});

export const goListTaiSan = payload => ({
    type: CHECKLIST_CUSTOMER_GO_LIST_TAISAN,
    payload
});

