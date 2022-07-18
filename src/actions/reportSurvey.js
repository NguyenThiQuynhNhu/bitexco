
import axios from 'axios';
import { get, helper, post } from '../services/helper';

export const loadDataHandle = (dataRequest) => async (dispatch) => {

    try {
        //console.log(dataRequest);
        dispatch({ type: 'SURVERY_REPORT_GETLIST_REQUEST' });
        const url = '/Report/GetList';
        const ret = await get(url, dataRequest);
        //console.log(ret);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                await dispatch({
                    type: 'SURVERY_REPORT_GETLIST_SUCCESS',
                    payload: {
                        data: ret.data
                    }
                })
            }
            else {
                dispatch({ type: 'SURVERY_REPORT_GETLIST_FAILURE' });
            }
        }
        else {
            dispatch({ type: 'SURVERY_REPORT_GETLIST_FAILURE' });
        }
    } catch (error) {
        dispatch({ type: 'SURVERY_REPORT_GETLIST_FAILURE' });
    }
};
export const refreshDataHandle = () => ({
    type: 'SURVERY_REPORT_GETLIST_REFRESHING'
});
export const resetStateByKey = ({ key, path, value }) => ({
    type: 'SURVERY_REPORT_GETLIST_RESET_BY_KEY',
    payload: { key, path, value }
});
