import axios from "axios";
import firebase from "firebase";
import { Platform } from "react-native";
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
  VENDORS_HOME_FAILURE,
  VENDORS_HOME_REQUEST,
  VENDORS_HOME_SUCCESS,
  AUTH_RESET_BY_KEY,
  SIGNIN_SUCCESS,
  SIGNIN_REQUEST,
  SIGNIN_FAILURE,
} from "./actionTypes";
import FCM from "react-native-fcm";
import { helper, get, post, getVersion, get2 } from "../services/helper";

export const resetStateByKey = ({ key, path, value }) => ({
  type: AUTH_RESET_BY_KEY,
  payload: { key, path, value },
});

export const changePhone = () => ({
  type: CHANGE_PHONE,
});

export const onAuthUserValid = (payload) => ({
  type: LOGIN_SUCCESS,
  payload,
});

export const onAuthUserInvalid = (payload) => (dispatch) => {
  dispatch({
    type: LOGOUT_SUCCESS,
    payload,
  });
};

export const getOtpCode = (phoneNumber, isNew = true) => async (dispatch) => {
  if (isNew) {
    dispatch({ type: OTP_CODE_REQUEST });
  } else {
    dispatch({ type: REOTP_CODE_REQUEST });
  }
  try {
    // const ret = await axios.post(`${helper.URL_API}/accounts/requestOTP`,
    //   {
    //     phoneNumber,
    //     mode: __DEV__ ? 'dev' : '',
    //     type: 're'
    //   });
    //sửa
    const ret = await post(`/accounts/requestOTP`, {
      phoneNumber,
      mode: __DEV__ ? "dev" : "",
      type: "re",
    });
    if (ret.status === 200) {
      dispatch({ type: OTP_CODE_SUCCESS });
    } else {
      dispatch({
        type: OTP_CODE_FAILURE,
        payload: {
          error: {
            hasError: true,
            message: "Có lỗi xảy ra",
          },
        },
      });
    }
  } catch (error) {
    if (error.response) {
      console.log(error.response);
      if (error.response.status == 400) {
        dispatch({
          type: OTP_CODE_FAILURE,
          payload: {
            error: {
              hasError: true,
              message: error.response.data.message,
            },
          },
        });
      }
    } else {
      dispatch({
        type: OTP_CODE_FAILURE,
        payload: {
          error: {
            hasError: true,
            message: "DATA_NOT_FOUND",
          },
        },
      });
    }
  }
};

export const loginUser = ({ phoneNumber, otpCode }) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    // let response = await axios.post(`${helper.URL_API}/accounts/verifyOTP`,
    //   {
    //     phoneNumber,
    //     otpCode,
    //     type: 're'
    //   });
    let response = await post(`/accounts/verifyOTP`, {
      phoneNumber,
      otpCode,
      type: "re",
    });
    if (response.status === 200) {
      try {
        //console.log(response.data)
        dispatch({ type: "SAVE_USER", payload: response.data });
        await firebase.auth().signInWithCustomToken(response.data.token);
      } catch (error) {
        //console.log(response)
        dispatch({
          type: LOGIN_FAILURE,
          payload: {
            error: {
              hasError: true,
              message: "Có lỗi xảy ra",
            },
          },
        });
      }
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status == 400) {
        console.log(error.response.data.message);
        dispatch({
          type: LOGIN_FAILURE,
          payload: {
            error: {
              hasError: true,
              message: error.response.data.message, //'Mã xác thực không đúng'
            },
          },
        });
      } else {
        dispatch({
          type: LOGIN_FAILURE,
          payload: {
            error: {
              hasError: true,
              message: "Có lỗi xảy ra. Vui lòng thử lại",
            },
          },
        });
      }
    } else {
      //console.log(error);
      dispatch({
        type: LOGIN_FAILURE,
        payload: {
          error: {
            hasError: true,
            message: "Có lỗi xảy ra. Vui lòng thử lại",
          },
        },
      });
    }
  }
};

