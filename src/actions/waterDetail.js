import axios from 'axios';
import { get, helper, post } from '../services/helper';
import firebase from 'firebase';
import {
    WATER_CREATE_REQUEST,
    WATER_CREATE_SUCCESS,
    WATER_CREATE_FAILURE,
    WATER_DETAIL_REQUEST,
    WATER_DETAIL_SUCCESS,
    WATER_DETAIL_FAILURE,
    WATER_DETAIL_REFRESHING,
    WATER_DETAIL_RESET_BY_KEY,
} from './actionTypes';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest);
        dispatch({ type: WATER_DETAIL_REQUEST });
        const url = '/Water/GetDetail';
        const ret = await get(url, dataRequest);
        console.log('water', ret);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                dispatch({ type: WATER_DETAIL_SUCCESS, payload: { data: ret.data } });
            }
            else {
                dispatch({ type: WATER_DETAIL_FAILURE });
            }
        }
        else {
            dispatch({ type: WATER_DETAIL_FAILURE });
        }
    } catch (error) {
        dispatch({ type: WATER_DETAIL_FAILURE });
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
        imagesInformation,
        dateNotify,
                datePayment,
                dateFrom,
                dateTo
    } = dataRequest
    console.log(dataRequest)
    // try { 
    //     let response = await axios.post(`https://apimyhome.dip.vn/api/Water/Insert?idNew=7`, {
    //         id,
    //         indexId,
    //         indexNew,
    //         indexOld,
    //         month,
    //         year,
    //         description,
    //         peoplePromotion,
    //         m3PerPeople,
    //         rateFeeEnviroment,
    //         rateFeeVAT,
    //         imagesInformation
    //     }, {
    //         headers: {
    //             Authorization: `bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjhmNDMyMDRhMTc5MTVlOGJlN2NjZDdjYjI2NGRmNmVhMzgzYzQ5YWIiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTmg_IERpcCAyIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2J1aWxkaW5nLWRpcC1taWVudHJ1bmctZGVtbyIsImF1ZCI6ImJ1aWxkaW5nLWRpcC1taWVudHJ1bmctZGVtbyIsImF1dGhfdGltZSI6MTYyNTgxNzA5MiwidXNlcl9pZCI6Ijg0OTM1OTU0NjE2Iiwic3ViIjoiODQ5MzU5NTQ2MTYiLCJpYXQiOjE2MjU4MTcwOTIsImV4cCI6MTYyNTgyMDY5MiwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6e30sInNpZ25faW5fcHJvdmlkZXIiOiJjdXN0b20ifX0.MF3_s2Qi6jRBjr2lOS2d54fMlPUzV3TiIg_KPW1xjfvg5Ek8XednOVfECJGN0YSRLc3LJVbzqdnmd29Vd8ZrLAwH038fCASKxy3IzaJPuiXOZ1bCp0Vh0V06KP_y1TzRaTaewcm5OdjAE4hMubJhf2sxwxI_8vsB20PZMj4mCjWV_uhtXvSbVvrwbs4puEw_Z58MzdAA121oE7SMdmS7EHy8ywiOaqokmaAZkYzEExbHb3GipWN0CU2e_DPKQOkgMg27Kxe0aNhUyBXuSOuA42eJmLb-8_301tyVTCapfN3_ip-NH2dusxzBB9ONt_e07A-DX4b2bAzILZoe1Zk6kQ`
    //         },
    //     });
    // console.log(response)
    // } catch (error) {console.log(error)}
    
    dispatch({ type: WATER_CREATE_REQUEST });
    dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: true } });
    try {
        const response = await post(`/Water/Insert`,
            {
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
                    type: WATER_CREATE_SUCCESS,
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
                    type: WATER_CREATE_FAILURE,
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
                type: WATER_CREATE_FAILURE,
                payload: {
                    data: error.response.data,
                    status: error.response.status,
                    statusText: error.response.data.message
                }
            });
        } else if (error.request) {
            dispatch({
                type: WATER_CREATE_FAILURE,
                payload: {
                    data: null,
                    status: INTERNET_DISCONNECTED,
                    statusText: null
                }
            });
        } else {
            dispatch({
                type: WATER_CREATE_FAILURE,
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

    dispatch({ type: 'WATER_DELETE_REQUEST' });
    dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: true } });
    try {
        // const response = await axios.post(`${helper.URL_API}/Water/Delete`,
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
        const response = await post(`/Water/Delete`,
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
                    type: 'WATER_DELETE_SUCCESS',
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
                    type: 'WATER_DELETE_FAILURE',
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
                type: 'WATER_DELETE_FAILURE',
                payload: {
                    data: error.response.data,
                    status: error.response.status,
                    statusText: error.response.data.message
                }
            });
        } else if (error.request) {
            dispatch({
                type: 'WATER_DELETE_FAILURE',
                payload: {
                    data: null,
                    status: INTERNET_DISCONNECTED,
                    statusText: null
                }
            });
        } else {
            dispatch({
                type: 'WATER_DELETE_FAILURE',
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
    type: WATER_DETAIL_RESET_BY_KEY,
    payload: { key, path, value }
});