import { get, helper } from '../services/helper';
import axios from 'axios';
import {
    NEWS_GETLIST_RESET_BY_KEY,
    NEWS_GETLIST_REFRESHING,
    NEWS_GETLIST_REQUEST,
    NEWS_GETLIST_SUCCESS,
    NEWS_GETLIST_FAILURE,
    BADGE_NOTIFY_R_SUCCESS,
    R_NEWS_GETLIST_RESET_BY_KEY,
    R_NEWS_GETLIST_REFRESHING,
    R_NEWS_GETLIST_REQUEST,
    R_NEWS_GETLIST_SUCCESS,
    R_NEWS_GETLIST_FAILURE
} from './actionTypes';
import firebase from 'firebase';
import FCM from "react-native-fcm";
export const loadDataHandle = (dataRequest) => async (dispatch) => {

    try {

        dispatch({ type: R_NEWS_GETLIST_REQUEST });
        const url = `/Residents/NewsList`;
        const ret = await get(url, dataRequest);
        console.log('/Residents/NewsList', ret)
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                dispatch({ type: R_NEWS_GETLIST_SUCCESS, payload: { data: ret.data } });
            }
            else {
                dispatch({ type: R_NEWS_GETLIST_FAILURE });
            }
        }
        else {
            dispatch({ type: R_NEWS_GETLIST_FAILURE });
        }
    } catch (error) {
        dispatch({ type: R_NEWS_GETLIST_FAILURE });
    }
};
export const refreshDataHandle = () => ({
    type: R_NEWS_GETLIST_REFRESHING
});
export const resetStateByKey = ({ key, path, value }) => ({
    type: R_NEWS_GETLIST_RESET_BY_KEY,
    payload: { key, path, value }
});

export const onSubmitEditing = isApplySearchKey => ({
    type: 'R_NEWS_ON_SUBMIT_EDITING'
})
export const onChangeText = payload => ({
    type: 'R_NEWS_ON_CHANGE_TEXT',
    payload
})
export const onClearText = payload => ({
    type: 'R_NEWS_ON_CLEAR_TEXT',
    payload
})

export const updateItemList = payload => ({
    type: 'R_NEWS_LIST_UPDATE',
    payload
})
export const updateBadge = (dataRequest) => async (dispatch) => {
    const urlNotifyR = '/Residents/GetNewsTotalUnread';
    const retNotifyR = await get(urlNotifyR, { towerId: dataRequest, keyword: '', typeNews: 2 });
    console.log('updateBadge', retNotifyR)
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
            //const result1 = retNotifyR.data.filter(item => item.isRead == false);
            dispatch({ type: BADGE_NOTIFY_R_SUCCESS, payload: retNotifyR.data.totalUnread });
        }

    }
}
