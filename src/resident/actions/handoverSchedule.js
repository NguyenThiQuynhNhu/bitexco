import axios from 'axios';
import { get, helper } from '../services/helper';
import {
    HANDOVER_SCHEDULE_SUCCESS,
    HANDOVER_SCHEDULE_REQUEST,
    HANDOVER_SCHEDULE_FAILURE,
    HANDOVER_SCHEDULE_REFRESHING,
    HANDOVER_SCHEDULE_RESET_BY_KEY
} from './actionTypes';
import firebase from 'firebase';
import moment from 'moment';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest);
        dispatch({ type: HANDOVER_SCHEDULE_REQUEST });
        const token = await firebase.auth().currentUser.getIdToken();
        const url = `${helper.URL_API}/HandOverCustomer/ViewSchedule?makh= ${dataRequest.makh}&date=null`;
        const ret = await axios.post(url, dataRequest,
            {
                headers: {
                    Authorization: `bearer ${token}`
                }
            });
        //console.log(ret);
        // let oj = [{dateHandoverFrom: "2020-10-26T10:12:44.967", dateHandoverTo: "2020-10-27T10:12:44.967"},
        // {dateHandoverFrom: "2020-10-26T10:12:44.967", dateHandoverTo: "2020-10-29T10:12:44.967"}]
        const res = ret.data.reduce((accumulator, currentValue, currentIndex, array)=> ((accumulator[moment(currentValue.dateHandoverFrom).format('YYYY-MM-DD')]={disabled: true, startingDay: true, color: 'green', endingDay: true}, accumulator[moment(currentValue.dateHandoverTo).format('YYYY-MM-DD')]={disabled: true, startingDay: true, color: 'green', endingDay: true}),accumulator),{});
        //console.log(res);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {

                dispatch({ type: HANDOVER_SCHEDULE_SUCCESS, payload: { data: res} });
            }
            else {
                dispatch({ type: HANDOVER_SCHEDULE_FAILURE, payload: { data: ret.message } });
            }
        }
        else {
            dispatch({ type: HANDOVER_SCHEDULE_FAILURE });
        }
    } catch (error) {
        console.log(error);
        dispatch({ type: HANDOVER_SCHEDULE_FAILURE });
    }
    //console.log(ret.data);

};
export const refreshDataHandle = () => ({
    type: HANDOVER_SCHEDULE_REFRESHING
});
export const resetStateByKey = ({ key, path, value }) => ({
    type: HANDOVER_SCHEDULE_RESET_BY_KEY,
    payload: { key, path, value }
});

export const loadDataDayListHandle = (dataRequest) => async (dispatch) => {
    // dispatch({ type: 'HANDOVER_DAYLIST_GETLIST_REQUEST' });
    // const url = '/Vendors/Shift/DayList';
    // const ret = await get(url, params);
    // if (ret === -1) {
    //     dispatch({ type: 'HANDOVER_DAYLIST_GETLIST_FAILURE' });
    // } else {
    //     dispatch({
    //         type: 'HANDOVER_DAYLIST_GETLIST_SUCCESS',
    //         payload: {
    //             data: ret.data
    //         }
    //     });
    // }
    try {
        //console.log(dataRequest);
        dispatch({ type: 'HANDOVER_DAYLIST_GETLIST_REQUEST' });
        const token = await firebase.auth().currentUser.getIdToken();
        const url = `${helper.URL_API}/HandOverCustomer/ViewSchedule?makh=${dataRequest.makh}&date=${dataRequest.date}`;
        //const url = 'http://apiappdb.dip.vn/api/HandOverCustomer/ViewSchedule?makh=8237&date=2020-10-26T00:00:00Z'
        const ret = await axios.post(url, dataRequest,
            {
                headers: {
                    Authorization: `bearer ${token}`
                }
            });
        //console.log(ret);
        // let oj = [{dateHandoverFrom: "2020-10-26T10:12:44.967", dateHandoverTo: "2020-10-27T10:12:44.967"},
        // {dateHandoverFrom: "2020-10-26T10:12:44.967", dateHandoverTo: "2020-10-29T10:12:44.967"}]
        const res = ret.data.reduce((accumulator, currentValue, currentIndex, array)=> ((accumulator[moment(currentValue.dateHandoverFrom).format('YYYY-MM-DD')]={disabled: true, startingDay: true, color: 'green', endingDay: true}, accumulator[moment(currentValue.dateHandoverTo).format('YYYY-MM-DD')]={disabled: true, startingDay: true, color: 'green', endingDay: true}),accumulator),{});
        //console.log(res);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {

                dispatch({ type: 'HANDOVER_DAYLIST_GETLIST_SUCCESS', payload: { data: ret.data} });
            }
            else {
                dispatch({ type: 'HANDOVER_DAYLIST_GETLIST_FAILURE' });
            }
        }
        else {
            dispatch({ type: 'HANDOVER_DAYLIST_GETLIST_FAILURE' });
        }
    } catch (error) {
        console.log(error);
        dispatch({ type: 'HANDOVER_DAYLIST_GETLIST_FAILURE' });
    }
};
export const handoverSetProps = (payload) => ({
    type: 'HANDOVER_DAYLIST_PROPS',
    payload
});