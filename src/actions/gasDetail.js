import axios from 'axios';
import { get, helper, post } from '../services/helper';
import firebase from 'firebase';
import {
    GAS_CREATE_REQUEST,
    GAS_CREATE_SUCCESS,
    GAS_CREATE_FAILURE,
    GAS_DETAIL_REQUEST,
    GAS_DETAIL_SUCCESS,
    GAS_DETAIL_FAILURE,
    GAS_DETAIL_REFRESHING,
    GAS_DETAIL_RESET_BY_KEY,

    GAS_UNIT_REQUEST,
    GAS_UNIT_SUCCESS,
    GAS_UNIT_FAILURE,
    GAS_UNIT_REFRESHING,
    GAS_UNIT_RESET_BY_KEY,
} from './actionTypes';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest);
        dispatch({ type: GAS_DETAIL_REQUEST });
        const url = '/Gas/GetDetail';
        const ret = await get(url, dataRequest);
        console.log(ret);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                dispatch({ type: GAS_DETAIL_SUCCESS, payload: { data: ret.data } });
            }
            else {
                dispatch({ type: GAS_DETAIL_FAILURE });
            }
        }
        else {
            dispatch({ type: GAS_DETAIL_FAILURE });
        }
    } catch (error) {
        dispatch({ type: GAS_DETAIL_FAILURE });
    }
};
export const loadDataUnitHandle = () => async (dispatch) => {
    try {
        dispatch({ type: GAS_DETAIL_REQUEST });
        const url = '/Gas/GetUnits';
        const ret = await get(url);
        //console.log(ret);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                dispatch({ type: GAS_UNIT_SUCCESS, payload: { data: ret.data } });
            }
            else {
                dispatch({ type: GAS_UNIT_FAILURE });
            }
        }
        else {
            dispatch({ type: GAS_UNIT_FAILURE });
        }
    } catch (error) {
        dispatch({ type: GAS_UNIT_FAILURE });
    }
};

export const createHandle = (dataRequest) => async (dispatch) => {
    const {
        id,
        indexId,
        indexNew,
        indexOld,
        month,
        year,
        description,
        peoplePromotion,
        m3PerPeople,
        rateFeeEnviroment,
        rateFeeVAT,
        unitId,
        imagesInformation,
        dateNotify,
        datePayment,
        dateFrom,
        dateTo
    } = dataRequest

    //console.log(dataRequest)

    dispatch({ type: 'GAS_CREATE_REQUEST' });
    dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: true } });
    try {
        // const response = await axios.post(`${helper.URL_API}/Gas/Insert`,
        //     {
        //         id,
        //         indexId,
        //         indexNew,
        //         indexOld,
        //         month,
        //         year,
        //         description,
        //         rateFeeVAT,
        //         unitId,
        //         imagesInformation
        //     },
        //     {
        //         headers: {
        //             Authorization: `bearer ${await firebase.auth().currentUser.getIdToken()}`
        //         }
        //     });
        //sửa
        const response = await post(`/Gas/Insert`,
            {
                id,
                indexId,
                indexNew,
                indexOld,
                month,
                year,
                description,
                rateFeeVAT,
                unitId,
                imagesInformation,
                dateNotify,
                datePayment,
                dateFrom,
                dateTo
            });
        console.log(response)
        if (response) {
            if (response.status === 200) {
                dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: false } });

                dispatch({
                    type: GAS_CREATE_SUCCESS,
                    payload: {
                        data: {
                            ...response.data
                        },
                        status: response.status,
                        statusText: response.statusText
                    }
                });
            } else {
                dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: false } });
                dispatch({
                    type: GAS_CREATE_FAILURE,
                    payload: {
                        data: null,
                        status: response.status,
                        statusText: response.data.message
                    }
                });
            }
        }
    } catch (error) {
        console.log(error)
        if (error.response) {
            dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: false } });
            dispatch({
                type: GAS_CREATE_FAILURE,
                payload: {
                    data: error.response.data,
                    status: error.response.status,
                    statusText: error.response.data.message
                }
            });
        } else if (error.request) {
            dispatch({
                type: GAS_CREATE_FAILURE,
                payload: {
                    data: null,
                    status: INTERNET_DISCONNECTED,
                    statusText: null
                }
            });
        } else {
            dispatch({
                type: GAS_CREATE_FAILURE,
                payload: {
                    data: null,
                    status: -99,
                    statusText: error.message
                }
            });
        }
    }
};

export const deleteHandle = (dataRequest) => async (dispatch) => {
    const {
        id,
        indexId,
        month,
        year
    } = dataRequest

    //console.log(dataRequest)

    dispatch({ type: 'GAS_DELETE_REQUEST' });
    dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: true } });
    try {
        // const response = await axios.post(`${helper.URL_API}/Gas/Delete`,
        //     {
        //         id,
        //         indexId,
        //         month,
        //         year
        //     },
        //     {
        //         headers: {
        //             Authorization: `bearer ${await firebase.auth().currentUser.getIdToken()}`
        //         }
        //     });
        //sửa
        const response = await post(`/Gas/Delete`,
            {
                id,
                indexId,
                month,
                year
            });
        //console.log(response)
        if (response) {
            if (response.status === 200) {
                dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: false } });

                dispatch({
                    type: 'GAS_DELETE_SUCCESS',
                    payload: {
                        data: {
                            ...response.data
                        },
                        status: response.status,
                        statusText: response.statusText
                    }
                });
            } else {
                dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: false } });
                dispatch({
                    type: 'GAS_DELETE_FAILURE',
                    payload: {
                        data: null,
                        status: response.status,
                        statusText: response.data.message
                    }
                });
            }
        }
    } catch (error) {
        console.log(error.response)
        if (error.response) {
            dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: false } });
            dispatch({
                type: 'GAS_DELETE_FAILURE',
                payload: {
                    data: error.response.data,
                    status: error.response.status,
                    statusText: error.response.data.message
                }
            });
        } else if (error.request) {
            dispatch({
                type: 'GAS_DELETE_FAILURE',
                payload: {
                    data: null,
                    status: INTERNET_DISCONNECTED,
                    statusText: null
                }
            });
        } else {
            dispatch({
                type: 'GAS_DELETE_FAILURE',
                payload: {
                    data: null,
                    status: -99,
                    statusText: error.message
                }
            });
        }
    }
};

export const resetStateByKey = ({ key, path, value }) => ({
    type: GAS_DETAIL_RESET_BY_KEY,
    payload: { key, path, value }
});