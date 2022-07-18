import _ from 'lodash';
import moment from 'moment';
import { converTypeToColor } from '../../utils/shifts'


const INITIAL_STATE = {
    isRefreshing: false,
    isLoading: false,
    data: [],
    error: null,
    markedDates: null,
    errorCreate: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case 'SHIFTS_CHOICE_SET_PROPS': {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            return {
                ...state,
                ...action.payload
            };
        }
        case 'SHIFTS_CHOICE_GETLIST_REQUEST': {
            return {
                ...state,
                isLoading: true,
                error: INITIAL_STATE.error
            };
        }
        case 'SHIFTS_CHOICE_GETLIST_SUCCESS': {
            let markedDates = {}
            action.payload.data.forEach(o => {
                const date = moment(o.date).format('YYYY-MM-DD')
                const isOff = o.isOff === 0 ? 4 : 1;
                markData = {
                    [date]: {
                        marked: true,
                        dotColor: converTypeToColor(isOff),//converTypeToColor(o.typeId),
                    }
                }
                markedDates = _.merge(markedDates, markData)
            });
            return {
                ...state,
                isLoading: false,
                isRefreshing: false,
                data: action.payload.data,
                markedDates
            };
        }
        case 'SHIFTS_CHOICE_GETLIST_FAILURE': {
            return {
                ...state,
                isLoading: false,
                isRefreshing: false,
                error: {
                    message: 'Xảy ra lỗi'
                }
            };
        }
        default:
            return state;
    }
};