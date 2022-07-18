import { get, post } from '../services/helper';
import {
    NOTIFICATION_GETLIST_REQUEST,
    NOTIFICATION_GETLIST_SUCCESS,
    NOTIFICATION_GETLIST_FAILURE,
    NOTIFICATION_GETLIST_REFRESHING,
    NOTIFICATION_GETLIST_RESET_BY_KEY,
    NOTIFICATION_UPDATE_ITEM_ISREAD,
    BADGE_NOTIFY_R_SUCCESS
} from './actionTypes';
import FCM from 'react-native-fcm';
export const loadDataHandle = (dataRequest) => async (dispatch) => {

    try {
        //console.log(dataRequest);
        dispatch({ type: NOTIFICATION_GETLIST_REQUEST });
        const url = '/Vendors/Notification/List';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                dispatch({
                    type: NOTIFICATION_GETLIST_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
                const urlNotify = '/Vendors/Notification/CountUnRead';
                const retNotify = await get(urlNotify, {typeId: 0, isRead: 0});
                //console.log(retNotify);
                if (retNotify !== undefined && retNotify !== null) {
                    if (retNotify.status == 200) {
                        FCM.setBadgeNumber(retNotify.data.count_notify);
                        //const result1 = retNotifyR.data.filter(item => item.isRead == false);
                        dispatch({ type: BADGE_NOTIFY_R_SUCCESS, payload: retNotify.data.count_notify });
                    }
                    
                }
            }
            else {
                dispatch({ type: NOTIFICATION_GETLIST_FAILURE });
            }
        }
        else {
            dispatch({ type: NOTIFICATION_GETLIST_FAILURE });
        }
    } catch (error) {
        dispatch({ type: NOTIFICATION_GETLIST_FAILURE });
    }
};

export const refreshDataHandle = () => ({
    type: NOTIFICATION_GETLIST_REFRESHING
});

export const resetStateByKey = ({ key, path, value }) => ({
    type: NOTIFICATION_GETLIST_RESET_BY_KEY,
    payload: { key, path, value }
});

export const onSubmitEditing = isApplySearchKey => ({
    type: 'NOTIFICATION_ON_SUBMIT_EDITING'
})

export const onChangeText = payload => ({
    type: 'NOTIFICATION_ON_CHANGE_TEXT',
    payload
})

export const onClearText = payload => ({
    type: 'NOTIFICATION_ON_CLEAR_TEXT',
    payload
})

export const onSelectedStatus = payload => ({
    type: 'ON_STATUS_CHANGE',
    payload
})

export const onFilter = payload => ({
    type: 'ON_FILTER',
    payload
})

export const onClearFilter = () => ({
    type: 'ON_CLEAR_FILTER'
})

export const updateIsReadToList = (dataRequest) => async (dispatch) => {
    //console.log(dataRequest)
    if(!dataRequest.isRead){
        dispatch({ 
            type: NOTIFICATION_UPDATE_ITEM_ISREAD,
            payload: {
                data: dataRequest
            } 
        });
    }
    
    try{
        const url = '/Vendors/Notification/Update';
        const params = {
                id: dataRequest.id
            }
        const ret = await post(url, params);
    }catch (error){}
};