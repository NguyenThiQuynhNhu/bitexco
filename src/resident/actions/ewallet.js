import axios from 'axios';
import { get, helper, post } from '../services/helper';
import firebase from 'firebase';

export const checkPaymenHandle = (dataRequest) => async (dispatch) => {
    // try {
    //     dispatch({ type: 'MOMO_PAYMENT_REQUEST' });
    //     const token = await firebase.auth().currentUser.getIdToken();
    //     const url = `/PaymentEWallet/Momo/Payment`;
    //     // const response = await axios.post(url,
    //     //     dataRequest,
    //     //     {
    //     //         headers: {
    //     //             Authorization: `bearer ${token}`
    //     //         }
    //     //     });
    //     //sửa
    //     const response = await post(url, dataRequest);
    //     if (response.status === 200) {
    //         dispatch({
    //             type: 'MOMO_PAYMENT_SUCCESS',
    //             payload: {
    //                 data: ret.data
    //             }
    //         });
    //     } else {
    //         dispatch({
    //             type: 'MOMO_PAYMENT_FAILURE',
    //             payload: {
    //                 data: response.message
    //             }
    //         });
    //     }

    // } catch (error) {
    //     console.log('MOMO_PAYMENT_FAILURE', error);
    //     dispatch({
    //         type: 'MOMO_PAYMENT_FAILURE',
    //         payload: {
    //             data: 'Xảy ra lỗi không xác định'
    //         }
    //     });
    // }
    try{

    }catch{

    }
};

export const resetStateByKey = ({ key, path, value }) => ({
    type: 'MOMO_PAYMENT_RESET_BY_KEY',
    payload: { key, path, value }
});