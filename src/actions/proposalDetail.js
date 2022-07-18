import { get, post } from '../services/helper';
import {
    PROPOSAL_DETAIL_REQUEST,
    PROPOSAL_DETAIL_SUCCESS,
    PROPOSAL_DETAIL_FAILURE,
    PROPOSAL_DETAIL_REFRESHING,
} from './actionTypes';


export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest);
        dispatch({ type: PROPOSAL_DETAIL_REQUEST });
        const url = '/Vendors/Proposal/Detail';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                dispatch({ type: PROPOSAL_DETAIL_SUCCESS, payload: { data: ret.data } });
            }
            else {
                dispatch({ type: PROPOSAL_DETAIL_FAILURE });
            }
        }
        else {
            dispatch({ type: PROPOSAL_DETAIL_FAILURE });
        }
    } catch (error) {
        dispatch({ type: PROPOSAL_DETAIL_FAILURE });
    }
};

export const updateHandle = (params) => async (dispatch) => {
    dispatch({ type: 'PROPOSAL_DETAIL_SETPROPS', payload: { errorUpdate: null } });
    dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: true } });
    const url = '/Vendors/Proposal/Update';
    const ret = await post(url, params);
    if (ret === -1) {
        dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: false } });
        dispatch({ type: 'PROPOSAL_DETAIL_SETPROPS', payload: { errorUpdate: { hasError: true } } });
    } else {
        dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: false } });
        dispatch({
            type: 'PROPOSAL_DETAIL_UPDATE_SUCCESS', payload: {
                errorUpdate: { hasError: false },
                 data: ret.data 
            }
        });
    }
};

export const updateStatusHandle = (params) => async (dispatch) => {
    dispatch({ type: 'PROPOSAL_DETAIL_SETPROPS', payload: { errorUpdate: null } });
    dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: true, isReload: false } });
    const url = '/Vendors/Proposal/Approved';
    const ret = await post(url, params);
    if (ret === -1) {
        dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: false } });
        dispatch({ type: 'PROPOSAL_DETAIL_SETPROPS', payload: { errorUpdate: { hasError: true } } });
    } else {
        dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: false } });
        dispatch({
            type: 'PROPOSAL_DETAIL_UPDATE_STATUS_SUCCESS', payload: {
                errorUpdate: { hasError: false },
                 data: ret.data 
            }
        });

        const statusName = '';
        switch(params.statusId){
            case 0: statusName = 'Chờ duyệt'; break;
            case 1: statusName = 'Đã duyệt'; break;
            case 2: statusName = 'Không duyệt'; break;
        }

        const dataItemToList = {
            id: params.id,
            status: statusName
        };

          dispatch({
            type: 'PROPOSAL_UPDATE_ITEM_TOLIST',
            payload: {
              data: dataItemToList,
              typeAction: 'UPDATE'
            }
          });
    }
};

export const refreshDataHandle = () => ({
    type: PROPOSAL_DETAIL_REFRESHING
});

export const resetStateByKey = (payload) => ({
    type: 'PROPOSAL_DETAIL_SETPROPS',
    payload
});
