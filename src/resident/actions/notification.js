import { get, helper, post } from '../services/helper';
import {
    R_NOTIFICATION_GETLIST_RESET_BY_KEY,
    R_NOTIFICATION_GETLIST_REFRESHING,
    R_NOTIFICATION_GETLIST_REQUEST,
    R_NOTIFICATION_GETLIST_SUCCESS,
    R_NOTIFICATION_GETLIST_FAILURE,
    BADGE_NOTIFY_R_SUCCESS
} from './actionTypes';
import firebase from 'firebase';
import axios from 'axios';
import FCM from "react-native-fcm";
export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log('loadDataHandle');
        //console.log(dataRequest);
        dispatch({ type: R_NOTIFICATION_GETLIST_REQUEST });
        const url = '/Notification/Resident';
        const ret = await get(url, dataRequest);
        //console.log(ret);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                dispatch({ type: R_NOTIFICATION_GETLIST_SUCCESS, payload: { data: ret.data } });
                const urlNotifyR = '/Residents/GetNewsTotalUnread';
                const retNotifyR = await get(urlNotifyR, {towerId: dataRequest.towerId, keyword: '', typeNews: 2});
                if (retNotifyR !== undefined && retNotifyR !== null) {
                    if (retNotifyR.status == 200) {
                        //const result1 = retNotifyR.data.filter(item => item.isRead == false);
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
                
            }
            else {
                dispatch({ type: R_NOTIFICATION_GETLIST_FAILURE });
            }
        }
        else {
            dispatch({ type: R_NOTIFICATION_GETLIST_FAILURE });
        }
    } catch (error) {
        dispatch({ type: R_NOTIFICATION_GETLIST_FAILURE });
    }
};
export const refreshDataHandle = () => ({
    type: R_NOTIFICATION_GETLIST_REFRESHING
});
export const resetStateByKey = ({ key, path, value }) => ({
    type: R_NOTIFICATION_GETLIST_RESET_BY_KEY,
    payload: { key, path, value }
});

export const onSubmitEditing = isApplySearchKey => ({
    type: 'R_NOTIFICATION_ON_SUBMIT_EDITING'
})
export const onChangeText = payload => ({
    type: 'R_NOTIFICATION_ON_CHANGE_TEXT',
    payload
})
export const onClearText = payload => ({
    type: 'R_NOTIFICATION_ON_CLEAR_TEXT'
    //payload
})

export const AddItemToList = payload => ({
    type: 'R_NOTIFICATION_ADD_ITEM_TO_LIST',
    payload
})

export const updateItemList = payload =>({
    type:'R_NEWS_LIST_UPDATE',
    payload
})

export const updateItemListNotify = (dataRequest) => async (dispatch) => {
    
    if (!dataRequest.isRead) {
        dispatch({
            type: 'R_NOTIFICATION_UPDATE_ITEM_ISREAD',
            payload: {
                data: dataRequest
            }
        });
    }

    try {
        const token = await firebase.auth().currentUser.getIdToken();
        const url = `/Notification/UpdateListNotifyIsRead`;
        const params = {
            id: dataRequest.id
        }
        // const response = await axios.post(url,
        //     params,
        //     {
        //         headers: {
        //             Authorization: `bearer ${token}`
        //         }
        //     });
        const response = await post(url, params);
        //console.log(response)
    } catch (error) {
        console.log(error)
    }
};