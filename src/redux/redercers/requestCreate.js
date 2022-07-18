
import _ from 'lodash';
import {
    REQUEST_CREATE_REQUEST,
    REQUEST_CREATE_FAILURE,
    REQUEST_CREATE_SUCCESS
} from '../../actions/actionTypes';

const INITIAL_STATE = {
    isLoading: false,
    error: null,
    vendorSelected: {
        id: 0,
        name: 'Chọn nhà cung cấp'
    },
    depSelected: {
        id: 0,
        name: 'Chọn ban tiếp nhận'
    },
    contractSelected: {
        id: 0,
        name: 'Hợp đồng'
    },
    title: '',
    content: '',
    userContact: '',
    phoneContact: '',
    time: '',
    day: '',
    imagesInformation: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case REQUEST_CREATE_REQUEST: {
            return {
                ...state,
                isLoading: true,
                error: { hasError: false, status: 0 }
            }
        }
        case REQUEST_CREATE_FAILURE: {
            return {
                ...state,
                isLoading: false,
                error: { hasError: true, status: action.payload.status }
            }
        }
        case REQUEST_CREATE_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                error: { hasError: false, status: action.payload.status }
            };
        }

        case 'REQUESTS_CREATE_RESET_BY_KEY': {
            if (action.payload.key == 'state') {
                return INITIAL_STATE;
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
            };
        }
        case 'REQUEST_CREATE_VENDOR_SELECTED': {
            return {
                ...state,
                vendorSelected: action.payload,
                contractSelected: INITIAL_STATE.contractSelected,
                depSelected: INITIAL_STATE.depSelected
            }
        }
        case 'SAVE_USER': {
            return {
                ...state,
                userContact: action.payload.fullName,
                phoneContact: action.payload.phoneNumber
            }
        }

        default:
            return state;
    }
};