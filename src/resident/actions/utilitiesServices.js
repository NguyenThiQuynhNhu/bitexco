import axios from 'axios';
import { get } from '../services/helper';
import {
UTILITIES_SERVICES_GETLIST_RESET_BY_KEY,
UTILITIES_SERVICES_GETLIST_REQUEST,
UTILITIES_SERVICES_GETLIST_SUCCESS,
UTILITIES_SERVICES_GETLIST_FAILURE,
UTILITIES_SERVICES_GETLIST_REFRESHING
} from './actionTypes';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest)
        dispatch({ type: UTILITIES_SERVICES_GETLIST_REQUEST });
        const url = '/Residents/Service/List';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
              //  console.log(ret.data)
                dispatch({
                    type: UTILITIES_SERVICES_GETLIST_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
            }
            else {
                dispatch({ type: UTILITIES_SERVICES_GETLIST_FAILURE, payload: { data: ret.message } });
            }
        }
        else {
            dispatch({ type: UTILITIES_SERVICES_GETLIST_FAILURE, payload: { data: ret.message } });
        }
    } catch (error) {
        dispatch({ type: UTILITIES_SERVICES_GETLIST_FAILURE, payload: { data: ret.message } });
    }
};

export const resetStateByKey = (payload) => ({
    type: UTILITIES_SERVICES_GETLIST_RESET_BY_KEY,
    payload
});


export const refreshDataHandle = () => ({
    type: UTILITIES_SERVICES_GETLIST_REFRESHING
});
