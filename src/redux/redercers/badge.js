import _ from 'lodash';
import {
    BADGE_NOTIFY_R_SUCCESS,
    BADGE_REQUEST_R_SUCCESS,
    BADGE_PAYMENT_R_SUCCESS
} from '../../actions/actionTypes';

const INITIAL_STATE = {
    badgeNotifyR: 0,
    badgeRequestR: 0,
    badgePaymentR: 0,
    //badgeNotifyR: 0,

};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'LOGOUT_SUCCESS': {
            return INITIAL_STATE
        }
        
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        
        case BADGE_NOTIFY_R_SUCCESS: {
            return {
                ...state,
                badgeNotifyR: action.payload,
            };
        }
        case BADGE_REQUEST_R_SUCCESS: {
            return {
                ...state,
                badgeRequestR: action.payload,
            };
        }
        case BADGE_PAYMENT_R_SUCCESS: {
            return {
                ...state,
                badgePaymentR: action.payload,
            };
        }
        default:
            return state;
    }
}