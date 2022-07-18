
import { get } from '../services/helper';
import {
REPORT_GROUP_PROGRESS_STATUS_SET_PROPS,
REPORT_GROUP_PROGRESS_STATUS_RERESHING,
REPORT_GROUP_PROGRESS_STATUS_REQUEST,
REPORT_GROUP_PROGRESS_STATUS_SUCCESS,
REPORT_GROUP_PROGRESS_STATUS_FAILURE,
REPORT_GROUP_PROGRESS_RATING_SET_PROPS,
REPORT_GROUP_PROGRESS_RATING_RERESHING,
REPORT_GROUP_PROGRESS_RATING_REQUEST,
REPORT_GROUP_PROGRESS_RATING_SUCCESS,
REPORT_GROUP_PROGRESS_RATING_FAILURE,
REPORT_GROUP_PROGRESS_TIMECOMPLETE_SET_PROPS,
REPORT_GROUP_PROGRESS_TIMECOMPLETE_RERESHING,
REPORT_GROUP_PROGRESS_TIMECOMPLETE_REQUEST,
REPORT_GROUP_PROGRESS_TIMECOMPLETE_SUCCESS,
REPORT_GROUP_PROGRESS_TIMECOMPLETE_FAILURE
} from '../actions/actionTypes';




export const loadDataGroupProgressStatus = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest);
        dispatch({ type: REPORT_GROUP_PROGRESS_STATUS_REQUEST });
        const ret = await get('/Vendors/ReportGroupProcess/Status', dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
               // console.log(ret.data)
                dispatch({ type: REPORT_GROUP_PROGRESS_STATUS_SUCCESS, payload: { data: ret.data } });
            }
            else {
                dispatch({ type: REPORT_GROUP_PROGRESS_STATUS_FAILURE, payload: { data: ret.message } });
            }
        }
        else {
            dispatch({ type: REPORT_GROUP_PROGRESS_STATUS_FAILURE, payload:{data: ret.message} });
        }
    } catch (error) {
        dispatch({ type: REPORT_GROUP_PROGRESS_STATUS_FAILURE, payload:{data: 'Xảy ra lỗi không xác định'} });
    }
};
export const loadDataGroupProgressRating = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest);
        dispatch({ type: REPORT_GROUP_PROGRESS_RATING_REQUEST });
        const ret = await get('/Vendors/ReportGroupProcess/Rating', dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
              //  console.log(ret.data)
                dispatch({ type: REPORT_GROUP_PROGRESS_RATING_SUCCESS, payload: { data: ret.data } });
            }
            else {
                dispatch({ type: REPORT_GROUP_PROGRESS_STATUS_FAILURE, payload: { data: ret.message } });
            }
        }
        else {
            dispatch({ type: REPORT_GROUP_PROGRESS_RATING_FAILURE, payload:{data: ret.message} });
        }
    } catch (error) {
        dispatch({ type: REPORT_GROUP_PROGRESS_RATING_FAILURE, payload:{data: 'Xảy ra lỗi không xác định'} });
    }
};
export const loadDataGroupProgressTimeComplete = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest);
        dispatch({ type: REPORT_GROUP_PROGRESS_TIMECOMPLETE_REQUEST });
        const ret = await get('/Vendors/ReportGroupProcess/TimeComplete', dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
              //  console.log(ret.data)
                dispatch({ type: REPORT_GROUP_PROGRESS_TIMECOMPLETE_SUCCESS, payload: { data: ret.data } });
            }
            else {
                dispatch({ type: REPORT_GROUP_PROGRESS_TIMECOMPLETE_FAILURE, payload: { data: ret.message } });
            }
        }
        else {
            dispatch({ type: REPORT_GROUP_PROGRESS_TIMECOMPLETE_FAILURE, payload:{data: ret.message} });
        }
    } catch (error) {
        dispatch({ type: REPORT_GROUP_PROGRESS_TIMECOMPLETE_FAILURE, payload:{data: 'Xảy ra lỗi không xác định'} });
    }
};

export const statusSetProps = (payload) => (dispatch) => {
    dispatch({ type: REPORT_GROUP_PROGRESS_STATUS_SET_PROPS, payload });
}

export const statusRefreshDataHandle = (payload) => (dispatch) => {
    dispatch({ type: REPORT_GROUP_PROGRESS_STATUS_RERESHING, payload });
}

export const ratingSetProps = (payload) => (dispatch) => {
    dispatch({ type: REPORT_GROUP_PROGRESS_RATING_SET_PROPS, payload });
}

export const ratingRefreshDataHandle = (payload) => (dispatch) => {
    dispatch({ type: REPORT_GROUP_PROGRESS_RATING_RERESHING, payload });
}

export const timeSetProps = (payload) => (dispatch) => {
    dispatch({ type: REPORT_GROUP_PROGRESS_TIMECOMPLETE_SET_PROPS, payload });
}

export const timeRefreshDataHandle = (payload) => (dispatch) => {
    dispatch({ type: REPORT_GROUP_PROGRESS_TIMECOMPLETE_RERESHING, payload });
}

