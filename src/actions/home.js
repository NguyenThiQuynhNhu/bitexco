import { get, helper } from '../services/helper';
import {
    BADGE_NOTIFY_R_SUCCESS
} from './actionTypes';
import firebase from 'firebase';
import FCM from 'react-native-fcm';
export const setProps = (payload) => ({
    type: 'HOME_SET_PROPS',
    payload
});

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        dispatch({ type: 'HOME_GET_TASKLIST_REQUEST' });
        const url = '/Vendors/Home/TaskList';
        const ret = await get(url, dataRequest);

        if (ret !== undefined && ret !== null) {
            //console.log(ret)
            if (ret.status == 200) {
                dispatch({
                    type: 'HOME_GET_TASKLIST_SUCCESS',
                    payload: {
                        data: ret.data
                    }
                });
            }
            else {
                dispatch({ type: 'HOME_GET_TASKLIST_FAILURE' });
            }
        }
        else {
            dispatch({ type: 'HOME_GET_TASKLIST_FAILURE' });
        }
    } catch (error) {
        console.log(error)
        dispatch({ type: 'HOME_GET_TASKLIST_FAILURE' });
    }
}

export const loadBadge = () => async (dispatch) => {
    try {
        const urlNotify = '/Vendors/Notification/CountUnRead';
        const retNotify = await get(urlNotify, {typeId: 0, isRead: 0});
        //console.log(retNotify);
        if (retNotify !== undefined && retNotify !== null) {
            if (retNotify.status == 200) {
                //const result1 = retNotifyR.data.filter(item => item.isRead == false);
                FCM.setBadgeNumber(retNotify.data.count_notify);
                dispatch({ type: BADGE_NOTIFY_R_SUCCESS, payload: retNotify.data.count_notify });
            }
            
        }
    } catch (error) {
        console.log(error);
    }
};