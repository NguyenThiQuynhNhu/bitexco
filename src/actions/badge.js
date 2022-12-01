import axios from 'axios';
import { get, helper } from '../services/helper';
import {
    BADGE_NOTIFY_R_REQUEST,
    BADGE_NOTIFY_R_SUCCESS,
    BADGE_NOTIFY_R_FAILURE,
    BADGE_REQUEST_R_SUCCESS,
    BADGE_PAYMENT_R_SUCCESS,
    REQUEST_GET_TOTAL_STATUS_SUCCESS
    // CHECKLIST_GETLIST_REFRESHING,
    // CHECKLIST_GETLIST_RESET_BY_KEY,
    // CHECKLIST_GET_TOTAL_STATUS_REQUEST,
    // CHECKLIST_GET_TOTAL_STATUS_SUCCESS,
    // CHECKLIST_GET_TOTAL_STATUS_FAILURE
} from './actionTypes';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import FCM from "react-native-fcm";

export const loadBadge = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest);
        //dispatch({ type: R_NOTIFICATION_GETLIST_REQUEST });
        dataRequestNotifyR = {
            towerId: dataRequest.towerId,
            keyword: '',
            //currentPage: 1,
            //rowPerPage: 20,
            typeNews: 2,
        }
        dataRequestRequestR = {
            towerId: dataRequest.towerId,
            keyword: '',
            langId: dataRequest.langId,
            //currentPage: 1,
            //rowPerPage: 20,
            statusId: 0,
        }
        dataRequestPaymentR = {
            //currentPage: 1,
            //rowPerPage: 20,
            langId: dataRequest.langId,
            departmentId:  dataRequest.departmentId
        }
        //const urlNotifyR = '/Residents/NewsList';
        const urlNotifyR = `/Residents/GetNewsTotalUnread`;
        const retNotifyR = await get(urlNotifyR, dataRequestNotifyR);
        const urlRequestR = `/Residents/GetTotalStatus`;
        const retRequestR = await get(urlRequestR, dataRequestRequestR);
        //console.log('retRequestR', retRequestR)
        const urlPaymentR = `/Fee/GetTotalUnPaid`;
        const retPaymentR = await get(urlPaymentR, dataRequestPaymentR);
        if (retNotifyR !== undefined && retNotifyR !== null) {
            if (retNotifyR.status == 200) {
                FCM.setBadgeNumber(retNotifyR.data.totalUnread);
                // FCM.presentLocalNotification({
                //     lights: true,
                //     priority: "high",
                //     //status: 'notif.status',
                //     channel: 'car_status',
                //     number: retNotifyR.data.totalUnread,
                // });
                dispatch({ type: BADGE_NOTIFY_R_SUCCESS, payload: retNotifyR.data.totalUnread });
            }
            
        }
        if (retRequestR !== undefined && retRequestR !== null) {
            if (retRequestR.status == 200) {
                const retStatusR = await get(`/Vendors/RequestStatusTotal`, {towerId: dataRequest.towerId, langId: dataRequest.langId,})
                if(retStatusR !== undefined && retStatusR !== null){
                    await retStatusR.data.forEach(item1 => {
                        item1.total2 = 0;
                        item1.currentValue = 0;
                        retRequestR.data.forEach(item2 => {
                            if(item1.id == item2.statusId){
                                 item1.total2 = item2.total
                            }
                        });
                    });
                }
                await dispatch({
                    type: REQUEST_GET_TOTAL_STATUS_SUCCESS,
                    payload: {
                        data: retStatusR.data
                    }
                });
                const result2 = retRequestR.data.filter(item => item.statusKey == 'moi');
                // dispatch({ type: BADGE_REQUEST_R_SUCCESS, payload: result2.length });
                if(result2.length > 0){
                    dispatch({ type: BADGE_REQUEST_R_SUCCESS, payload: result2[0].total });
                }else{
                    dispatch({ type: BADGE_REQUEST_R_SUCCESS, payload: 0 });
                }
            }
            
        }
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
    } catch (error) {
        console.log(error);
    }
};