export const loginUserByPass = ({ phoneNumber, password }) => async (
  dispatch
) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    // let response = await axios.post(`${helper.URL_API}/Customer/Login`,
    //   {
    //     "phone": phoneNumber,
    //     "pass": password,
    //   });
    //sửa
    let response = await post(`/Customer/Login`, {
      phone: phoneNumber,
      pass: password,
    });
    if (response.status === 200) {
      try {
        //console.log(response.data)
        dispatch({ type: "SAVE_USER", payload: response.data });
        await firebase.auth().signInWithCustomToken(response.data.token);
      } catch (error) {
        //console.log(response)
        dispatch({
          type: LOGIN_FAILURE,
          payload: {
            error: {
              hasError: true,
              message: "Có lỗi xảy ra",
            },
          },
        });
      }
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status == 400) {
        console.log(error.response.data.message);
        dispatch({
          type: LOGIN_FAILURE,
          payload: {
            error: {
              hasError: true,
              message: error.response.data.message,
            },
          },
        });
      } else {
        dispatch({
          type: LOGIN_FAILURE,
          payload: {
            error: {
              hasError: true,
              message: "Có lỗi xảy ra. Vui lòng thử lại",
            },
          },
        });
      }
    } else {
      console.log(error);
      dispatch({
        type: LOGIN_FAILURE,
        payload: {
          error: {
            hasError: true,
            message: "Có lỗi xảy ra. Vui lòng thử lại",
          },
        },
      });
    }
  }
};

export const signIn = ({ phoneNumber, password }) => async (dispatch) => {
  dispatch({ type: SIGNIN_REQUEST });
  try {
    // let response = await axios.post(`${helper.URL_API}/Customer/Registry`,
    //   {
    //     "phone": phoneNumber,
    //     "pass": password,
    //   });
    //sửa
    let response = await post(`/Customer/Registry`, {
      phone: phoneNumber,
      pass: password,
    });
    if (response.status === 200) {
      try {
        //console.log(response)
        dispatch({ type: SIGNIN_SUCCESS });
        //dispatch({ type: 'SAVE_USER', payload: response.data });
        //await firebase.auth().signInWithCustomToken(response.data.token);
        dispatch({ type: LOGIN_REQUEST });
        try {
          // let response = await axios.post(`${helper.URL_API}/Customer/Login`,
          //   {
          //     "phone": phoneNumber,
          //     "pass": password,
          //   });
          //sửa
          let response = await post(`/Customer/Login`, {
            phone: phoneNumber,
            pass: password,
          });
          if (response.status === 200) {
            try {
              //console.log(response.data)
              dispatch({ type: "SAVE_USER", payload: response.data });
              await firebase.auth().signInWithCustomToken(response.data.token);
            } catch (error) {
              //console.log(response)
              dispatch({
                type: LOGIN_FAILURE,
                payload: {
                  error: {
                    hasError: true,
                    message: "Có lỗi xảy ra",
                  },
                },
              });
            }
          }
        } catch (error) {
          if (error.response) {
            if (error.response.status == 400) {
              console.log(error.response.data.message);
              dispatch({
                type: LOGIN_FAILURE,
                payload: {
                  error: {
                    hasError: true,
                    message: error.response.data.message,
                  },
                },
              });
            } else {
              dispatch({
                type: LOGIN_FAILURE,
                payload: {
                  error: {
                    hasError: true,
                    message: "Có lỗi xảy ra. Vui lòng thử lại",
                  },
                },
              });
            }
          } else {
            console.log(error);
            dispatch({
              type: LOGIN_FAILURE,
              payload: {
                error: {
                  hasError: true,
                  message: "Có lỗi xảy ra. Vui lòng thử lại",
                },
              },
            });
          }
        }
      } catch (error) {
        //console.log(response)
        dispatch({
          type: SIGNIN_FAILURE,
          payload: {
            error: {
              hasError: true,
              message: "Có lỗi xảy ra",
            },
          },
        });
      }
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status == 400) {
        console.log(error.response.data.message);
        dispatch({
          type: SIGNIN_FAILURE,
          payload: {
            error: {
              hasError: true,
              message: error.response.data.message,
            },
          },
        });
      } else {
        dispatch({
          type: SIGNIN_FAILURE,
          payload: {
            error: {
              hasError: true,
              message: "Có lỗi xảy ra. Vui lòng thử lại",
            },
          },
        });
      }
    } else {
      console.log(error);
      dispatch({
        type: SIGNIN_FAILURE,
        payload: {
          error: {
            hasError: true,
            message: "Có lỗi xảy ra. Vui lòng thử lại",
          },
        },
      });
    }
  }
};

