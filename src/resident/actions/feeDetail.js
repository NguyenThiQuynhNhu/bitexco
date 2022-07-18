import axios from 'axios';
import { get, helper, post } from '../services/helper';
import {getProfilePayment} from '../../actions/auth';
import {
    FEE_DETAIL_REQUEST,
    FEE_DETAIL_FAILURE,
    FEE_DETAIL_SUCCESS,
    FEE_DETAIL_RESET_BY_KEY,
    FEE_DETAIL_REFRESHING
} from './actionTypes';
import firebase from 'firebase';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest);
        dispatch({ type: FEE_DETAIL_REQUEST });
        const url = '/Fee/DebitNote';
        const ret = await get(url, dataRequest);
        console.log(ret);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                //dispatch(getProfilePayment({ phoneNumber: dataRequest.phoneNumber, password : dataRequest.password,  type: 're', idNew: dataRequest.idNew }))
                if (ret.data.debitNote && ret.data.debitNote.trim() != '') {
                    try {
                        const responseBillcode = await post('/Fee/GetBillCode',
                        {
                            ma_toa_nha: dataRequest.ma_toa_nha,
                            ma_khach_hang: dataRequest.ma_khach_hang,
                            ma_mat_bang: dataRequest.ma_mat_bang,
                            nam: ret.data.debitNote.slice(ret.data.debitNote.indexOf("/")+1, ret.data.debitNote.length),
                            thang: ret.data.debitNote.slice(0, ret.data.debitNote.indexOf("/"))
                        });
                        console.log('GetBillCode', responseBillcode);
                        if (responseBillcode !== undefined && responseBillcode !== null) {
                            if (responseBillcode.status == 200) {
                                dispatch({ type: 'FEE_DETAIL_BILLCODE_SUCCESS', payload: { billCode: responseBillcode.data } });
                            }else {
                            dispatch({ type: 'FEE_DETAIL_BILLCODE_FAILURE' });
                        }
                        }else {
                            dispatch({ type: 'FEE_DETAIL_BILLCODE_FAILURE' });
                        }
                    }catch (error) {
                        console.log(error)
                        dispatch({ type: 'FEE_DETAIL_BILLCODE_FAILURE' });
                    }
                }else {
                    dispatch({ type: 'FEE_DETAIL_BILLCODE_FAILURE' });
                }
                dispatch({ type: FEE_DETAIL_SUCCESS, payload: { data: ret.data } });
                dispatch({ type: 'ORDERID_UPDATE', payload: { orderId: ret.data.orderId } });
            }
            else {
                dispatch({ type: FEE_DETAIL_FAILURE });
            }
        }
        else {
            dispatch({ type: FEE_DETAIL_FAILURE });
        }
    } catch (error) {
        console.log(error)
        dispatch({ type: FEE_DETAIL_FAILURE });
    }
};
export const savePaymentViettelHandle = (dataRequest) => async (dispatch) => {
    try{
        const response = await post('/Fee/SaveLichSuGoiThanhToan', dataRequest);
        console.log(response)
        if (response.status === 200) {
            if(response.data[0] == '1'){
                dispatch({
                    type: 'SAVE_PAYMENT_SUCCESS'
                });
            }else{
                dispatch({
                    type: 'SAVE_PAYMENT_FAILURE',
                });
            }
        } else {
            dispatch({
                type: 'SAVE_PAYMENT_FAILURE',
            });
        }
    }catch (error){
        console.log(error)
        dispatch({
            type: 'SAVE_PAYMENT_FAILURE',
        });
    }
}
export const saveTokenMomoHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest)
        dispatch({ type: 'MOMO_PAYMENT_REQUEST' });
        const token = await firebase.auth().currentUser.getIdToken();
        const url = `/PaymentEWallet/Momo/SaveToken`;
        // const response = await axios.post(url,
        //     dataRequest,
        //     {
        //         headers: {
        //             Authorization: `bearer ${token}`
        //         }
        //     });
        //sửa
        const response = await post(url, dataRequest);
        if (response.status === 200) {
            dispatch({
                type: 'MOMO_PAYMENT_SUCCESS',
                payload: {
                    data: response.data
                }
            });
        } else {
            dispatch({
                type: 'MOMO_PAYMENT_FAILURE',
                payload: {
                    data: response.message
                }
            });
        }

    } catch (error) {
        console.log('MOMO_PAYMENT_FAILURE', error);
        dispatch({
            type: 'MOMO_PAYMENT_FAILURE',
            payload: {
                data: 'Xảy ra lỗi không xác định'
            }
        });
    }
};

export const paymentMomoHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest)
        dispatch({ type: 'MOMO_PAYMENT_REQUEST' });
        const token = await firebase.auth().currentUser.getIdToken();
        const url = `/PaymentEWallet/Momo/Payment`;
        // const response = await axios.post(url,
        //     dataRequest,
        //     {
        //         headers: {
        //             Authorization: `bearer ${token}`
        //         }
        //     });
        //sửa
        const response = await post(url, dataRequest);
        if (response.status === 200) {
            dispatch({
                type: 'MOMO_PAYMENT_SUCCESS',
                payload: {
                    data: response.data
                }
            });

            const dataItemToList = {
                time: dataRequest.debitNote
            };

            dispatch({
                type: 'FEE_UPDATE_ITEM_TOLIST',
                payload: {
                    data: dataItemToList
                }
            });
        } else {
            dispatch({
                type: 'MOMO_PAYMENT_FAILURE',
                payload: {
                    data: response.message
                }
            });
        }

    } catch (error) {
        console.log('MOMO_PAYMENT_FAILURE', error);
        dispatch({
            type: 'MOMO_PAYMENT_FAILURE',
            payload: {
                data: 'Xảy ra lỗi không xác định'
            }
        });
    }
};

export const refreshDataHandle = () => ({
    type: FEE_DETAIL_REFRESHING
});

export const resetStateByKey = ({ key, path, value }) => ({
    type: FEE_DETAIL_RESET_BY_KEY,
    payload: { key, path, value }
});