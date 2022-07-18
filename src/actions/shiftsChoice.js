import { get,post} from '../services/helper';


export const setProps = (payload) => ({
    type: 'SHIFTS_DAYLIST_CHOICE_SET_PROPS',
    payload
});

export const shiftsSetProps = (payload) => ({
    type: 'SHIFTS_CHOICE_SET_PROPS',
    payload
});

export const loadDataShiftHandle = (params) => async (dispatch) => {
    dispatch({ type: 'SHIFTS_CHOICE_GETLIST_REQUEST' });
    const url = '/Vendors/Shift/List';
    const ret = await get(url, params);
    //console.log(ret)
    if (ret === -1) {
        dispatch({ type: 'SHIFTS_CHOICE_GETLIST_FAILURE' });
    } else {
        dispatch({
            type: 'SHIFTS_CHOICE_GETLIST_SUCCESS',
            payload: {
                data: ret.data
            }
        });
    }
};

export const loadDataDayListHandle = (params) => async (dispatch) => {
    dispatch({ type: 'SHIFTS_DAYLIST_CHOICE_GETLIST_REQUEST' });
    const url = '/Vendors/Shift/DayList';
    console.log(params)
    const ret = await get(url, params);
    if (ret === -1) {
        dispatch({ type: 'SHIFTS_DAYLIST_CHOICE_GETLIST_FAILURE' });
    } else {
        dispatch({
            type: 'SHIFTS_DAYLIST_CHOICE_GETLIST_SUCCESS',
            payload: {
                data: ret.data
            }
        });
    }
};

export const SheduleTimeInsert = (params) => async (dispatch) => {
    dispatch({ type: 'SHIFTS_CHOICE_SET_PROPS', payload: { errorCreate: null } });
    dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: true } });
    const url = '/Vendors/SheduleTime/Insert';
    const ret = await post(url, params);
    if (ret === -1) {
        dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: false } });
        dispatch({ type: 'SHIFTS_CHOICE_SET_PROPS', payload: { errorCreate: { hasError: true } } });
    } else {
        dispatch({ type: 'APP_RESET_BY_KEY', payload: { isLoading: false } });
        dispatch({ type: 'SHIFTS_CHOICE_SET_PROPS', payload: { errorCreate: { hasError: false } } });
    }
};