export const signOut = (payload) => async (dispatch) => {
  try {
    try {
      const response = await post(`/TokenDevice/Delete`, {
        token: payload.tokenDevice,
      });
      const response1 = await post(`/TokenDevicesEmployee/Delete`, {
        token: payload.tokenDevice,
      });
      //console.log('responsesignOut', response)
      try {
        dispatch({ type: "LOGOUT_SUCCESS" });
        FCM.removeAllDeliveredNotifications();
        FCM.setBadgeNumber(0);
        dispatch(unsubscribeFromTopics(payload.towers));
        await firebase.auth().signOut();
      } catch (e) {
        console.log("loi logout", e);
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
      //   }
      // }else{
      //   dispatch({ type: 'LOGOUT_SUCCESS' })
      //   FCM.removeAllDeliveredNotifications();
      //   dispatch(unsubscribeFromTopics(payload.towers));
      //   await firebase.auth().signOut();
      // }
    } catch (error) {
      console.log("xoa token loi", error);
      dispatch({ type: "LOGOUT_SUCCESS" });
      FCM.removeAllDeliveredNotifications();
      dispatch(unsubscribeFromTopics(payload.towers));
      await firebase.auth().signOut();
    }
  } catch (error) {
    console.log("xoa token loi", error);
    dispatch({ type: "LOGOUT_SUCCESS" });
    FCM.removeAllDeliveredNotifications();
    dispatch(unsubscribeFromTopics(payload.towers));
    await firebase.auth().signOut();
  }
};

export const delFCMTokenEmployee = (fcmToken) => async (dispatch) => {
  const response = await post(`/TokenDevicesEmployee/Delete`, {
    token: fcmToken,
  });
};
export const delFCMTokenResident = (fcmToken) => async (dispatch) => {
  const response = await post(`/TokenDevice/Delete`, {
    token: fcmToken,
  });
};
export const postFCMToken = (fcmToken, page, connectString) => async (
  dispatch
) => {
  try {
    const token = await firebase.auth().currentUser.getIdToken();
    try {
      // const response = await axios.post(`${helper.URL_API}/TokenDevice/Post`,
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
      //sửa
      const response = await post(`/TokenDevice/Post`, {
        token: fcmToken,
        projectId: 0,
        os: Platform.OS,
      });
      console.log("postFCMToken", response);
      if (response) {
        if (response.status === 200) {
          dispatch({ type: "FCM_SAVE_TOKEN_SUCCESS", payload: fcmToken });
        }
      }
    } catch (error) {
      console.log("luu token loi", error);
      if (error.response) {
      }
    }
  } catch (error) {
    console.log("luu token loi", error);
  }
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
  //console.log(requestData)
  dispatch({ type: "PROFILE_UPDATE_REQUEST" });
  try {
    const token = await firebase.auth().currentUser.getIdToken();
    try {
      // const ret = await axios.post(`${helper.URL_API}/Residents/UpdateProfile`,
      //   {
      //     fullName: requestData.fullName,
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
      //sửa
      const ret = await post(`/Residents/UpdateProfile`, {
        fullName: requestData.fullName,
        image: {
          apiKey: "string",
          secretKey: "string",
          mineType: requestData.image.type,
          bytes: requestData.image.data,
        },
      });
      if (ret && ret.status === 200) {
        console.log(ret);
        dispatch({
          type: "PROFILE_UPDATE_SUCCESS",
          payload: { data: ret.data },
        });
      } else {
        dispatch({ type: "PROFILE_UPDATE_FAILURE", payload: { error: "" } });
        //console.log(ret)
      }
    } catch (error) {
      dispatch({
        type: "PROFILE_UPDATE_FAILURE",
        payload: { error: error.response },
      });
      console.log(error);
    }
  } catch (error) {
    dispatch({
      type: "PROFILE_UPDATE_FAILURE",
      payload: { error: ret.statusText },
    });
    console.log(error);
  }
};

export const subscribeToTopics = (requestData) => (dispatch) => {
  requestData.map((o) => {
    //console.log('subscribeToTopics', o)
    FCM.subscribeToTopic(`${o}`);
  });
};

export const unsubscribeFromTopics = (requestData) => (dispatch) => {
  requestData.map((o) => {
    console.log("unsubscribeFromTopics", o);
    FCM.unsubscribeFromTopic(`${o}`);
  });
};

export const getProfile = (dataRequest) => async (dispatch) => {
  try {
    //console.log(dataRequest);
    dispatch({ type: VENDORS_HOME_REQUEST });
    const url = `/accounts/getProfile`;
    const ret = await get(url, dataRequest);
    console.log("getProfile1", ret);
    if (ret !== undefined && ret !== null) {
      if (ret.status == 200) {
        if (!ret.data.isChangePass) {
          dispatch({ type: "GO_CHANGE_PASS" });
        }
        const url1 = `/Residents/TowerHome`;
        const ret1 = await get(url1, {
          towerId: ret.data.towerId,
          departmentId: ret.data.spaceMainId,
          langId: 0,
        });
        console.log("getProfile2", ret1);
        const url2 = "/Banner/GetListBanner";
        const ret2 = await get2(url2, {
          id: ret.data.id,
          title: ret.data.title,
          link: ret.data.link,
          imageLink: ret.data.imageLink,
          display: ret.data.display,
          header: ret.data.footer,
          footer: ret.data.footer,
        });
        console.log("getProfile3", ret2);

        if (ret1 !== undefined && ret1 !== null) {
          if ((await ret1.status) == 200) {
            dispatch(subscribeToTopics(ret.data.towers));

            dispatch({
              type: VENDORS_HOME_SUCCESS,
              payload: {
                data: { ...ret1.data, banner: ret2.data },
                profile: ret.data,
              },
            });
          } else {
            dispatch({
              type: VENDORS_HOME_FAILURE,
              payload: { data: ret1.message },
            });
          }
        } else {
          dispatch({
            type: VENDORS_HOME_FAILURE,
            payload: { data: ret1.message },
          });
        }
      } else {
        dispatch({
          type: VENDORS_HOME_FAILURE,
          payload: { data: ret.message },
        });
      }
    } else {
      dispatch({ type: VENDORS_HOME_FAILURE, payload: { data: ret.message } });
    }
  } catch (error) {
    console.log(error);
    dispatch({
      type: VENDORS_HOME_FAILURE,
      payload: { data: "Xảy ra lỗi không xác định" },
    });
  }
};

export const resetOrderId = (payload) => (dispatch) => {
  dispatch({
    type: "ORDERID_RESET",
    payload: {
      orderId: "",
    },
  });
};

export const checkVersion = (dataRequest) => async (dispatch) => {
  try {
    const ret = await getVersion("/Building/GetVersionApp");
    console.log(ret);
    if (ret !== undefined && ret !== null) {
      if (ret.status == 200) {
        dispatch({
          type: "CHECK_VERSION",
          payload: {
            data:
              Platform.OS == "ios" ? ret.data.ios.ver : ret.data.android.ver,
          },
        });
      } else {
        dispatch({ type: "CHECK_VERSION", payload: { data: 0 } });
      }
    } else {
      dispatch({ type: "CHECK_VERSION", payload: { data: 0 } });
    }
  } catch (error) {
    console.log(error);
    dispatch({ type: "CHECK_VERSION", payload: { data: 0 } });
  }
};
