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
  CHANGE_PHONE,
  AUTH_RESET_BY_KEY,
  SIGNIN_SUCCESS,
  SIGNIN_REQUEST,
  SIGNIN_FAILURE,
  VENDORS_HOME_SUCCESS,
  DEPARMENT_UPDATE_SUCCESS,
  CHANGEPASS_SUCCESS,
  CHANGEPASS_REQUEST,
  CHANGEPASS_FAILURE
} from '../../actions/actionTypes';


const INITIAL_STATE = {
  user: null,
  content: 'LOGIN',
  isLoading: false,
  error: null,
  tokenDevice: '',
  language: 'vi',
  towerId: 0,
  type: '',
  typeList: [],
  // user: null,
  // content: 'LOGIN',
  // isLoading: false,
  // error: null,
  // tokenDevice: '',
  // language: 'vi',
  // towerId: 0,
  isSurvey: true,
  idNew: 0,
  orderId: '',
  phoneNumber: '',
  otpCode: '',
  Pass: '',
  connectString: 'qzQX0pcmINgPcSNg6beZKbMJ25Nj%2FcTM0TaRTBrQ%2BnhQ0GYALnfogHc5pAe%2FSXpJiQ440qlX5O5xF484uyAeUU4Vk8psIvmcwWyk%2BpQKqexQsQEeTp5tjTByh%2Fz10UBQBPh3VfatsY0SbaxFEUpbEZgarFw%2FVLGUb15XBPewrUN0dNZNKIMCdjKgMxo8cKZ8Ff6HCMru3j8MR%2FZkICXskAackMGWizqab4tLCSH1EcfiHRZO%2B4eASxqAvEP4SSjCe0VIisKebPZ3ir0uanErH0xAkMx4HCa%2BVb5nzM9EZ8o2nXolZpNnd2gBzwFPq2fiz3wyv%2FvUBRLQBMCAp33rgdRbt7%2BSBp3Uw%2BSc%2Foif9h%2BDtq3EBX0RaYPgeaTaq1Naoa16zVvgQad2ihvyUPN4mA%3D%3D'
};

export default (state = INITIAL_STATE, action) => {
  //console.log('state', state)
  switch (action.type) {
    case 'LOGOUT_SUCCESS': {
      return INITIAL_STATE
    }
    case 'CHANGEPASS_START': {
      return {
        ...state,
        error: null
      }
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
        user: action.payload,
        content: '',
        isLoading: false
      }
    }
    case 'SAVE_USER2': {
      return {
        ...state,
        user: action.payload,
        content: '',
        isLoading: false
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
        content: 'LOGIN',
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
        error: { hasError: true, error: action.payload.error }
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

    case 'GET_TYPE_SUCCESS': {
      return {
        ...state,
        type: action.payload.data,
      };
    }

    case 'GET_TYPELIST_SUCCESS': {
      return {
        ...state,
        typeList: action.payload.data
      };
    }

    case 'SELECT_TYPE': {
      return {
        ...state,
        isLoading: false,
        content: 'SELECT_TYPE',
        error: null
      };
    }
    case 'SAVE_USER_LOGIN': {
      return {
        ...state,
        phoneNumber: action.payload.phoneNumber,
        otpCode: action.payload.otpCode,
        Pass: action.payload.password,
        //connectString: action.payload.connectString
        idNew: action.payload.idNew
        
      };
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

    case CHANGEPASS_REQUEST: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }
    case CHANGEPASS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        content: CHANGEPASS_SUCCESS
      }
    }
    case CHANGEPASS_FAILURE: {
      return {
        ...state,
        error: action.payload.error,
        isLoading: false,
        content: CHANGEPASS_FAILURE
      };
    }
    case 'CHECK_ANSWER_SURVEY': {
      return {
        ...state,
        isSurvey: action.payload
      };
    }
    case 'SAVE_TOWERS_TOPIC': {
      return {
        ...state,
        user: { ...state.user, towers: action.payload.towers}
      };
    }
    default:
      return state;
  }

  
};
