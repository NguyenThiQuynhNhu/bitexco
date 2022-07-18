import axios from 'axios';
import firebase from 'firebase';
import { Platform } from 'react-native'
import {
  OTP_CODE_REQUEST,
  REOTP_CODE_REQUEST,
  OTP_CODE_SUCCESS,
  OTP_CODE_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_SUCCESS,
  CHANGE_PHONE,
  CHANGE_STATE_ISLOADING,
  CHANGE_STATE_ERROR,
  AUTH_RESET_BY_KEY,
  SIGNIN_SUCCESS,
  SIGNIN_REQUEST,
  SIGNIN_FAILURE,
  CHANGEPASS_SUCCESS,
  CHANGEPASS_REQUEST,
  CHANGEPASS_FAILURE
} from './actionTypes';
import FCM from 'react-native-fcm';
import AsyncStorage from '@react-native-community/async-storage';
import keys from '../utils/keys'
import apiStorage from '../utils/ApiStorage';
import { get, helper, post } from '../services/helper';
export const resetStateByKey = ({ key, path, value }) => ({
  type: AUTH_RESET_BY_KEY,
  payload: { key, path, value }
});

export const changePhone = () => ({
  type: CHANGE_PHONE
});

export const onAuthUserValid = payload => ({
  type: LOGIN_SUCCESS,
  payload
});

export const onAuthUserInvalid = payload => (dispatch) => {
  dispatch({
    type: LOGOUT_SUCCESS,
    payload
  });
};

export const getOtpCodeHaveType = (phoneNumber, type, isNew = true) => async (dispatch) => {

  if (isNew) {
    dispatch({ type: OTP_CODE_REQUEST });
  } else {
    dispatch({ type: REOTP_CODE_REQUEST });
  }
  try {
    const ret1 = await post(`/accounts/requestOTP`,
      {
        phoneNumber,
        mode: __DEV__ ? 'dev' : '',
        type: type
      });
    if (ret1.status === 200) {
      dispatch({ type: OTP_CODE_SUCCESS });
    } else {
      dispatch({ type: OTP_CODE_FAILURE });
    }
  } catch (error) {
    if (error.response) {
      console.log(error.response)
      if (error.response.status == 400) {
        dispatch({
          type: OTP_CODE_FAILURE,
          payload: {
            error: {
              hasError: true,
              message: 'Số điện thoại chưa được đăng ký'
            }
          }

        });
      }
    } else {
      dispatch({
        type: OTP_CODE_FAILURE,
        payload: {
          error: {
            hasError: true,
            message: 'Có lỗi xảy ra. Vui lòng thử lại'
          }
        }
      });
    }
  }
};
export const getOtpCodeNoType = (phoneNumber, isNew = true) => async (dispatch) => {

  if (isNew) {
    dispatch({ type: OTP_CODE_REQUEST });
  } else {
    dispatch({ type: REOTP_CODE_REQUEST });
  }
  try {
    const ret = await post(`/accounts/LoginPhone`,
      {
        phone: phoneNumber
      });

    if (ret.status === 200 && ret.data != undefined && ret.data.typeItem != undefined && ret.data.typeItem.length == 1) {
      dispatch({
        type: 'GET_TYPE_SUCCESS',
        payload: { data: ret.data.typeItem[0].type }
      });
      dispatch({
        type: 'GET_TYPELIST_SUCCESS',
        payload: { data: ret.data.typeItem }
      });
      dispatch({ type: OTP_CODE_SUCCESS });
      // const ret1 = await axios.post(`${helper.URL_API}/accounts/requestOTP`,
      //   {
      //     phoneNumber,
      //     mode: __DEV__ ? 'dev' : '',
      //     type: ret.data[0].type
      //   });
      // console.log(ret1)
      // if (ret1.status === 200) {
      //   dispatch({ type: OTP_CODE_SUCCESS });
      // } else {
      //   dispatch({ type: OTP_CODE_FAILURE });
      // }
    } else if (ret.status === 200 && ret.data != undefined && ret.data.typeItem != undefined && ret.data.typeItem.length > 1) {
      dispatch({ type: 'SELECT_TYPE' });
      dispatch({
        type: 'GET_TYPELIST_SUCCESS',
        payload: { data: ret.data.typeItem }
      });
    } else {
      dispatch({ type: OTP_CODE_FAILURE });
    }
  } catch (error) {
    if (error.response) {
      console.log(error.response)
      if (error.response.status == 400) {
        dispatch({
          type: OTP_CODE_FAILURE,
          payload: {
            error: {
              hasError: true,
              message: 'Số điện thoại chưa được đăng ký'
            }
          }

        });
      }
    } else {
      dispatch({
        type: OTP_CODE_FAILURE,
        payload: {
          error: {
            hasError: true,
            message: 'Có lỗi xảy ra. Vui lòng thử lại'
          }
        }
      });
    }
  }
};

