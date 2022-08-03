import axios from 'axios';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import keys from '../utils/keys'
import apiStorage from '../utils/ApiStorage';
export const helper = {
    //URL_API: 'https://ttclandapi2.azurewebsites.net/api',
    //URL_API: 'https://ttc.landsoftapis.com/api',
    //URL_API: 'https://apiappdb.dip.vn/api'
    //URL_API: 'https://building.dip.vn/api'
    //URL_API: 'https://apimyhome.dip.vn/api'
    URL_API: 'https://apibitexco.dip.vn/api'
};

export const helperFirebase = {
    URL_API: 'https://vime.landsoftapis.com/v2'
};
let idNew = 0;
export async function get1(url, params = null) {
    console.log(`${helper.URL_API}` + url)
    //console.log('params', params)
    await apiStorage.get(keys.idNew)
        .then(async (data) => {
            //return -1;
            // console.log(data);
            if (data.status === 1) {
                idNew = Number(data.content)
            } else {
                throw new Error(data.content)
            }
        })
        try {
            if(helper.URL_API == 'https://apimyhome.dip.vn/api'){
                let token = await firebase.auth().currentUser.getIdToken();
                console.log(token)
                console.log(`${helper.URL_API}` + url + `?idNew=${idNew}`)
                let ret = await axios.get(`${helper.URL_API}` + url + `?idNew=${idNew}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `bearer ${token}`
                    },
                    params
                });
                //console.log('helper.ret', ret)
                if (ret.status != undefined && ret.status === 200) {
                    return ret;
                }
                else {
                    return -1;
                }
            }else{
                console.log(`${helper.URL_API}` + url)
                let token = await firebase.auth().currentUser.getIdToken();
                console.log(token)
                //console.log(`${helper.URL_API}` + url)
                let ret = await axios.get(url, {
                    method: 'GET',
                    headers: {
                        Authorization: `bearer ${token}`
                    },
                    params
                });
                console.log('helper.ret', ret)
                if (ret.status != undefined && ret.status === 200) {
                    return ret;
                }
                else {
                    return -1;
                }
            }

        } catch (error) {
            console.log(`${helper.URL_API}`,error.response);
            //return ret;
            return -1;
        }
}
export async function get(url, params = null) {
    console.log(`${helper.URL_API}` + url)
    //console.log('params', params)
    await apiStorage.get(keys.idNew)
        .then(async (data) => {
            //return -1;
            // console.log(data);
            if (data.status === 1) {
                idNew = Number(data.content)
            } else {
                throw new Error(data.content)
            }
        })
        try {
            if(helper.URL_API == 'https://apimyhome.dip.vn/api'){
                let token = await firebase.auth().currentUser.getIdToken();
                console.log(token)
                console.log(`${helper.URL_API}` + url + `?idNew=${idNew}`)
                let ret = await axios.get(`${helper.URL_API}` + url + `?idNew=${idNew}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `bearer ${token}`
                    },
                    params
                });
                //console.log('helper.ret', ret)
                if (ret.status != undefined && ret.status === 200) {
                    return ret;
                }
                else {
                    return -1;
                }
            }else{
                console.log(`${helper.URL_API}` + url)
                let token = await firebase.auth().currentUser.getIdToken();
                console.log(token)
                //console.log(`${helper.URL_API}` + url)
                let ret = await axios.get(`${helper.URL_API}` + url + `?idNew=${idNew}` + `&isPersonal=true`, {
                    method: 'GET',
                    headers: {
                        Authorization: `bearer ${token}`
                    },
                    params
                });
                console.log('helper.ret', ret)
                if (ret.status != undefined && ret.status === 200) {
                    return ret;
                }
                else {
                    return -1;
                }
            }

        } catch (error) {
            console.log(`${helper.URL_API}`,error.response);
            //return ret;
            return -1;
        }
}

