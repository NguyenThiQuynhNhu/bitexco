import { get, post } from '../services/helper';
import {
    NOTIFICATION_BG_GETLIST_RESET_BY_KEY,
    NOTIFICATION_BG_GETLIST_REFRESHING,
    NOTIFICATION_BG_GETLIST_REQUEST,
    NOTIFICATION_BG_GETLIST_SUCCESS,
    NOTIFICATION_BG_GETLIST_FAILURE,

    NOTIFICATION_BG_READ_REQUEST,
    NOTIFICATION_BG_READ_SUCCESS,
    NOTIFICATION_BG_READ_FAILURE,

    NOTIFICATION_BG_NO_READ_REQUEST,
    NOTIFICATION_BG_NO_READ_SUCCESS,
    NOTIFICATION_BG_NO_READ_FAILURE,

} from './actionTypes';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest);
        dispatch({ type: NOTIFICATION_BG_GETLIST_REQUEST });
        const url = '/Notification/NotificationEmployee';
        const ret = await post(url, {
            "towerId": dataRequest.towerId,
            "employeeId": dataRequest.employeeId,
            "typeNews": 0
          });
        //console.log(ret);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                dispatch({ type: NOTIFICATION_BG_GETLIST_SUCCESS, payload: { data: ret.data } });
            }
            else {
                dispatch({ type: NOTIFICATION_BG_GETLIST_FAILURE });
            }
        }
        else {
            dispatch({ type: NOTIFICATION_BG_GETLIST_FAILURE });
        }
    } catch (error) {
        dispatch({ type: NOTIFICATION_BG_GETLIST_FAILURE });
    }
};

export const ReadNew = (dataRequest) => async (dispatch) => {
    try {
        dispatch({ type: NOTIFICATION_BG_READ_REQUEST });
        //console.log(dataRequest);

        const url = '/Notification/NotificationRead';
        const ret = await post(url, dataRequest);
        //console.log(ret);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                dispatch({ type: NOTIFICATION_BG_READ_SUCCESS, payload: { data: ret.data } });
                return ret.data
            }
            else {
                dispatch({ type: NOTIFICATION_BG_READ_FAILURE });
                return {
                    status:2,
                    message: ret.message
                }
            }
        }
        else {
            dispatch({ type: NOTIFICATION_BG_READ_FAILURE });
            return {
                status:2,
                message: ret.message
            }
        }
    } catch (error) {
        dispatch({ type: NOTIFICATION_BG_READ_FAILURE });
        return {
            status:2,
            message: ret.message
        }
    }
};

export const NewNoRead = (dataRequest) => async (dispatch) => {
    try {
        dispatch({ type: NOTIFICATION_BG_NO_READ_REQUEST });
        //console.log(dataRequest);
        
        const url = 'NewNoRead';
        const ret = await post(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                dispatch({ type: NOTIFICATION_BG_NO_READ_SUCCESS, payload: { data: ret.data } });
                return ret.data
            }
            else {
                dispatch({ type: NOTIFICATION_BG_NO_READ_FAILURE });
                return ret.data
            }
        }
        else {
            dispatch({ type: NOTIFICATION_BG_NO_READ_FAILURE });
            return ret.data
        }
    } catch (error) {
        dispatch({ type: NOTIFICATION_BG_NO_READ_FAILURE });
        return ret.data
    }
};

export const refreshDataHandle = () => ({
    type: NOTIFICATION_BG_GETLIST_REFRESHING
});
// export const resetStateByKey = ({ key, path, value }) => ({
//     type: NOTIFICATION_BG_GETLIST_RESET_BY_KEY,
//     payload: { key, path, value }
// });
export const resetStateByKey = (payload) => ({
    type: NOTIFICATION_BG_GETLIST_RESET_BY_KEY,
    payload
});

export const onSubmitEditing = isApplySearchKey => ({
    type: 'NOTIFICATION_BG_ON_SUBMIT_EDITING'
})
export const onChangeText = payload => ({
    type: 'NOTIFICATION_BG_ON_CHANGE_TEXT',
    payload
})
export const onClearText = payload => ({
    type: 'NOTIFICATION_BG_ON_CLEAR_TEXT',
    payload
})

export const AddItemToList = payload => ({
    type: 'NOTIFICATION_BG_ADD_ITEM_TO_LIST',
    payload
})