export const loginUser = ({ phoneNumber, type, otpCode, password }) => async (dispatch) => {
  FCM.getFCMToken().then(async tokenDevice => {
    dispatch({ type: LOGIN_REQUEST });
    try {
      // let response = await axios.post(`${helper.URL_API}/accounts/verifyOTP`,
      //   {
      //     phoneNumber,
      //     otpCode,
      //     type: type,
      //     token: tokenDevice,
      //     os: Platform.OS
      //   });
      let response = await post(`/accounts/verifyOTP`,
        {
          phoneNumber,
          otpCode,
          type: type,
          token: tokenDevice,
          os: Platform.OS
        });
      if (response.status === 200) {
        try {
          dispatch(subscribeToTopics(response.data.towers))
          dispatch({
            type: 'GET_TYPE_SUCCESS',
            payload: { data: type }
          });
          dispatch({ type: 'SAVE_USER_LOGIN', payload: { phoneNumber: phoneNumber, otpCode: otpCode, password: password } });
          dispatch({ type: 'SAVE_USER', payload: response.data, typeUser: type });
          await firebase.auth().signInWithCustomToken(response.data.token);
        }
        catch (error) {
          dispatch({
            type: LOGIN_FAILURE,
            payload: {
              error: {
                hasError: true,
                message: 'Có lỗi xảy ra'
              }
            }

          });
        }
      } else {
        dispatch({
          type: LOGIN_FAILURE,
          payload: {
            error: {
              hasError: true,
              message: 'Có lỗi xảy ra. Vui lòng thử lại'
            }
          }
        });
      }
    } catch (error) {
      console.log('login', error)
      if (error.response) {
        if (error.response.status == 400) {
          dispatch({
            type: LOGIN_FAILURE,
            payload: {
              error: {
                hasError: true,
                message: 'Mã xác thực không đúng'
              }
            }

          });
        }
        else {
          dispatch({
            type: LOGIN_FAILURE,
            payload: {
              error: {
                hasError: true,
                message: 'Có lỗi xảy ra. Vui lòng thử lại'
              }
            }
          });
        }
      } else {
        console.log(error);
        dispatch({
          type: LOGIN_FAILURE,
          payload: {
            error: {
              hasError: true,
              message: 'Có lỗi xảy ra. Vui lòng thử lại'
            }
          }
        });
      }
    }
  });
};

