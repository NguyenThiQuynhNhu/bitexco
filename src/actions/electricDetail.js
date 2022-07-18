import axios from 'axios';
import { get, helper, post, get1 } from '../services/helper';
import firebase from 'firebase';
import {
    ELECTRIC_CREATE_REQUEST,
    ELECTRIC_CREATE_SUCCESS,
    ELECTRIC_CREATE_FAILURE,
    ELECTRIC_DETAIL_REQUEST,
    ELECTRIC_DETAIL_SUCCESS,
    ELECTRIC_DETAIL_FAILURE,
    ELECTRIC_DETAIL_REFRESHING,
    ELECTRIC_DETAIL_RESET_BY_KEY,
} from './actionTypes';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        console.log(dataRequest);
        dispatch({ type: ELECTRIC_DETAIL_REQUEST });
        const url = '/Electric/GetDetail';
        //const url = 'https://apiconnectxuanmai.dip.vn/api/Electric/GetDetail?id=59540&indexId=0&idNew=31&isPersonal=true'
        const ret = await get(url, dataRequest);
        console.log(ret);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                dispatch({ type: ELECTRIC_DETAIL_SUCCESS, payload: { data: ret.data } });
            }
            else {
                dispatch({ type: ELECTRIC_DETAIL_FAILURE });
            }
        }
        else {
            dispatch({ type: ELECTRIC_DETAIL_FAILURE });
        }
    } catch (error) {
        dispatch({ type: ELECTRIC_DETAIL_FAILURE });
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
        rateFeeLoss,
        rateFeeVAT,
        imagesInformation,
        dateNotify,
        datePayment,
        dateFrom,
        dateTo,
        meterId
    } = dataRequest

    dispatch({ type: ELECTRIC_CREATE_REQUEST });
    dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: true } });
    try {

        // const response = await axios.post(`${helper.URL_API}/Electric/Insert`,
        //     {
        //         id,
        //         indexId,
        //         indexNew,
        //         indexOld,
        //         month,
        //         year,
        //         description,
        //         rateFeeLoss,
        //         rateFeeVAT, 
        //         imagesInformation
        //     },
        //     {
        //         headers: {
        //             Authorization: `bearer ${await firebase.auth().currentUser.getIdToken()}`
        //         }
        //     });
        //sửa
        const response = await post(`/Electric/Insert`,
            {
                id,
                indexId,
                indexNew,
                indexOld,
                month,
                year,
                description,
                rateFeeLoss,
                rateFeeVAT,
                imagesInformation,
                dateNotify,
                datePayment,
                dateFrom,
                dateTo,
                meterId
            });
        console.log(response)
        if (response) {
            if (response.status === 200) {
                dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: false } });

                dispatch({
                    type: ELECTRIC_CREATE_SUCCESS,
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
                    type: ELECTRIC_CREATE_FAILURE,
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
                type: ELECTRIC_CREATE_FAILURE,
                payload: {
                    data: error.response.data,
                    status: error.response.status,
                    statusText: error.response.data.message
                }
            });
        } else if (error.request) {
            dispatch({
                type: ELECTRIC_CREATE_FAILURE,
                payload: {
                    data: null,
                    status: INTERNET_DISCONNECTED,
                    statusText: null
                }
            });
        } else {
            dispatch({
                type: ELECTRIC_CREATE_FAILURE,
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

    console.log(dataRequest)

    dispatch({ type: 'ELECTRIC_DELETE_REQUEST' });
    dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: true } });
    try {
        // const response = await axios.post(`${helper.URL_API}/Electric/Delete`,
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
        const response = await post(`/Electric/Delete`,
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
                    type: 'ELECTRIC_DELETE_SUCCESS',
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
                    type: 'ELECTRIC_DELETE_FAILURE',
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
                type: 'ELECTRIC_DELETE_FAILURE',
                payload: {
                    data: error.response.data,
                    status: error.response.status,
                    statusText: error.response.data.message
                }
            });
        } else if (error.request) {
            dispatch({
                type: 'ELECTRIC_DELETE_FAILURE',
                payload: {
                    data: null,
                    status: INTERNET_DISCONNECTED,
                    statusText: null
                }
            });
        } else {
            dispatch({
                type: 'ELECTRIC_DELETE_FAILURE',
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
    type: ELECTRIC_DETAIL_RESET_BY_KEY,
    payload: { key, path, value }
});