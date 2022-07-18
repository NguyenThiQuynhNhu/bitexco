import axios from 'axios';
import { get, helper } from '../services/helper';
import {
    UTILITIES_GETLIST_RESET_BY_KEY,
    UTILITIES_GETLIST_REQUEST,
    UTILITIES_GETLIST_FAILURE,
    UTILITIES_GETLIST_SUCCESS
} from './actionTypes';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        dispatch({ type: UTILITIES_GETLIST_REQUEST });
        const url = '/Residents/Service/Categories/List';
        const ret = await get(url, dataRequest);
        //console.log(ret)
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                
                dispatch({
                    type: UTILITIES_GETLIST_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
            }
            else {
                dispatch({ type: UTILITIES_GETLIST_FAILURE, payload: { data: ret.message } });
            }
        }
        else {
            dispatch({ type: UTILITIES_GETLIST_FAILURE, payload: { data: ret.message } });
        }
    } catch (error) {
        dispatch({ type: UTILITIES_GETLIST_FAILURE, payload: { data: ret.message } });
    }
};

export const resetStateByKey = (payload) => ({
    type: UTILITIES_GETLIST_RESET_BY_KEY,
    payload
});