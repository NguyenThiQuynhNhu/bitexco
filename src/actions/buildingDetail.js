import axios from 'axios';
import { get, helper, post } from '../resident/services/helper';
import {getProfilePayment} from './auth';
import {
    BUILDING_DETAIL_REQUEST,
    BUILDING_DETAIL_FAILURE,
    BUILDING_DETAIL_SUCCESS,
    BUILDING_DETAIL_RESET_BY_KEY,
    BUILDING_DETAIL_REFRESHING
} from '../resident/actions/actionTypes';
import firebase from 'firebase';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest);
        dispatch({ type: 'BUILDING_DETAIL_REQUEST' });
        const url = '/Residents/TowersDetail';
        const ret = await get(url, dataRequest);
        console.log(ret);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                dispatch({ type: 'BUILDING_DETAIL_SUCCESS', payload: { data: ret.data } });
            }
            else {
                dispatch({ type: 'BUILDING_DETAIL_FAILURE' });
            }
        }
        else {
            dispatch({ type: 'BUILDING_DETAIL_FAILURE' });
        }
    } catch (error) {
        console.log(error)
        dispatch({ type: 'BUILDING_DETAIL_FAILURE' });
    }
};

export const refreshDataHandle = () => ({
    type: 'BUILDING_DETAIL_REFRESHING'
});

export const resetStateByKey = ({ key, path, value }) => ({
    type: 'BUILDING_DETAIL_RESET_BY_KEY',
    payload: { key, path, value }
});