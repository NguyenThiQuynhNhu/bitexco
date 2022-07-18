import axios from 'axios';
import {
    NAV_HOME,
    NAV_LOGIN,
    NAV_VENDOR_DETAIL,
    NAV_VENDOR_INFO,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE
} from './actionTypes';


export const navHome = (payload) => ({
    type: NAV_HOME,
    payload
})
export const navLogIn = (payload) => ({
    type: NAV_LOGIN,
    payload
})

export const navVendorDetail = (payload) => ({
    type: NAV_VENDOR_DETAIL,
    payload
})
export const navVendorInfo = (payload) => ({
    type: NAV_VENDOR_INFO,
    payload
})