import axios from 'axios';
import { get, helper, post } from '../services/helper';
import firebase from 'firebase';
import {

    R_REQUEST_CREATE_REQUEST,
    R_REQUEST_CREATE_SUCCESS,
    R_REQUEST_CREATE_FAILURE
} from './actionTypes';


export const createRequestHandle = (dataRequest) => async (dispatch) => {
    const {
        vendorSelected,
        contractSelected,
        title,
        content,
        day,
        time,
        userContact,
        phoneContact,
        imagesInformation
    } = dataRequest
    dispatch({ type: R_REQUEST_CREATE_REQUEST });
    console.log(JSON.stringify({
        requestsInformation: {
            towerId: vendorSelected.id,
            contractId: contractSelected.id,
            title,
            content,
            time,
            day,
            userContact,
            phoneContact
        },
        imagesInformation
    }))
    try {
        const token = await firebase.auth().currentUser.getIdToken();
        // const response = await axios.post(`${helper.URL_API}/Residents/RequestInsert`,
        //     {
        //         requestsInformation: {
        //             towerId: vendorSelected.id,
        //             contractId: contractSelected.id,
        //             title,
        //             content,
        //             time,
        //             day,
        //             userContact,
        //             phoneContact
        //         },
        //         imagesInformation
        //     },
        //     {
        //         headers: {
        //             Authorization: `bearer ${token}`
        //         }
        //     });
        //sửa
        const response = await post(`/Residents/RequestInsert`,
            {
                requestsInformation: {
                    towerId: vendorSelected.id,
                    contractId: contractSelected.id,
                    title,
                    content,
                    time,
                    day,
                    userContact,
                    phoneContact
                },
                imagesInformation
            });
        console.log(response);
        if (response) {
            if (response.status === 200) {
                // firebase.messaging().subscribeToTopic(response.data.requestId);
                dispatch({
                    type: R_REQUEST_CREATE_SUCCESS,
                    payload: {
                        data: response.data
                    }
                });
            } else {
                dispatch({
                    type: R_REQUEST_CREATE_FAILURE,
                    payload: {
                        data: response.message
                    }
                });
            }
        } else {
            dispatch({
                type: R_REQUEST_CREATE_FAILURE,
                payload: {
                    data: response.message
                }
            });
        }
    } catch (error) {
        console.log(error);
        dispatch({
            type: R_REQUEST_CREATE_FAILURE,
            payload: {
                data: 'Xảy ra lỗi không xác định'
            }
        });
    }
};


