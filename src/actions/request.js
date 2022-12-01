import axios from 'axios';
import { get, helper } from '../services/helper';
import {
    REQUESTS_GETLIST_REQUEST,
    REQUESTS_GETLIST_SUCCESS,
    REQUESTS_GETLIST_FAILURE,
    REQUESTS_GETLIST_REFRESHING,
    REQUESTS_GETLIST_RESET_BY_KEY,
    REQUEST_GET_TOTAL_STATUS_REQUEST,
    REQUEST_GET_TOTAL_STATUS_SUCCESS,
    REQUEST_GET_TOTAL_STATUS_FAILURE
} from './actionTypes';
import firebase from 'firebase';


export const getRequestStatusTotal = (dataRequest) => async (dispatch) => {
    console.log('getRequestStatusTotal')
    try {
        
        dispatch({ type: REQUEST_GET_TOTAL_STATUS_REQUEST });
        const url = '/Vendors/RequestStatusTotal';
        const ret = await get(url, dataRequest);
        console.log(ret)
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
              // console.log(ret.data)
                dispatch({
                    type: REQUEST_GET_TOTAL_STATUS_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
            }
            else {
                dispatch({ type: REQUEST_GET_TOTAL_STATUS_FAILURE });
            }
        }
        else {
            dispatch({ type: REQUEST_GET_TOTAL_STATUS_FAILURE });
        }
    } catch (error) {
        console.log(error)
        dispatch({ type: REQUEST_GET_TOTAL_STATUS_FAILURE });
    }
}
export const loadDataHandle = (dataRequest) => async (dispatch) => {

    try {
        //console.log(dataRequest);
        dispatch({ type: REQUESTS_GETLIST_REQUEST });
        const url = '/Vendors/RequestList';
        const ret = await get(url, dataRequest);
        //console.log(ret);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                dispatch({
                    type: REQUESTS_GETLIST_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
                const retStatusR = await get('/Vendors/RequestStatusTotal', {towerId: dataRequest.towerId, isMine: dataRequest.isMine, langId: dataRequest.langId,})
                        if(retStatusR !== undefined && retStatusR !== null){
                            if (retStatusR.status == 200) {
                                dispatch({
                                    type: REQUEST_GET_TOTAL_STATUS_SUCCESS,
                                    payload: {
                                        data: retStatusR.data
                                    }
                                });
                            }
                        }
            }
            else {
                dispatch({ type: REQUESTS_GETLIST_FAILURE });
            }
        }
        else {
            dispatch({ type: REQUESTS_GETLIST_FAILURE });
        }
    } catch (error) {
        dispatch({ type: REQUESTS_GETLIST_FAILURE });
    }
};
export const refreshDataHandle = () => ({
    type: REQUESTS_GETLIST_REFRESHING
});
export const resetStateByKey = ({ key, path, value }) => ({
    type: REQUESTS_GETLIST_RESET_BY_KEY,
    payload: { key, path, value }
});
export const onSubmitEditing = isApplySearchKey => ({
    type: 'REQUEST_ON_SUBMIT_EDITING'
})
export const onChangeText = payload => ({
    type: 'REQUEST_ON_CHANGE_TEXT',
    payload
})
export const onClearText = payload => ({
    type: 'REQUEST_ON_CLEAR_TEXT',
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