export const loginUserByPass = ({ phoneNumber, password, idNew }) => async (dispatch) => {

  await apiStorage.set(keys.idNew, String(idNew))
    .then(async (data) => {
      if (data.status !== 1) {
        throw Error(data.message)
      }
      else {
        console.log('loginUserByPass', data);
      }
    })
  FCM.getFCMToken().then(async tokenDevice => {
    console.log('loginUserByPass', tokenDevice);
    dispatch({ type: LOGIN_REQUEST });
    //console.log('loginUserByPass', `${helper.URL_API}/accounts/LoginPhone?ConnectString=${connectString}`);
    try {
      const URL_API = helper.URL_API == 'https://apimyhome.dip.vn/api' ?
        `${helper.URL_API}/accounts/LoginPhone?idNew=${idNew}` : `${helper.URL_API}/accounts/LoginPhone?idNew=${idNew}&isPersonal=true`;

      const ret = await axios.post(URL_API,
        //const ret = await axios.post(`${helper.URL_API}/accounts/LoginPhone`,
        {
          phone: phoneNumber
        });
      console.log('loginUserByPass', ret);
      if (ret.status === 200 && ret.data.typeItem.length == 1) {
        dispatch({ type: 'SAVE_USER_LOGIN', payload: { phoneNumber: phoneNumber, otpCode: ret.data.codeOTP, password, idNew } });
        dispatch({
          type: 'GET_TYPELIST_SUCCESS',
          payload: { data: ret.data.typeItem }
        });
        dispatch({
          type: 'GET_TYPE_SUCCESS',
          payload: { data: ret.data.typeItem[0].type }
        });
        if (ret.data.typeItem[0].type == 're') {
          const URL_API = helper.URL_API == 'https://apimyhome.dip.vn/api' ?
            `${helper.URL_API}/Customer/Login?idNew=${idNew}` : `${helper.URL_API}/Customer/Login?idNew=${idNew}&isPersonal=true`;
          let response = await axios.post(URL_API,
            //let response = await axios.post(`${helper.URL_API}/Customer/Login`,
            {
              "phone": phoneNumber,
              "pass": password,
              "token": tokenDevice,
              "os": Platform.OS
            });
          console.log('loginUserByPass', response);
          if (response.status === 200) {
            try {
              //dispatch(subscribeToTopics(response.data.towers))
              dispatch({ type: 'SAVE_USER', payload: response.data, typeUser: ret.data.typeItem[0].type });
              await firebase.auth().signInWithCustomToken(response.data.token);
              //console.log(firebase.auth().signInWithCustomToken(response.data.token))
            }
            catch (error) {
              console.log(error)
              dispatch({
                type: LOGIN_FAILURE,
                payload: {
                  error: {
                    hasError: true,
                    message: 'Có lỗi xảy ra'
                  }
                }

              });
            }
          }
        } else {
          const URL_API = helper.URL_API == 'https://apimyhome.dip.vn/api' ?
            `${helper.URL_API}/accounts/LoginByPass?idNew=${idNew}` : `${helper.URL_API}/accounts/LoginByPass?idNew=${idNew}&isPersonal=true`;
          let response = await axios.post(URL_API,
            //let response = await axios.post(`${helper.URL_API}/accounts/LoginByPass`,
            {
              "phone": phoneNumber,
              "pass": password,
              "type": "em",
              "token": tokenDevice,
              "os": Platform.OS
            });
          if (response.status === 200) {
            try {
              //console.log(response.data)
              dispatch(subscribeToTopics(response.data.towers))
              dispatch({ type: 'SAVE_USER', payload: response.data, typeUser: ret.data.typeItem[0].type });
              await firebase.auth().signInWithCustomToken(response.data.token);
            }
            catch (error) {
              dispatch({
                type: LOGIN_FAILURE,
                payload: {
                  error: {
                    hasError: true,
                    message: 'Có lỗi xảy ra'
                  }
                }

              });
            }
          }
        }
      } else if (ret.status === 200 && ret.data.typeItem.length > 1) {
        dispatch({ type: 'SAVE_USER_LOGIN', payload: { phoneNumber: phoneNumber, otpCode: ret.data.codeOTP, password, idNew } });
        dispatch({
          type: 'GET_TYPELIST_SUCCESS',
          payload: { data: ret.data.typeItem }
        });
        dispatch({ type: 'SELECT_TYPE' });
      } else {
        dispatch({
          type: LOGIN_FAILURE,
          payload: {
            error: {
              hasError: true,
              message: error.response.data.message
            }
          }

        });
      }


    } catch (error) {
      console.log('error.response', error);
      if (error.response) {
        if (error.response.status == 400) {
          dispatch({
            type: LOGIN_FAILURE,
            payload: {
              error: {
                hasError: true,
                message: error.response.data.message
              }
            }

          });
        }
        else {
          dispatch({
            type: LOGIN_FAILURE,
            payload: {
              error: {
                hasError: true,
                message: 'Có lỗi xảy ra. Vui lòng thử lại'
              }
            }
          });
        }
      } else {
        //console.log(error);
        dispatch({
          type: LOGIN_FAILURE,
          payload: {
            error: {
              hasError: true,
              message: 'Có lỗi xảy ra. Vui lòng thử lại'
            }
          }
        });
      }
    }
  });
};
export const loginUserByPassVendor = ({ phoneNumber, password, type, idNew }) => async (dispatch) => {

  FCM.getFCMToken().then(async tokenDevice => {
    dispatch({ type: LOGIN_REQUEST });
    try {
      const URL_API = helper.URL_API == 'https://apimyhome.dip.vn/api' ?
        `${helper.URL_API}/accounts/LoginByPass?idNew=${idNew}` : `${helper.URL_API}/accounts/LoginByPass?idNew=${idNew}&isPersonal=true`;
      let response = await axios.post(URL_API,
        //let response = await axios.post(`${helper.URL_API}/accounts/LoginByPass`,
        {
          "phone": phoneNumber,
          "pass": password,
          "type": "em",
          "token": tokenDevice,
          "os": Platform.OS
        });
      if (response.status === 200) {
        try {
          //console.log(response.data)
          dispatch(subscribeToTopics(response.data.towers))
          dispatch({ type: 'SAVE_USER', payload: response.data, typeUser: type });
          await firebase.auth().signInWithCustomToken(response.data.token);
        }
        catch (error) {
          dispatch({
            type: LOGIN_FAILURE,
            payload: {
              error: {
                hasError: true,
                message: 'Có lỗi xảy ra'
              }
            }

          });
        }
      }
    } catch (error) {
      //console.log(error.response);
      if (error.response) {
        if (error.response.status == 400) {
          dispatch({
            type: LOGIN_FAILURE,
            payload: {
              error: {
                hasError: true,
                message: error.response.data.message
              }
            }

          });
        }
        else {
          dispatch({
            type: LOGIN_FAILURE,
            payload: {
              error: {
                hasError: true,
                message: 'Có lỗi xảy ra. Vui lòng thử lại'
              }
            }
          });
        }
      } else {
        //console.log(error);
        dispatch({
          type: LOGIN_FAILURE,
          payload: {
            error: {
              hasError: true,
              message: 'Có lỗi xảy ra. Vui lòng thử lại'
            }
          }
        });
      }
    }
  });
};
export const loginUserByPassResident = ({ phoneNumber, password, type, idNew }) => async (dispatch) => {
  console.log('loginUserByPassResident');
  FCM.getFCMToken().then(async tokenDevice => {
    dispatch({ type: LOGIN_REQUEST });
    try {
      const URL_API = helper.URL_API == 'https://apimyhome.dip.vn/api' ?
        `${helper.URL_API}/Customer/Login?idNew=${idNew}` : `${helper.URL_API}/Customer/Login?idNew=${idNew}&isPersonal=true`;

      let response = await axios.post(URL_API,
        //let response = await axios.post(`${helper.URL_API}/Customer/Login`,
        {
          "phone": phoneNumber,
          "pass": password,
          "token": tokenDevice,
          "os": Platform.OS
        });
      console.log(response)
      if (response.status === 200) {
        try {
          //dispatch(subscribeToTopics(response.data.towers))
          dispatch({ type: 'SAVE_USER', payload: response.data, typeUser: type });
          await firebase.auth().signInWithCustomToken(response.data.token);
        }
        catch (error) {
          console.log(error)
          dispatch({
            type: LOGIN_FAILURE,
            payload: {
              error: {
                hasError: true,
                message: 'Có lỗi xảy ra'
              }
            }

          });
        }
      }
    } catch (error) {
      console.log(error.response);
      if (error.response) {
        if (error.response.status == 400) {
          dispatch({
            type: LOGIN_FAILURE,
            payload: {
              error: {
                hasError: true,
                message: error.response.data.message
              }
            }

          });
        }
        else {
          dispatch({
            type: LOGIN_FAILURE,
            payload: {
              error: {
                hasError: true,
                message: 'Có lỗi xảy ra. Vui lòng thử lại'
              }
            }
          });
        }
      } else {
        //console.log(error);
        dispatch({
          type: LOGIN_FAILURE,
          payload: {
            error: {
              hasError: true,
              message: 'Có lỗi xảy ra. Vui lòng thử lại'
            }
          }
        });
      }
    }
  });
};
export const getProfilePayment = ({ phoneNumber, password, type, idNew }) => async (dispatch) => {
  console.log('getProfilePayment');
  FCM.getFCMToken().then(async tokenDevice => {
    dispatch({ type: LOGIN_REQUEST });
    try {
      const URL_API = helper.URL_API == 'https://apimyhome.dip.vn/api' ?
        `${helper.URL_API}/Customer/Login?idNew=${idNew}` : `${helper.URL_API}/Customer/Login?idNew=${idNew}&isPersonal=true`;

      let response = await axios.post(URL_API,
        //let response = await axios.post(`${helper.URL_API}/Customer/Login`,
        {
          "phone": phoneNumber,
          "pass": password,
          "token": tokenDevice,
          "os": Platform.OS
        });
      console.log(response)
      if (response.status === 200) {
        try {
          dispatch(subscribeToTopics(response.data.towers))
          dispatch({ type: 'SAVE_USER2', payload: response.data, typeUser: type });
          await firebase.auth().signInWithCustomToken(response.data.token);
        }
        catch (error) {
          dispatch({
            type: LOGIN_FAILURE,
            payload: {
              error: {
                hasError: true,
                message: 'Có lỗi xảy ra'
              }
            }

          });
        }
      }
    } catch (error) {
      console.log(error.response);
      if (error.response) {
        if (error.response.status == 400) {
          dispatch({
            type: LOGIN_FAILURE,
            payload: {
              error: {
                hasError: true,
                message: error.response.data.message
              }
            }

          });
        }
        else {
          dispatch({
            type: LOGIN_FAILURE,
            payload: {
              error: {
                hasError: true,
                message: 'Có lỗi xảy ra. Vui lòng thử lại'
              }
            }
          });
        }
      } else {
        //console.log(error);
        dispatch({
          type: LOGIN_FAILURE,
          payload: {
            error: {
              hasError: true,
              message: 'Có lỗi xảy ra. Vui lòng thử lại'
            }
          }
        });
      }
    }
  });
};
export const signIn = ({ phoneNumber, password }) => async (dispatch) => {
  // FCM.presentLocalNotification({
  //   priority: "high",
  //     lights: true,
  //     //status: 'notif.status',
  //     channel: 'car_status',
  //     number: 0,

  // });
  FCM.getFCMToken().then(async tokenDevice => {
    console.log('signIn')
    dispatch({ type: SIGNIN_REQUEST });
    try {
      // let response = await axios.post(`${helper.URL_API}/Customer/Registry`,
      //   {
      //     "phone": phoneNumber,
      //     "pass": password,
      //   });
      let response = await get(`/Customer/Registry`,
        {
          "phone": phoneNumber,
          "pass": password,
        });
      if (response.status === 200) {
        try {
          dispatch({ type: SIGNIN_SUCCESS });
          dispatch({ type: LOGIN_REQUEST });
          try {
            // let response = await axios.post(`${helper.URL_API}/Customer/Login`,
            //   {
            //     "phone": phoneNumber,
            //     "pass": password,
            //     "token": tokenDevice,
            //     "os": Platform.OS
            //   });
            let response = await post(`/Customer/Login`,
              {
                "phone": phoneNumber,
                "pass": password,
                "token": tokenDevice,
                "os": Platform.OS
              });
            if (response.status === 200) {
              try {
                dispatch({ type: 'SAVE_USER', payload: response.data, typeUser: 're' });
                await firebase.auth().signInWithCustomToken(response.data.token);
              }
              catch (error) {
                //console.log(response)
                dispatch({
                  type: LOGIN_FAILURE,
                  payload: {
                    error: {
                      hasError: true,
                      message: 'Có lỗi xảy ra'
                    }
                  }

                });
              }
            }
          } catch (error) {
            if (error.response) {
              if (error.response.status == 400) {
                //console.log(error.response.data.message)
                dispatch({
                  type: LOGIN_FAILURE,
                  payload: {
                    error: {
                      hasError: true,
                      message: error.response.data.message
                    }
                  }
                });
              }
              else {
                dispatch({
                  type: LOGIN_FAILURE,
                  payload: {
                    error: {
                      hasError: true,
                      message: 'Có lỗi xảy ra. Vui lòng thử lại'
                    }
                  }

                });
              }
            } else {
              //console.log(error);
              dispatch({
                type: LOGIN_FAILURE,
                payload: {
                  error: {
                    hasError: true,
                    message: 'Có lỗi xảy ra. Vui lòng thử lại'
                  }
                }

              });
            }
          }
        }
        catch (error) {
          console.log(response)
          dispatch({
            type: SIGNIN_FAILURE,
            payload: {
              error: {
                hasError: true,
                message: 'Có lỗi xảy ra'
              }
            }

          });
        }
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status == 400) {
          console.log(error.response.data.message)
          dispatch({
            type: SIGNIN_FAILURE,
            payload: {
              error: {
                hasError: true,
                message: error.response.data.message
              }
            }
          });
        }
        else {
          dispatch({
            type: SIGNIN_FAILURE,
            payload: {
              error: {
                hasError: true,
                message: 'Có lỗi xảy ra. Vui lòng thử lại'
              }
            }

          });
        }
      } else {
        //console.log(error);
        dispatch({
          type: SIGNIN_FAILURE,
          payload: {
            error: {
              hasError: true,
              message: 'Có lỗi xảy ra. Vui lòng thử lại'
            }
          }

        });
      }
    }
  });
};

