import axios from 'axios';
import { get, helper } from '../services/helper';
import {
    R_REQUESTS_GETLIST_REQUEST,
    R_REQUESTS_GETLIST_SUCCESS,
    R_REQUESTS_GETLIST_FAILURE,
    R_REQUESTS_GETLIST_REFRESHING,
    R_REQUESTS_GETLIST_RESET_BY_KEY,
    BADGE_REQUEST_R_SUCCESS,
    REQUEST_GET_TOTAL_STATUS_SUCCESS
} from './actionTypes';
import firebase from 'firebase';
export const demo = (value, data) => async (dispatch) => {
    await data.forEach(element => {
        element.currentValue = value
    });
    await dispatch({
        type: REQUEST_GET_TOTAL_STATUS_SUCCESS,
        payload: {
            data: data
        }
    });

}
export const getRequestStatusTotal = (dataRequest) => async (dispatch) => {
    console.log('getRequestStatusTotal')
    try {

        const urlRequestR = '/Residents/GetTotalStatus';
        const retRequestR = await get(urlRequestR, {
            towerId: dataRequest.towerId,
            keyword: '',
            statusId: 0,
            langId: dataRequest.langId,
        });
        if (retRequestR !== undefined && retRequestR !== null) {
            if (retRequestR.status == 200) {
                const retStatusR = await get('/Vendors/RequestStatusTotal', { towerId: dataRequest.towerId, langId: dataRequest.langId })
                //console.log(retStatusR);
                if (retStatusR !== undefined && retStatusR !== null) {
                    await retStatusR.data.forEach(item1 => {
                        item1.total2 = 0;
                        //item1.currentValue = 0;
                        retRequestR.data.forEach(item2 => {
                            if (item1.id == item2.statusId) {
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
                if (result2.length > 0) {
                    dispatch({ type: BADGE_REQUEST_R_SUCCESS, payload: result2[0].total });
                } else {
                    dispatch({ type: BADGE_REQUEST_R_SUCCESS, payload: 0 });
                }
            } else {
                //
            }
        } else {
            //
        }
    } catch (error) {
        console.log(error)
    }
}
export const loadDataHandle = (dataRequest) => async (dispatch) => {

    try {
        console.log(dataRequest);
        dispatch({ type: R_REQUESTS_GETLIST_REQUEST });
        const url = '/Residents/RequestList';
        const ret = await get(url, dataRequest);
        //console.log(ret);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                await dispatch({
                    type: R_REQUESTS_GETLIST_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
                const urlRequestR = '/Residents/GetTotalStatus';
                const retRequestR = await get(urlRequestR, {
                    towerId: dataRequest.towerId,
                    keyword: '',
                    statusId: 0,
                    langId: dataRequest.langId,
                });
                if (retRequestR !== undefined && retRequestR !== null) {
                    if (retRequestR.status == 200) {
                        const retStatusR = await get('/Vendors/RequestStatusTotal', { towerId: dataRequest.towerId, langId: dataRequest.langId })
                        //console.log(retStatusR);
                        if (retStatusR !== undefined && retStatusR !== null) {
                            await retStatusR.data.forEach(item1 => {
                                item1.total2 = 0;
                                //item1.currentValue = 0;
                                retRequestR.data.forEach(item2 => {
                                    if (item1.id == item2.statusId) {
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
                        if (result2.length > 0) {
                            dispatch({ type: BADGE_REQUEST_R_SUCCESS, payload: result2[0].total });
                        } else {
                            dispatch({ type: BADGE_REQUEST_R_SUCCESS, payload: 0 });
                        }
                    } else {
                        dispatch({ type: R_REQUESTS_GETLIST_FAILURE });
                    }
                } else {
                    dispatch({ type: R_REQUESTS_GETLIST_FAILURE });
                }
                // const result2 = await ret.data.filter(item => item.statusId == 1);
                // await dispatch({ type: BADGE_REQUEST_R_SUCCESS, payload: result2.length });
            }
            else {
                dispatch({ type: R_REQUESTS_GETLIST_FAILURE });
            }
        }
        else {
            dispatch({ type: R_REQUESTS_GETLIST_FAILURE });
        }
    } catch (error) {
        dispatch({ type: R_REQUESTS_GETLIST_FAILURE });
    }
};
export const refreshDataHandle = () => ({
    type: R_REQUESTS_GETLIST_REFRESHING
});
export const resetStateByKey = ({ key, path, value }) => ({
    type: R_REQUESTS_GETLIST_RESET_BY_KEY,
    payload: { key, path, value }
});
export const onSubmitEditing = isApplySearchKey => ({
    type: 'R_REQUEST_ON_SUBMIT_EDITING'
})
export const onChangeText = payload => ({
    type: 'R_REQUEST_ON_CHANGE_TEXT',
    payload
})
export const onClearText = payload => ({
    type: 'R_REQUEST_ON_CLEAR_TEXT',
    payload
})