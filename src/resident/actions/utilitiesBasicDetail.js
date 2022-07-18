import axios from 'axios';
import { get, helper } from '../services/helper';
import firebase from 'firebase';
import {
    UTILITIES_BASIC_DETAIL_RESET_BY_KEY,
    UTILITIES_BASIC_DETAIL_REQUEST,
    UTILITIES_BASIC_DETAIL_SUCCESS,
    UTILITIES_BASIC_DETAIL_FAILURE,
    UTILITIES_BASIC_DETAIL_REFRESHING
} from './actionTypes';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        dispatch({ type: UTILITIES_BASIC_DETAIL_REQUEST });
        const url = '/Residents/Service/Detail';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
              //  console.log(ret.data)
                dispatch({
                    type: UTILITIES_BASIC_DETAIL_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
            }
            else {
                dispatch({ type: UTILITIES_BASIC_DETAIL_FAILURE, payload: { data: ret.message } });
            }
        }
        else {
            dispatch({ type: UTILITIES_BASIC_DETAIL_FAILURE, payload: { data: ret.message } });
        }
    } catch (error) {
        dispatch({ type: UTILITIES_BASIC_DETAIL_FAILURE, payload: { data: ret.message } });
    }
};

export const resetStateByKey = (payload) => ({
    type: UTILITIES_BASIC_DETAIL_RESET_BY_KEY,
    payload
});

export const refreshDataHandle = () => ({
    type: UTILITIES_BASIC_DETAIL_REFRESHING
});