export async function post(url, params = null) {
    console.log(`${helper.URL_API}` + url)
    //console.log('params', params)
    //console.log('helper.ret', `${helper.URL_API}` + url + `?idNew=${idNew}`)
    await apiStorage.get(keys.idNew)
        .then(async (data) => {
            //return -1;
            // console.log(data);
            if (data.status === 1) {
                idNew = Number(data.content)
            } else {
                throw new Error(data.content)
            }
        })
        try {
            if(helper.URL_API == 'https://apimyhome.dip.vn/api'){
                let ret = await axios.post(`${helper.URL_API}` + url + `?idNew=${idNew}`, params, {
                    headers: {
                        Authorization: `bearer ${await firebase.auth().currentUser.getIdToken()}`
                    },
                });
                //console.log('helper.ret', ret)
                //return ret;
                if (ret.status != undefined && ret.status === 200) {
                    return ret;
                }
                else {
                    return -1;
                }
            }else{
                let ret = await axios.post(`${helper.URL_API}` + url + `?idNew=${idNew}` + `&isPersonal=true`, params, {
                    headers: {
                        Authorization: `bearer ${await firebase.auth().currentUser.getIdToken()}`
                    },
                });
                //console.log('helper.ret', ret)
                //return ret;
                if (ret.status != undefined && ret.status === 200) {
                    return ret;
                }
                else {
                    return -1;
                }
            }

        } catch (error) {
            console.log(`${helper.URL_API}`,error.response)
            return -1;
        }
}
export async function post2(url, scheduleApartmentId , params = null) {
  console.log(`${helper.URL_API}` + url)
  //console.log('params', params)
  //console.log('helper.ret', `${helper.URL_API}` + url + `?idNew=${idNew}`)
  await apiStorage.get(keys.idNew)
      .then(async (data) => {
          //return -1;
          // console.log(data);
          if (data.status === 1) {
              idNew = Number(data.content)
          } else {
              throw new Error(data.content)
          }
      })
      try {
          if(helper.URL_API == 'https://apimyhome.dip.vn/api'){
              console.log( `${helper.URL_API}` + url + `?idNew=${idNew}` + `&scheduleApartmentId=${scheduleApartmentId}`)
              let ret = await axios.post(`${helper.URL_API}` + url + `?idNew=${idNew}` + `&scheduleApartmentId=${scheduleApartmentId}`, params, {
                  headers: {
                      Authorization: `bearer ${await firebase.auth().currentUser.getIdToken()}`
                  },
              });
              //console.log('helper.ret', ret)
              //return ret;
              if (ret.status != undefined && ret.status === 200) {
                console.log( `${helper.URL_API}` + url + `?idNew=${idNew}` + `&scheduleApartmentId=${scheduleApartmentId}`)
                  return ret;
              }
              else {
                console.log( `${helper.URL_API}` + url + `?idNew=${idNew}` + `&scheduleApartmentId=${scheduleApartmentId}`)
                  return -1;
              }
          }else{
            console.log( `${helper.URL_API}` + url + `?idNew=${idNew}` + `&scheduleApartmentId=${scheduleApartmentId}`)

              let ret = await axios.post(`${helper.URL_API}` + url + `?idNew=${idNew}` + `&scheduleApartmentId=${scheduleApartmentId}`, params, {
                  headers: {
                      Authorization: `bearer ${await firebase.auth().currentUser.getIdToken()}`
                  },
              });
              //console.log('helper.ret', ret)
              //return ret;
              if (ret.status != undefined && ret.status === 200) {
                  return ret;
              }
              else {
                  return -1;
              }
          }

      } catch (error) {
          console.log(`${helper.URL_API}`,error.response)
          return -1;
      }
}
export async function put(url, params = null) {
    try {
        if(helper.URL_API == 'https://apimyhome.dip.vn/api'){
            let ret = await axios.post(`${helper.URL_API}` + url, params, {
                headers: {
                    Authorization: `bearer ${await firebase.auth().currentUser.getIdToken()}`
                },
            });
            //console.log(ret)
            if (ret.status != undefined && ret.status === 200) {
                return ret;
            }
            else {
                return -1;
            }
        }else{
            let ret = await axios.post(`${helper.URL_API}` + url, params, {
                headers: {
                    Authorization: `bearer ${await firebase.auth().currentUser.getIdToken()}`
                },
            });
            //console.log(ret)
            if (ret.status != undefined && ret.status === 200) {
                return ret;
            }
            else {
                return -1;
            }
        }

    } catch (error) {
        console.log(error.response)
        return -1;
    }
}