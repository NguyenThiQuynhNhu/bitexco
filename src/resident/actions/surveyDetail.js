import axios from 'axios';
import { get, helper, post } from '../services/helper';

export const loadDataHandle = (dataRequest) => async (dispatch) => {

    try {
        //console.log(dataRequest);
        dispatch({ type: 'SURVERY_DETAIL_GETLIST_REQUEST' });
        const url = '/Question/GetList';
        const ret = await get(url, dataRequest);
        //console.log(ret);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                await dispatch({
                    type: 'SURVERY_DETAIL_GETLIST_SUCCESS',
                    payload: {
                        data: ret.data
                    }
                })
            }
            else {
                dispatch({ type: 'SURVERY_DETAIL_GETLIST_FAILURE' });
            }
        }
        else {
            dispatch({ type: 'SURVERY_DETAIL_GETLIST_FAILURE' });
        }
    } catch (error) {
        dispatch({ type: 'SURVERY_DETAIL_GETLIST_FAILURE' });
    }
};
export const refreshDataHandle = () => ({
    type: 'SURVERY_DETAIL_GETLIST_REFRESHING'
});
export const resetStateByKey = ({ key, path, value }) => ({
    type: 'SURVERY_DETAIL_GETLIST_RESET_BY_KEY',
    payload: { key, path, value }
});
export const insSurveyHandle = (dataRequest) => async (dispatch) => {
    dispatch({ type: 'SURVEY_INS_REQUEST' });
    try {
        const response = await post(`/Answer/Insert`, dataRequest);
        //console.log(response);
        if (response) {
            if (response.status === 200) {
                dispatch({
                    type: 'SURVEY_INS_SUCCESS',
                    payload: {
                        data: response.data
                    }
                });
            } else {
                dispatch({
                    type: 'SURVEY_INS_FAILURE',
                    payload: {
                        data: response.message
                    }
                });
            }
        } else {
            dispatch({
                type: 'SURVEY_INS_FAILURE',
                payload: {
                    data: response.message
                }
            });
        }
    } catch (error) {
        console.log(error);
        dispatch({
            type: 'SURVEY_INS_FAILURE',
            payload: {
                data: 'Xảy ra lỗi không xác định'
            }
        });
    }
};
export const checkAnswerSurvey = (value) => ({
    type: 'CHECK_ANSWER_SURVEY',
    payload: value
});
