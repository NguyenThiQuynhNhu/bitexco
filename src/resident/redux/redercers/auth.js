import _ from 'lodash';
import {
  OTP_CODE_REQUEST,
  OTP_CODE_SUCCESS,
  OTP_CODE_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_SUCCESS,
  LOGOUT_REQUEST,
  LOGOUT_FAILURE,
  SIGNIN_SUCCESS,
  SIGNIN_REQUEST,
  SIGNIN_FAILURE,
  CHANGE_PHONE,
  AUTH_RESET_BY_KEY,
  VENDORS_HOME_SUCCESS,
  DEPARMENT_UPDATE_SUCCESS
} from '../../actions/actionTypes';


const INITIAL_STATE = {
  user: null,
  content: 'LOGIN',
  isLoading: false,
  error: null,
  tokenDevice: '',
  language: 'vi',
  towerId: 0,
  orderId: ''
};

export default (state = INITIAL_STATE, action) => {
  //console.log(action)
  switch (action.type) {
    case LOGOUT_SUCCESS: {
      return INITIAL_STATE
    }
    case AUTH_RESET_BY_KEY: {
      if (action.payload.key === 'state') {
        return INITIAL_STATE;
      }
      const newValues = state[action.payload.key];
      return {
        ...state,
        [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
      };
    }
    case OTP_CODE_REQUEST: {
      return {
        ...state,
        isLoading: true,
        error: null
      }
    }
    case OTP_CODE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        content: 'VERIFY'
      }
    }
    case OTP_CODE_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      }
    }
    case CHANGE_PHONE: {
      return {
        ...state,
        content: 'LOGIN',
        error: null
      }
    }
    case SIGNIN_REQUEST: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }
    case SIGNIN_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      }
    }
    case SIGNIN_FAILURE: {
      return {
        ...state,
        error: action.payload.error,
        isLoading: false
      };
    }
    case LOGIN_REQUEST: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }
    case 'SAVE_USER': {
      return {
        ...state,
        user: action.payload
      }
    }
    case LOGIN_SUCCESS: {
      return {
        ...state,
        content: 'LOGIN',
        isLoading: false,
      }
    }
    case LOGIN_FAILURE: {
      return {
        ...state,
        error: action.payload.error,
        isLoading: false
      };
    }
    case 'PROFILE_UPDATE_REQUEST': {
      return {
        ...state,
        isLoading: true,
        error: null
      }
    }
    case 'PROFILE_UPDATE_SUCCESS': {
      return {
        ...state,
        isLoading: false,
        user: {
          ...state.user,
          photoUrl: action.payload.data
        }
      }
    }
    case 'PROFILE_UPDATE_FAILURE': {
      return {
        ...state,
        isLoading: false,
        error: { hasError, error: action.payload.error }
      }
    }
    case 'FCM_SAVE_TOKEN_SUCCESS': {
      return {
        ...state,
        tokenDevice: action.payload
      }
    }
    case VENDORS_HOME_SUCCESS: {
      const { towerId, towerName, spaceMainId, towerLogoUrl, towerHotline, towerAddress } = action.payload.profile
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload.profile
        }
      }
    }
    case DEPARMENT_UPDATE_SUCCESS: {
      return {
        ...state,
        user: {
          ...state.user,
          towerId: action.payload.towerId,
          spaceMainId: action.payload.departmentId
        }
      };
    }

    case 'ORDERID_UPDATE': {
      return {
        ...state,
        orderId: action.payload.orderId
      };
    }
    
    case 'ORDERID_RESET': {
      return {
        ...state,
        orderId: ''
      };
    }

    default:
      return state;
  }
};
