import axios from 'axios';
import { get, helper, post, post2, postViettel } from '../services/helper';
import Base64 from 'crypto-js/enc-base64';
import {
    PAYMENTHIS_GETLIST_REQUEST,
    PAYMENTHIS_GETLIST_FAILURE,
    PAYMENTHIS_GETLIST_SUCCESS,
    PAYMENTHIS_GETLIST_RESET_BY_KEY,
    PAYMENTHIS_GETLIST_REFRESHING
} from './actionTypes';
export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest);
        dispatch({ type: PAYMENTHIS_GETLIST_REQUEST });
        const url = '/Fee/ReceiveHistory';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                dispatch({ type: PAYMENTHIS_GETLIST_SUCCESS, payload: { data: ret.data } });
            }
            else {
                dispatch({ type: PAYMENTHIS_GETLIST_FAILURE, payload: { data: ret.message } });
            }
        }
        else {
            dispatch({ type: PAYMENTHIS_GETLIST_FAILURE, payload: { data: ret.message } });
        }
    } catch (error) {
        dispatch({ type: PAYMENTHIS_GETLIST_FAILURE, payload: { data: 'Xảy ra lỗi không xác định' } });
    }


};
export const refreshDataHandle = () => ({
    type: PAYMENTHIS_GETLIST_REFRESHING
});
export const resetStateByKey = ({ key, path, value }) => ({
    type: PAYMENTHIS_GETLIST_RESET_BY_KEY,
    payload: { key, path, value }
});
export const loadDataHandleEwallet = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest);
        dispatch({ type: 'PAYMENTHIS_EWALLET_GETLIST_REQUEST' });
        const url = `/Fee/GetLichSuGoiThanhToan?tower_id=${dataRequest.tower_id}&space_main_id=${dataRequest.space_main_id}&customer_id=${dataRequest.customer_id}`;
        const ret = await post2(url, dataRequest);
        console.log(ret);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                dispatch({ type: 'PAYMENTHIS_EWALLET_GETLIST_SUCCESS', payload: { data: ret.data } });
            }
            else {
                dispatch({ type: 'PAYMENTHIS_EWALLET_GETLIST_FAILURE', payload: { data: ret.message } });
            }
        }
        else {
            dispatch({ type: 'PAYMENTHIS_EWALLET_GETLIST_FAILURE', payload: { data: ret.message } });
        }
    } catch (error) {
        dispatch({ type: 'PAYMENTHIS_EWALLET_GETLIST_FAILURE', payload: { data: 'Xảy ra lỗi không xác định' } });
    }


};
export const refreshDataHandleEwalle = () => ({
    type: 'PAYMENTHIS_EWALLET_GETLIST_REFRESHING'
});
export const resetStateByKeyEwalle = ({ key, path, value }) => ({
    type: 'PAYMENTHIS_EWALLET_GETLIST_RESET_BY_KEY',
    payload: { key, path, value }
});
export const queryResultsEwalletVietTel = (dataRequest, dataRequestObj) => async (dispatch) => {
    try {
        //console.log(dataRequest);
        dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST' });
        const ret = await postViettel(dataRequest);
        //console.log(ret);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200 && ret.data) {
                if (ret.data.vt_transaction_id) {
                    if (ret.data.payment_status == '-1' || ret.data.payment_status == '2') {
                        dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_SUCCESS', payload: { data: 'Chưa phát sinh giao dịch, không cần hoàn tiền.' } });
                    } else if (ret.data.payment_status == '0' || ret.data.payment_status == '3') {
                        dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_SUCCESS', payload: { data: 'Giao dịch đang chờ xử lý vui lòng thử lại sau. Hoặc liên hệ với ban quản lý.' } });
                    } else if (ret.data.payment_status == '1') {
                        dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_SUCCESS', payload: { data: 'Giao dịch ở cổng thanh toán Viettel thành công!' } });
                        // var CryptoJS = require("crypto-js");
                        // const toHashCheckSum = dataRequestObj.access_code + 'REFUND_PAYMENT' + dataRequestObj.ma_doi_tac + dataRequestObj.order_id + ret.data.vt_transaction_id + '0' + dataRequestObj.trans_amount + '2.0'
                        // let hmacSHA1 = CryptoJS.HmacSHA1(toHashCheckSum, dataRequestObj.hash_key)
                        // let check_sum = Base64.stringify(hmacSHA1)
                        // let dataRefund = `cmd=REFUND_PAYMENT&merchant_code=${dataRequestObj.ma_doi_tac}&order_id=${dataRequestObj.order_id}&originalRequestId=${ret.data.vt_transaction_id}&refundType=0&trans_amount=${dataRequestObj.trans_amount}&trans_content=${dataRequestObj.trans_content}&version=2.0&check_sum=${check_sum}`
                        // try {
                        //     dispatch(queryRefundVietTel(dataRefund))
                        // } catch (error) {
                        //     dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_FAILURE', payload: { data: 'Xảy ra lỗi không xác định trong qua trình truy vấn kết quả giao dịch' } });
                        // }
                    } else {
                        dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_SUCCESS', payload: { data: 'Giao dịch chưa rõ kết quả vui lòng thử lại sau. Hoặc liên hệ với ban quản lý.' } });
                    }

                } else if (ret.data.response) {
                    dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_FAILURE', payload: { data: ret.data.response.message } });
                } else {
                    dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_FAILURE', payload: { data: 'Xảy ra lỗi không xác định trong qua trình truy vấn kết quả giao dịch' } });
                }
            }
            else {
                dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_FAILURE', payload: { data: 'Xảy ra lỗi không xác định trong qua trình truy vấn kết quả giao dịch' } });
            }
        } else {
            dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_FAILURE', payload: { data: 'Xảy ra lỗi không xác định trong qua trình truy vấn kết quả giao dịch' } });
        }
    } catch (error) {
        dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_FAILURE', payload: { data: 'Xảy ra lỗi không xác định trong qua trình truy vấn kết quả giao dịch' } });
    }
};
export const queryRefundVietTel = (dataRequest) => async (dispatch) => {
    try {
        const ret = await postViettel(dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200 && ret.data) {
                if (ret.data.originalRequestId) {
                    dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_SUCCESS', payload: { data: ret.data.error_msg } });

                } else if (ret.data.response) {
                    dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_FAILURE', payload: { data: ret.data.response.message } });
                } else {
                    dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_FAILURE', payload: { data: 'Xảy ra lỗi không xác định trong qua trình hoàn tiền' } });
                }
            } else {
                dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_FAILURE', payload: { data: 'Xảy ra lỗi không xác định trong qua trình hoàn tiền' } });
            }
        } else {
            dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_FAILURE', payload: { data: 'Xảy ra lỗi không xác định trong qua trình hoàn tiền' } });
        }
    } catch (error) {
        dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_FAILURE', payload: { data: 'Xảy ra lỗi không xác định trong qua trình hoàn tiền' } });
    }
};
// export const queryResultsEwalletVietTel = (dataRequest, dataRequestObj) => async (dispatch) => {
//     try {
//         //console.log(dataRequest);
//         dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST' });
//         const ret = await postViettel(dataRequest);
//         //console.log(ret);
//         if (ret !== undefined && ret !== null) {
//             if (ret.status == 200 && ret.data) {
//                 if (ret.data.vt_transaction_id) {
//                     if (ret.data.payment_status == '-1' || ret.data.payment_status == '2') {
//                         dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_SUCCESS', payload: { data: 'Chưa phát sinh giao dịch, không cần hoàn tiền.' } });
//                     } else if (ret.data.payment_status == '0' || ret.data.payment_status == '3') {
//                         dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_SUCCESS', payload: { data: 'Giao dịch đang chờ xử lý vui lòng thử lại sau. Hoặc liên hệ với ban quản lý.' } });
//                     } else if (ret.data.payment_status == '1') {
//                         var CryptoJS = require("crypto-js");
//                         const toHashCheckSum = dataRequestObj.access_code + 'REFUND_PAYMENT' + dataRequestObj.ma_doi_tac + dataRequestObj.order_id + ret.data.vt_transaction_id + '0' + dataRequestObj.trans_amount + '2.0'
//                         let hmacSHA1 = CryptoJS.HmacSHA1(toHashCheckSum, dataRequestObj.hash_key)
//                         let check_sum = Base64.stringify(hmacSHA1)
//                         let dataRefund = `cmd=REFUND_PAYMENT&merchant_code=${dataRequestObj.ma_doi_tac}&order_id=${dataRequestObj.order_id}&originalRequestId=${ret.data.vt_transaction_id}&refundType=0&trans_amount=${dataRequestObj.trans_amount}&trans_content=${dataRequestObj.trans_content}&version=2.0&check_sum=${check_sum}`
//                         try {
//                             dispatch(queryRefundVietTel(dataRefund))
//                         } catch (error) {
//                             dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_FAILURE', payload: { data: 'Xảy ra lỗi không xác định trong qua trình truy vấn kết quả giao dịch' } });
//                         }
//                     } else {
//                         dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_SUCCESS', payload: { data: 'Giao dịch chưa rõ kết quả vui lòng thử lại sau. Hoặc liên hệ với ban quản lý.' } });
//                     }

