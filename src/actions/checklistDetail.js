import { get, post } from '../services/helper';
import {
    CHECKLIST_DETAIL_REQUEST,
    CHECKLIST_DETAIL_SUCCESS,
    CHECKLIST_DETAIL_FAILURE,
    CHECKLIST_DETAIL_REFRESHING,
} from './actionTypes';


export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log('dataRequestC', dataRequest);
        dispatch({ type: CHECKLIST_DETAIL_REQUEST });
        const url = '/Vendors/Checklist/Detail';
        const ret = await get(url, dataRequest);
        //console.log('ret', ret);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                //console.log('ret.data', ret.data);
                dispatch({ type: CHECKLIST_DETAIL_SUCCESS, payload: { data: ret.data } });
            }
            else {
                dispatch({ type: CHECKLIST_DETAIL_FAILURE });
            }
        }
        else {
            dispatch({ type: CHECKLIST_DETAIL_FAILURE });
        }
    } catch (error) {
        dispatch({ type: CHECKLIST_DETAIL_FAILURE });
    }
};

export const updateHandle = (params) => async (dispatch) => {
    dispatch({ type: 'CHECKLIST_DETAIL_SETPROPS', payload: { errorUpdate: null } });
    dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: true } });
    const url = '/Vendors/Checklist/Update';
    const ret = await post(url, params);
    if (ret === -1) {
        dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: false } });
        dispatch({ type: 'CHECKLIST_DETAIL_SETPROPS', payload: { errorUpdate: { hasError: true } } });
    } else {
        dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: false } });
        dispatch({
            type: 'CHECKLIST_DETAIL_UPDATE_SUCCESS', payload: {
                errorUpdate: { hasError: false },
                 data: ret.data 
            }
        });

        if(!params.isNormal){
            const dataItemToList = {
                id: params.checklistId,
                isUnNormal: !params.isNormal
            };
    
            dispatch({
                type: 'CHECKLIST_UPDATE_ITEM_TOLIST_UNNORMAL',
                payload: {
                    data: dataItemToList,
                    typeAction: 'UPDATE'
                }
            });
        }
    }
};

export const updatePropertyHandle = (params) => async (dispatch) => {
    dispatch({ type: 'CHECKLIST_DETAIL_SETPROPS', payload: { errorUpdate: null } });
    dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: true } });
    const url = '/Vendors/Checklist/UpdateProperty';
    const ret = await post(url, params);
    if (ret === -1) {
        dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: false } });
        dispatch({ type: 'CHECKLIST_DETAIL_SETPROPS', payload: { errorUpdate: { hasError: true } } });
    } else {
        dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: false } });
        dispatch({
            type: 'CHECKLIST_DETAIL_UPDATE_SUCCESS', payload: {
                errorUpdate: { hasError: false },
                 data: ret.data 
            }
        });
    }
};

export const updateStatusHandle = (params) => async (dispatch) => {
    dispatch({ type: 'CHECKLIST_DETAIL_SETPROPS', payload: { errorUpdate: null } });
    dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: true, isReload: false } });
    const url = '/Vendors/Checklist/UpdateStatus';
    const ret = await post(url, params);
    if (ret === -1) {
        dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: false } });
        dispatch({ type: 'CHECKLIST_DETAIL_SETPROPS', payload: { errorUpdate: { hasError: true } } });
    } else {
        dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: false } });
        dispatch({
            type: 'CHECKLIST_DETAIL_UPDATE_STATUS_SUCCESS', payload: {
                errorUpdate: { hasError: false },
                 data: ret.data 
            }
        });

        const statusName = '';
        switch(params.statusId){
            case 0: 
            case 102: 
                statusName = 'Mới'; 
            break;

            case 1:
            case 101: 
                statusName = 'Đang thực hiện'; 
            break;

            case 2: statusName = 'Chờ duyệt'; break;
            case 3: statusName = 'Chờ duyệt'; break;
            case 4: statusName = 'Đã huỷ'; break;
        }

        const dataItemToList = {
            id: params.id,
            status: statusName
        };

          dispatch({
            type: 'CHECKLIST_UPDATE_ITEM_TOLIST',
            payload: {
              data: dataItemToList,
              typeAction: 'UPDATE'
            }
          });
    }
};

export const insertProposalHandle = (params) => async (dispatch) => {
    dispatch({ type: 'CHECKLIST_DETAIL_SETPROPS', payload: { errorUpdate: null } });
    dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: true } });
    const url = '/Vendors/Proposal/Insert';
    const ret = await post(url, params);
    if (ret === -1) {
        dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: false } });
        dispatch({ type: 'CHECKLIST_DETAIL_SETPROPS', payload: { errorUpdate: { hasError: true } } });
    } else {
        dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: false } });
        dispatch({
            type: 'CHECKLIST_DETAIL_INSERT_PROPOSAL_SUCCESS', payload: {
                errorUpdate: { hasError: false }
            }
        });
    }
};

export const refreshDataHandle = () => ({
    type: CHECKLIST_DETAIL_REFRESHING
});

export const resetStateByKey = (payload) => ({
    type: 'CHECKLIST_DETAIL_SETPROPS',
    payload
});