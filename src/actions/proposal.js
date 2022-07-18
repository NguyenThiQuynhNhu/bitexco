import { get } from '../services/helper';
import {
    PROPOSAL_GETLIST_REQUEST,
    PROPOSAL_GETLIST_SUCCESS,
    PROPOSAL_GETLIST_FAILURE,
    PROPOSAL_GETLIST_REFRESHING,
    PROPOSAL_GETLIST_RESET_BY_KEY,
    PROPOSAL_GET_TOTAL_STATUS_REQUEST,
    PROPOSAL_GET_TOTAL_STATUS_SUCCESS,
    PROPOSAL_GET_TOTAL_STATUS_FAILURE
} from './actionTypes';

export const getRequestStatusTotal = (dataRequest) => async (dispatch) => {
    try {
        dispatch({ type: PROPOSAL_GET_TOTAL_STATUS_REQUEST });
        const url = '/Vendors/RequestStatusTotal';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                //console.log(ret.data)
                dispatch({
                    type: PROPOSAL_GET_TOTAL_STATUS_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
            }
            else {
                dispatch({ type: PROPOSAL_GET_TOTAL_STATUS_FAILURE });
            }
        }
        else {
            dispatch({ type: PROPOSAL_GET_TOTAL_STATUS_FAILURE });
        }
    } catch (error) {
        console.log(error)
        dispatch({ type: PROPOSAL_GET_TOTAL_STATUS_FAILURE });
    }
}
export const loadDataHandle = (dataRequest) => async (dispatch) => {

    try {
        //console.log(dataRequest);
        dispatch({ type: PROPOSAL_GETLIST_REQUEST });
        const url = '/Vendors/Home/ProposalList';
        const ret = await get(url, dataRequest);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                dispatch({
                    type: PROPOSAL_GETLIST_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
            }
            else {
                dispatch({ type: PROPOSAL_GETLIST_FAILURE });
            }
        }
        else {
            dispatch({ type: PROPOSAL_GETLIST_FAILURE });
        }
    } catch (error) {
        dispatch({ type: PROPOSAL_GETLIST_FAILURE });
    }
};
export const refreshDataHandle = () => ({
    type: PROPOSAL_GETLIST_REFRESHING
});
export const resetStateByKey = ({ key, path, value }) => ({
    type: PROPOSAL_GETLIST_RESET_BY_KEY,
    payload: { key, path, value }
});
export const onSubmitEditing = isApplySearchKey => ({
    type: 'PROPOSAL_ON_SUBMIT_EDITING'
})
export const onChangeText = payload => ({
    type: 'PROPOSAL_ON_CHANGE_TEXT',
    payload
})
export const onClearText = payload => ({
    type: 'PROPOSAL_ON_CLEAR_TEXT',
    payload
})

export const onSelectedStatus = payload => ({
    type: 'ON_STATUS_CHANGE',
    payload
})

export const onFilter = payload => ({
    type: 'ON_FILTER',
    payload
})

export const onClearFilter = () => ({
    type: 'ON_CLEAR_FILTER'
})
