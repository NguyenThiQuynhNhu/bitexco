import axios from 'axios';
import { get, helper } from '../services/helper';
import {
    CHECKLIST_GETLIST_REQUEST,
    CHECKLIST_GETLIST_SUCCESS,
    CHECKLIST_GETLIST_FAILURE,
    CHECKLIST_GETLIST_REFRESHING,
    CHECKLIST_GETLIST_RESET_BY_KEY,
    CHECKLIST_GET_TOTAL_STATUS_REQUEST,
    CHECKLIST_GET_TOTAL_STATUS_SUCCESS,
    CHECKLIST_GET_TOTAL_STATUS_FAILURE
} from './actionTypes';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';

export const getRequestStatusTotal = (dataRequest) => async (dispatch) => {
    try {
        dispatch({ type: CHECKLIST_GET_TOTAL_STATUS_REQUEST });
        const url = '/Vendors/RequestStatusTotal';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                //console.log(ret.data)
                dispatch({
                    type: CHECKLIST_GET_TOTAL_STATUS_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
            }
            else {
                dispatch({ type: CHECKLIST_GET_TOTAL_STATUS_FAILURE });
            }
        }
        else {
            dispatch({ type: CHECKLIST_GET_TOTAL_STATUS_FAILURE });
        }
    } catch (error) {
        console.log(error)
        dispatch({ type: CHECKLIST_GET_TOTAL_STATUS_FAILURE });
    }
}
export const loadDataHandle = (dataRequest, isMaintenance) => async (dispatch) => {

    try {
        //console.log(dataRequest);
        dispatch({ type: CHECKLIST_GETLIST_REQUEST });
        const url = `/Vendors/Home/${ isMaintenance === 1 ? 'MaintenanceList' : 'ChecklistList' }`;//'/Vendors/Home/ChecklistList';
        //console.log(url)
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                //console.log(ret)
                //AsyncStorage.setItem('checklist', JSON.stringify(ret.data) );
                dispatch({
                    type: CHECKLIST_GETLIST_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
                //const value = await AsyncStorage.getItem('checklist');
                //console.log('value', JSON.parse(value))
            }
            else {
                dispatch({ type: CHECKLIST_GETLIST_FAILURE });
            }
        }
        else {
            dispatch({ type: CHECKLIST_GETLIST_FAILURE });
        }
    } catch (error) {
        dispatch({ type: CHECKLIST_GETLIST_FAILURE });
    }
};
export const refreshDataHandle = () => ({
    type: CHECKLIST_GETLIST_REFRESHING
});
export const resetStateByKey = ({ key, path, value }) => ({
    type: CHECKLIST_GETLIST_RESET_BY_KEY,
    payload: { key, path, value }
});
export const onSubmitEditing = isApplySearchKey => ({
    type: 'CHECKLIST_ON_SUBMIT_EDITING'
})
export const onChangeText = payload => ({
    type: 'CHECKLIST_ON_CHANGE_TEXT',
    payload
})
export const onClearText = payload => ({
    type: 'CHECKLIST_ON_CLEAR_TEXT',
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
