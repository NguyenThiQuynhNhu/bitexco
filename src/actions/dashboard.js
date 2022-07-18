import { get } from '../services/helper';
import {

} from './actionTypes';

export const setProps = (payload) => ({
    type: 'DASHBOARD_SET_PROPS',
    payload
});

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        dispatch({ type: 'DASHBOARD_GET_REQUEST' });
        const url = '/Vendors/Dashboard';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                //
                dispatch({
                    type: 'DASHBOARD_GET_SUCCESS',
                    payload: {
                        data: ret.data
                    }
                });
            }
            else {
                dispatch({ type: 'DASHBOARD_GET_FAILURE' });
            }
        }
        else {
            dispatch({ type: 'DASHBOARD_GET_FAILURE' });
        }
    } catch (error) {
        console.log(error)
        dispatch({ type: 'DASHBOARD_GET_FAILURE' });
    }
}