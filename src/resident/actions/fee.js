import axios from 'axios';
import { get, helper } from '../services/helper';
import {
    FEE_GETLIST_REQUEST,
    FEE_GETLIST_FAILURE,
    FEE_GETLIST_SUCCESS,
    FEE_GETLIST_RESET_BY_KEY,
    FEE_GETLIST_REFRESHING,
    BADGE_PAYMENT_R_SUCCESS
} from './actionTypes';
import firebase from 'firebase';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest);
        dispatch({ type: FEE_GETLIST_REQUEST });
        const url = '/Fee/Department';
        const ret = await get(url, dataRequest);
        console.log(ret);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                const ar = [];
                ret.data.forEach(element => {
                    ar.push({value: element.amountIncurred, label: element.time})
                });
                dispatch({ type: FEE_GETLIST_SUCCESS, payload: { data: ret.data, dataPieSet: ar } });

                const urlPaymentR = '/Fee/GetTotalUnPaid';
                const retPaymentR = await get(urlPaymentR, {
                    langId: dataRequest.langId,
                    departmentId:  dataRequest.departmentId
                });
                if (retPaymentR !== undefined && retPaymentR !== null) {
                    if (retPaymentR.status == 200) {
                        if(retPaymentR.data.totalUnpaid){
                            dispatch({ type: BADGE_PAYMENT_R_SUCCESS, payload: retPaymentR.data.totalUnpaid });
                        }else{
                            dispatch({ type: BADGE_PAYMENT_R_SUCCESS, payload: 0 });
                        }
                        // const result3 = retPaymentR.data.filter(item => item.isPaid == false);
                        // dispatch({ type: BADGE_PAYMENT_R_SUCCESS, payload: result3.length });
                    }
                    
                }
            }
            else {
                dispatch({ type: FEE_GETLIST_FAILURE, payload: { data: ret.message } });
            }
        }
        else {
            dispatch({ type: FEE_GETLIST_FAILURE });
        }
    } catch (error) {
        dispatch({ type: FEE_GETLIST_FAILURE });
    }
    //console.log(ret.data);

};
export const refreshDataHandle = () => ({
    type: FEE_GETLIST_REFRESHING
});
export const resetStateByKey = ({ key, path, value }) => ({
    type: FEE_GETLIST_RESET_BY_KEY,
    payload: { key, path, value }
});