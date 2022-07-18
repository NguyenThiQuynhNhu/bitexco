import _ from 'lodash';
import {


    UTILS_TU_NGAY,
    UTILS_DEN_NGAY,
    UTILS_NAME,
    UTILS_DATE,

} from '../../actions/actionTypes';


const INITIAL_STATE = {
    date: [
        // {id:1,Name:'222'}
    ],
    tuNgay:new Date(),
    denNgay:new Date(),
    Name:'Thời gian'
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SAVE_USER': {
            return INITIAL_STATE
        }
        case UTILS_TU_NGAY: {
            return {
                ...state,
                tuNgay:action.payload
            };
        }

        case UTILS_DEN_NGAY: {
            return {
                ...state,
                denNgay:action.payload
            };
        }

        case UTILS_NAME: {
            return {
                ...state,
                Name:action.payload
            };
        }

        case UTILS_DATE: {
            return {
                ...state,
                date:action.payload
            };
        }

        default: return state;
    }
};
