import axios from 'axios';
import { get, helper, post } from '../services/helper';
import firebase from 'firebase';
import {

    REQUEST_CREATE_REQUEST,
    REQUEST_CREATE_SUCCESS,
    REQUEST_CREATE_FAILURE
} from './actionTypes';

export const resetStateByKey = (payload) => ({
    type: 'REQUESTS_CREATE_RESET_BY_KEY',
    payload
});
export const onVendorSelected = (payload) => ({
    type: 'REQUEST_CREATE_VENDOR_SELECTED',
    payload
})



export const createRequestHandle = (dataRequest) => async (dispatch) => {
    const {
        vendorSelected,
        depSelected,
        employeeSelected,
        groupSelected,
        apartmentSelected,
        levelSelected,
        title,
        content,
        day,
        time,
        userContact,
        phoneContact,
        imageInformation
    } = dataRequest

    dispatch({ type: REQUEST_CREATE_REQUEST });
    dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: true } });
    console.log(JSON.stringify(
        {
            towerId: vendorSelected.id,
            contractId: apartmentSelected ? apartmentSelected.id : 0,
            title,
            content,
            time,
            day,
            userContact,
            phoneContact,
            departmentId: depSelected.id,
            employeeProcessId: employeeSelected.id,
            groupId: groupSelected.id,
            priorotyId: levelSelected.id,
            imageInformation
        }
    ))
    try {
        // const response = await axios.post(`${helper.URL_API}/Vendors/RequestInsert`,
        //     {
        //         towerId: vendorSelected.id,
        //         contractId: apartmentSelected ? apartmentSelected.id : 0,
        //         title,
        //         content,
        //         time,
        //         day,
        //         userContact,
        //         phoneContact,
        //         departmentId: depSelected.id,
        //         employeeProcessId: employeeSelected.id,
        //         groupId: groupSelected.id,
        //         priorotyId: levelSelected.id,
        //         imageInformation
        //     },
        //     {
        //         headers: {
        //             Authorization: `bearer ${await firebase.auth().currentUser.getIdToken()}`
        //         }
        //     });
        //sửa
        const response = await post(`/Vendors/RequestInsert`,
            {
                towerId: vendorSelected.id,
                contractId: apartmentSelected ? apartmentSelected.id : 0,
                title,
                content,
                time,
                day,
                userContact,
                phoneContact,
                departmentId: depSelected.id,
                employeeProcessId: employeeSelected.id,
                groupId: groupSelected.id,
                priorotyId: levelSelected.id,
                imageInformation
            });
            console.log(JSON.stringify(
                {
                    towerId: vendorSelected.id,
                    contractId: apartmentSelected ? apartmentSelected.id : 0,
                    title,
                    content,
                    time,
                    day,
                    userContact,
                    phoneContact,
                    departmentId: depSelected.id,
                    employeeProcessId: employeeSelected.id,
                    groupId: groupSelected.id,
                    priorotyId: levelSelected.id,
                    imageInformation
                }
            ))
        console.log(response)
        if (response) {
            if (response.status === 200) {
                dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: false } });

                dispatch({
                    type: REQUEST_CREATE_SUCCESS,
                    payload: {
                        data: {
                            ...response.data,
                            contractName: apartmentSelected ? apartmentSelected.name : '',
                            departmentName: depSelected.name,
                            employeeName: employeeSelected.name,
                            groupProcessName: groupSelected.name
                        },
                        status: response.status,
                        statusText: response.statusText
                    }
                });
            } else {
                dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: false } });
                dispatch({
                    type: REQUEST_CREATE_FAILURE,
                    payload: {
                        data: null,
                        status: response.status,
                        statusText: response.statusText
                    }
                });
            }
        }
    } catch (error) {
        console.log(error.response)
        if (error.response) {
            dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: false } });
            dispatch({
                type: REQUEST_CREATE_FAILURE,
                payload: {
                    data: error.response.data,
                    status: error.response.status,
                    statusText: error.response.headers
                }
            });
        } else if (error.request) {
            dispatch({
                type: REQUEST_CREATE_FAILURE,
                payload: {
                    data: null,
                    status: INTERNET_DISCONNECTED,
                    statusText: null
                }
            });
        } else {
            dispatch({
                type: REQUEST_CREATE_FAILURE,
                payload: {
                    data: null,
                    status: -99,
                    statusText: error.message
                }
            });
        }
    }

};


