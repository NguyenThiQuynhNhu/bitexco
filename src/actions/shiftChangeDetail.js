import { get, post, put } from '../services/helper';
import axios from 'axios';
import {
    SHIFTCHANGE_DETAIL_REQUEST,
    SHIFTCHANGE_DETAIL_SUCCESS,
    SHIFTCHANGE_DETAIL_FAILURE,
    SHIFTCHANGE_DETAIL_REFRESHING,
} from './actionTypes';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest);
        dispatch({ type: SHIFTCHANGE_DETAIL_REQUEST });
        const url = '/Vendors/ShiftChange/Detail';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
              //  console.log(ret.data)
                dispatch({ type: SHIFTCHANGE_DETAIL_SUCCESS, payload: { data: ret.data } });
            }
            else {
                dispatch({ type: SHIFTCHANGE_DETAIL_FAILURE });
            }
        }
        else {
            dispatch({ type: SHIFTCHANGE_DETAIL_FAILURE });
        }
    } catch (error) {
        dispatch({ type: SHIFTCHANGE_DETAIL_FAILURE });
    }
};

export const updateHandle = (params) => async (dispatch) => {
    dispatch({ type: 'SHIFTCHANGE_DETAIL_SETPROPS', payload: { errorUpdate: null } });
    dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: true } });
    const url = '/Vendors/SheduleTime/Process';
    const ret = await put(url, params);
    if (ret === -1) {
        dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: false } });
        dispatch({ type: 'SHIFTCHANGE_DETAIL_SETPROPS', payload: { errorUpdate: { hasError: true } } });
    } else {
        dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: false } });
        dispatch({
            type: 'SHIFTCHANGE_DETAIL_UPDATE_SUCCESS', payload: {
                errorUpdate: { hasError: false },
                 data: ret.data 
            }
        });
    }
};

export const updateStatusHandle = (params) => async (dispatch) => {
    dispatch({ type: 'SHIFTCHANGE_DETAIL_SETPROPS', payload: { errorUpdate: null } });
    dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: true, isReload: false } });
    const url = '/Vendors/SheduleTime/Process';
    const ret = await put(url, params);
    if (ret === -1) {
        dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: false } });
        dispatch({ type: 'SHIFTCHANGE_DETAIL_SETPROPS', payload: { errorUpdate: { hasError: true } } });
    } else {
        dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: false } });
        //console.log(ret)
        dispatch({
            type: 'SHIFTCHANGE_DETAIL_UPDATE_STATUS_SUCCESS', payload: {
                errorUpdate: { hasError: false },
                 data: ret.data 
            }
        });

        let statusName = '';
        switch(params.statusId){
            case 10: statusName = 'Mới'; break;
            case 20: statusName = 'Đã duyệt'; break;
            case 30: statusName = 'Không duyệt'; break;
            case 40: statusName = 'Đã huỷ'; break;
        }

        const dataItemToList = {
            id: params.id,
            status: statusName,
            statusId: params.statusId
        };

          dispatch({
            type: 'SHIFTCHANGE_UPDATE_ITEM_TOLIST',
            payload: {
              data: dataItemToList,
              typeAction: 'UPDATE'
            }
          });
    }
};

export const refreshDataHandle = () => ({
    type: SHIFTCHANGE_DETAIL_REFRESHING
});

export const resetStateByKey = (payload) => ({
    type: 'SHIFTCHANGE_DETAIL_SETPROPS',
    payload
});