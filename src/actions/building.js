import { get, helper, post } from '../services/helper';
import {
    BUILDING_GETLIST_REQUEST,
    BUILDING_GETLIST_SUCCESS,
    BUILDING_GETLIST_FAILURE,
    BUILDING_GETLIST_REFRESHING,
    BUILDING_GETLIST_RESET_BY_KEY
} from './actionTypes';
import axios from 'axios';
export const loadDataHandle = (dataRequest) => async (dispatch) => {

    try {
        console.log(dataRequest);
        dispatch({ type: BUILDING_GETLIST_REQUEST });
        // const url = '/User/GetBuilding';
        // const ret = await post(url, dataRequest);
        let ret = await axios.post(`${helper.URL_API}/User/GetBuilding`,
        {
            "userName": dataRequest.phoneNumber,
            "password": dataRequest.password
          });
          console.log(ret);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                
                // if(ret.data.length == 0){
                //     dispatch({ type: BUILDING_GETLIST_FAILURE });
                // }else{
                    dispatch({
                        type: BUILDING_GETLIST_SUCCESS,
                        payload: {
                            data: ret.data
                        }
                    });
                //}
            }
            else {
                dispatch({ type: BUILDING_GETLIST_FAILURE });
            }
        }
        else {
            dispatch({ type: BUILDING_GETLIST_FAILURE });
        }
    } catch (error) {
        dispatch({ type: BUILDING_GETLIST_FAILURE });
    }
};

export const refreshDataHandle = () => ({
    type: BUILDING_GETLIST_REFRESHING
});

export const resetStateByKey = ({ key, path, value }) => ({
    type: BUILDING_GETLIST_RESET_BY_KEY,
    payload: { key, path, value }
});