//                 } else if (ret.data.response) {
//                     dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_FAILURE', payload: { data: ret.data.response.message } });
//                 } else {
//                     dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_FAILURE', payload: { data: 'Xảy ra lỗi không xác định trong qua trình truy vấn kết quả giao dịch' } });
//                 }
//             }
//             else {
//                 dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_FAILURE', payload: { data: 'Xảy ra lỗi không xác định trong qua trình truy vấn kết quả giao dịch' } });
//             }
//         } else {
//             dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_FAILURE', payload: { data: 'Xảy ra lỗi không xác định trong qua trình truy vấn kết quả giao dịch' } });
//         }
//     } catch (error) {
//         dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_FAILURE', payload: { data: 'Xảy ra lỗi không xác định trong qua trình truy vấn kết quả giao dịch' } });
//     }
// };
// export const queryRefundVietTel = (dataRequest) => async (dispatch) => {
//     try {
//         const ret = await postViettel(dataRequest);
//         if (ret !== undefined && ret !== null) {
//             if (ret.status == 200 && ret.data) {
//                 if (ret.data.originalRequestId) {
//                     dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_SUCCESS', payload: { data: ret.data.error_msg } });

//                 } else if (ret.data.response) {
//                     dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_FAILURE', payload: { data: ret.data.response.message } });
//                 } else {
//                     dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_FAILURE', payload: { data: 'Xảy ra lỗi không xác định trong qua trình hoàn tiền' } });
//                 }
//             } else {
//                 dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_FAILURE', payload: { data: 'Xảy ra lỗi không xác định trong qua trình hoàn tiền' } });
//             }
//         } else {
//             dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_FAILURE', payload: { data: 'Xảy ra lỗi không xác định trong qua trình hoàn tiền' } });
//         }
//     } catch (error) {
//         dispatch({ type: 'PAYMENTHIS_TRANS_INQUIRY_VIETTEL_REQUEST_FAILURE', payload: { data: 'Xảy ra lỗi không xác định trong qua trình hoàn tiền' } });
//     }
// };