export const changePass = ({ phoneNumber, password }) => async (dispatch) => {
  dispatch({ type: CHANGEPASS_REQUEST });
  try {
    // let response = await axios.post(`${helper.URL_API}/Customer/Registry`,
    // {
    //   "phone": phoneNumber,
    //   "pass": password,
    // });
    let response = await post(`/Customer/Registry`,
      {
        "phone": phoneNumber,
        "pass": password,
      });
    if (response.status === 200) {
      //console.log(response)
      dispatch({ type: CHANGEPASS_SUCCESS });
    } else {
      if (response.status == 400) {
        dispatch({
          type: CHANGEPASS_FAILURE,
          payload: {
            error: {
              hasError: true,
              message: response.data.message
            }
          }
        });
      }
      else {
        dispatch({
          type: CHANGEPASS_FAILURE,
          payload: {
            error: {
              hasError: true,
              message: 'Có lỗi xảy ra. Vui lòng thử lại'
            }
          }

        });
      }
    }
  } catch (error) {
    console.log(error)
    if (error.response) {
      if (error.response.status == 400) {
        console.log(error.response.data.message)
        dispatch({
          type: CHANGEPASS_FAILURE,
          payload: {
            error: {
              hasError: true,
              message: error.response.data.message
            }
          }
        });
      }
      else {
        dispatch({
          type: CHANGEPASS_FAILURE,
          payload: {
            error: {
              hasError: true,
              message: 'Có lỗi xảy ra. Vui lòng thử lại'
            }
          }

        });
      }
    } else {
      //console.log(error);
      dispatch({
        type: CHANGEPASS_FAILURE,
        payload: {
          error: {
            hasError: true,
            message: 'Có lỗi xảy ra. Vui lòng thử lại'
          }
        }

      });
    }
  }
}
export const signOut = (payload) => async (dispatch) => {
  try {
    try {
      const response = await post(`/TokenDevicesEmployee/Delete`,
        {
          token: payload.tokenDevice
        });
      const response1 = await post(`/TokenDevice/Delete`,
        {
          token: payload.tokenDevice
        });
      try {
        //FCM.removeAllDeliveredNotifications();
        await FCM.setBadgeNumber(0);
        await FCM.removeAllDeliveredNotifications()
        await dispatch(unsubscribeFromTopics(payload.towers));
        await firebase.auth().signOut();
        await dispatch({ type: 'LOGOUT_SUCCESS' })
      } catch (e) {
        console.log('loi logout', e)
      }
      // if (response) {
      //   if (response.status === 200) {
      //     try {
      //       dispatch({ type: 'LOGOUT_SUCCESS' })
      //       FCM.removeAllDeliveredNotifications();
      //       dispatch(unsubscribeFromTopics(payload.towers));
      //       await firebase.auth().signOut();
      //     } catch (e) {
      //       console.log('loi logout', e)
      //     }
      //   }else{
      //     dispatch({ type: 'LOGOUT_SUCCESS' })
      //     FCM.removeAllDeliveredNotifications();
      //     dispatch(unsubscribeFromTopics(payload.towers));
      //     await firebase.auth().signOut();
      //   }
      // }else{
      //   dispatch({ type: 'LOGOUT_SUCCESS' })
      //   FCM.removeAllDeliveredNotifications();
      //   dispatch(unsubscribeFromTopics(payload.towers));
      //   await firebase.auth().signOut();
      // }
    } catch (error) {
      console.log('xoa token loi', error.response);

      FCM.removeAllDeliveredNotifications();
      dispatch(unsubscribeFromTopics(payload.towers));
      await firebase.auth().signOut();
      dispatch({ type: 'LOGOUT_SUCCESS' })
    }
  } catch (error) {
    console.log('xoa token loi', error);

    FCM.removeAllDeliveredNotifications();
    dispatch(unsubscribeFromTopics(payload.towers));
    await firebase.auth().signOut();
    dispatch({ type: 'LOGOUT_SUCCESS' })
  }



};

