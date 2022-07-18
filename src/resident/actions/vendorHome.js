
import { get } from '../services/helper';
import {
    VENDORS_HOME_RESET_BY_KEY,
    VENDORS_HOME_REQUEST,
    VENDORS_HOME_SUCCESS,
    VENDORS_HOME_FAILURE
} from './actionTypes';


export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest);
        dispatch({ type: VENDORS_HOME_REQUEST });
        const url = '/Residents/TowerHome';
        const ret = await get(url, dataRequest);
        console.log(ret)
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                
                dispatch({ type: VENDORS_HOME_SUCCESS, payload: { data: ret.data } });
            }
            else {
               // console.log(ret.message)
                dispatch({ type: VENDORS_HOME_FAILURE, payload: { data: ret.message } });
            }
        }
        else {
            dispatch({ type: VENDORS_HOME_FAILURE });
        }
    } catch (error) {
        dispatch({ type: VENDORS_HOME_FAILURE });
    }


};

export const resetStateByKey = ({ key, value }) => ({
    type: VENDORS_HOME_RESET_BY_KEY,
    payload: { key, value }
});