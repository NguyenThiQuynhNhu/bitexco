
import { get } from '../services/helper';
import {
    REPORT_GENERAL_GETLIST_RESET_BY_KEY,
    REPORT_GENERAL_LOAD_DATA_REFRESHING,
    REPORT_GENERAL_LOAD_DATA_REQUEST,
    REPORT_GENERAL_LOAD_DATA_SUCCESS,
    REPORT_GENERAL_LOAD_DATA_FAILURE,

} from '../actions/actionTypes';

export const getGeneralReport = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest);
        dispatch({ type: REPORT_GENERAL_LOAD_DATA_REQUEST });
        const url = '/Vendors/ReportRequest';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
               // console.log(ret.data)
                dispatch({ type: REPORT_GENERAL_LOAD_DATA_SUCCESS, payload: { data: ret.data } });
            }
            else {
                dispatch({ type: REPORT_GENERAL_LOAD_DATA_FAILURE, payload: { data: ret.message } });
            }
        }
        else {
            dispatch({ type: REPORT_GENERAL_LOAD_DATA_FAILURE, payload:{data: ret.message} });
        }
    } catch (error) {
        dispatch({ type: REPORT_GENERAL_LOAD_DATA_FAILURE, payload:{data: 'Xảy ra lỗi không xác định'} });
    }
};

export const getEmployeeByDepartment = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest);
        dispatch({ type: 'EMPLOYEE_LOADDATA_REQUEST' });
        const url = '/Vendors/DepartmmentEmployee';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {

                dispatch({ type: 'EMPLOYEE_LOADDATA_SUCCESS', payload: { data: ret.data } });
            }
            else {
                dispatch({ type: 'EMPLOYEE_LOADDATA_FAILURE' });
            }
        }
        else {
            dispatch({ type: 'EMPLOYEE_LOADDATA_FAILURE' });
        }
    } catch (error) {
        dispatch({ type: 'EMPLOYEE_LOADDATA_FAILURE' });
    }
};

export const getDepartment = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest);
        dispatch({ type: 'DEPARTMENT_LOADDATA_REQUEST' });
        const url = '/Vendors/DepartmentList';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {

                dispatch({ type: 'DEPARTMENT_LOADDATA_SUCCESS', payload: { data: ret.data } });
            }
            else {
                dispatch({ type: 'DEPARTMENT_LOADDATA_FAILURE' });
            }
        }
        else {
            dispatch({ type: 'DEPARTMENT_LOADDATA_FAILURE' });
        }
    } catch (error) {
        dispatch({ type: 'DEPARTMENT_LOADDATA_FAILURE' });
    }
};

export const getBlock = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest);
        dispatch({ type: 'BLOCK_LOADDATA_REQUEST' });
        const url = 'Vendors/Appartment/BlockList';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {

                dispatch({ type: 'BLOCK_LOADDATA_SUCCESS', payload: { data: ret.data } });
            }
            else {
                dispatch({ type: 'BLOCK_LOADDATA_FAILURE' });
            }
        }
        else {
            dispatch({ type: 'BLOCK_LOADDATA_FAILURE' });
        }
    } catch (error) {
        dispatch({ type: 'BLOCK_LOADDATA_FAILURE' });
    }
};

export const getGroupWorkingReport = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest);
        dispatch({ type: REPORT_GENERAL_LOAD_DATA_REQUEST });
        const url = '/Vendors/ReportGroupProcess/Status';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
              //  console.log(ret.data)
                dispatch({ type: REPORT_GENERAL_LOAD_DATA_SUCCESS, payload: { data: ret.data } });
            }
            else {
                dispatch({ type: REPORT_GENERAL_LOAD_DATA_FAILURE, payload: { data: ret.message } });
            }
        }
        else {
            dispatch({ type: REPORT_GENERAL_LOAD_DATA_FAILURE, payload:{data: ret.message} });
        }
    } catch (error) {
        dispatch({ type: REPORT_GENERAL_LOAD_DATA_FAILURE, payload:{data: 'Xảy ra lỗi không xác định'} });
    }
};
export const resetData = (payload) => (dispatch) => {
    dispatch({ type: REPORT_GENERAL_GETLIST_RESET_BY_KEY, payload });
}

export const refreshDataHandle = (payload) => (dispatch) => {
    dispatch({ type: REPORT_GENERAL_LOAD_DATA_REFRESHING, payload });
}