export const postFCMToken = (fcmToken, page) => async (dispatch) => {
  try {
    const token = await firebase.auth().currentUser.getIdToken();
    try {
      // const response = await axios.post(`${helper.URL_API}/TokenDevicesEmployee/Post`,
      //   {
      //     token: fcmToken,
      //     projectId: 0,
      //     os: Platform.OS
      //   },
      //   {
      //     headers: {
      //       Authorization: `bearer ${token}`
      //     }
      //   });
      const response = await post(`/TokenDevicesEmployee/Post`,
        {
          token: fcmToken,
          projectId: 0,
          os: Platform.OS
        });
      if (response) {
        if (response.status === 200) {
          dispatch({ type: 'FCM_SAVE_TOKEN_SUCCESS', payload: fcmToken })
        } else {
          console.log(response.data)
        }
      }
    } catch (error) {
      console.log('luu token loi', error);
      if (error.response) {
      }
    }
  } catch (error) {
    console.log('luu token loi', error);
  }
};
export const delFCMTokenResident = (fcmToken) => async (dispatch) => {
  const response = await post(`/TokenDevice/Delete`,
    {
      token: fcmToken
    });
};
export const getFCMToken = (isRefresh, reToken = null) => (dispatch) => {
  // try {
  //   if (isRefresh && reToken !== null) {
  //     //dispatch({ type: SUCCESS_FCM_TOKEN, data: reToken });
  //     dispatch(postFCMToken(reToken));
  //   } else {
  //     FCM.getFCMToken().then((token) => {
  //       // dispatch({ type: SUCCESS_FCM_TOKEN, data: token });
  //       dispatch(postFCMToken(token));
  //       console.log('TOKEN (getFCMToken)', token);
  //     }).catch((e) => {
  //       // dispatch({ type: FAILED_FCM_TOKEN });
  //       console.log('Loi khi lay fcm token ', e);
  //     });
  //   }
  // } catch (error) {
  //   //dispatch({ type: FAILED_FCM_TOKEN });
  //   console.log((isRefresh) ? 'loi khi refesh fcm token' : 'Loi khi lay moi fcm token ', error);
  // }
};

export const updateProfile = (requestData) => async (dispatch) => {
  dispatch({ type: 'PROFILE_UPDATE_REQUEST' })
  try {
    const token = await firebase.auth().currentUser.getIdToken();
    try {
      // const ret = await axios.post(`${helper.URL_API}/Vendors/UpdateProfile`,
      //   {
      //     fullName: 'string',
      //     image: {
      //       apiKey: "string",
      //       secretKey: "string",
      //       mineType: requestData.image.type,
      //       bytes: requestData.image.data
      //     }
      //   },
      //   {
      //     headers: {
      //       Authorization: `bearer ${token}`
      //     }
      //   })
      const ret = await post(`/Vendors/UpdateProfile`,
        {
          fullName: 'string',
          image: {
            apiKey: "string",
            secretKey: "string",
            mineType: requestData.image.type,
            bytes: requestData.image.data
          }
        })
      if (ret && ret.status === 200) {
        dispatch({ type: 'PROFILE_UPDATE_SUCCESS', payload: { data: ret.data } })
      } else {
        dispatch({ type: 'PROFILE_UPDATE_FAILURE', payload: { error: '' } })
      }
    } catch (error) {
      dispatch({ type: 'PROFILE_UPDATE_FAILURE', payload: { error: error.response } })
      console.log(error)
    }
  } catch (error) {
    dispatch({ type: 'PROFILE_UPDATE_FAILURE', payload: { error: error.response } })
    console.log(error)
  }
}

export const subscribeToTopics = (requestData) => dispatch => {
  requestData.map(o => {
    FCM.subscribeToTopic(`${o}`)
  })
}

export const unsubscribeFromTopics = (requestData) => dispatch => {
  requestData.map(o => {
    console.log('unsubscribeFromTopics', o)
    FCM.unsubscribeFromTopic(`${o}`)
  })
}

export const setTypeResident = (dataList) => dispatch => {
  dispatch({
    type: 'GET_TYPE_SUCCESS',
    payload: { data: 're' }
  });
}

export const setTypeVendor = (dataList) => dispatch => {
  dispatch({
    type: 'GET_TYPE_SUCCESS',
    payload: { data: 'em' }
  });
}
export const demo = () => dispatch => {
  dispatch({
    type: 'LOGOUT_SUCCESS',
    //payload: { data: 'em' }
  });
}