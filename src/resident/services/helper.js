import axios from 'axios';
import firebase from 'firebase';
import keys from '../../utils/keys'
import apiStorage from '../../utils/ApiStorage';
export const helper = {
    //URL_API: 'http://apiappdb.dip.vn/api'
    //URL_API: 'https://ttclandapi2.azurewebsites.net/api'
    //URL_API: 'https://ttc.landsoftapis.com/api'
    //URL_API: 'https://apiappdb.dip.vn/api'
    //URL_API: 'https://building.dip.vn/api'
    //URL_API: 'https://apimyhome.dip.vn/api'
    URL_API: 'https://apibitexco.dip.vn/api'
};
let idNew = 0;
export async function get(url, params = null) {
    //console.log(`${helper.URL_API}` + url)
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
            //console.log(token)
            let ret = await axios.get(`${helper.URL_API}` + url + `?idNew=${idNew}`, {
                method: 'GET',
                headers: {
                    Authorization: `bearer ${token}`
                },
                params
            });
            if (ret.status === 200) {
                return ret;
            }
            else {
                return -1;
            }
        }else{
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
            if (ret.status === 200) {
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
export async function getVersion(url, params = null) {
    try {
        if(helper.URL_API == 'https://apimyhome.dip.vn/api'){
            //console.log(token)
            let ret = await axios.get(`${helper.URL_API}` + url, {
                method: 'GET',
            });
            if (ret.status === 200) {
                return ret;
            }
            else {
                return -1;
            }
        }else{
            let ret = await axios.get(`${helper.URL_API}` + url + `?isPersonal=true`, {
                method: 'GET',
            });
            if (ret.status === 200) {
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
export async function post(url, params = null) {
    //console.log(`${helper.URL_API}` + url)
    console.log('params', params)
    await apiStorage.get(keys.idNew)
        .then(async (data) => {
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
export async function post2(url, params = null) {
    //console.log(`${helper.URL_API}` + url)
    console.log('params', params)
    await apiStorage.get(keys.idNew)
        .then(async (data) => {
            if (data.status === 1) {
                idNew = Number(data.content)
            } else {
                throw new Error(data.content)
            }
        })
    try {
        if(helper.URL_API == 'https://apimyhome.dip.vn/api'){
            let ret = await axios.post(`${helper.URL_API}` + url + `&idNew=${idNew}`, params, {
                headers: {
                    Authorization: `bearer ${await firebase.auth().currentUser.getIdToken()}`
                },
            });
            if (ret.status != undefined && ret.status === 200) {
                return ret;
            }
            else {
                return -1;
            }
        }else{
            let ret = await axios.post(`${helper.URL_API}` + url + `&idNew=${idNew}` + `&isPersonal=true`, params, {
                headers: {
                    Authorization: `bearer ${await firebase.auth().currentUser.getIdToken()}`
                },
            });
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

export async function postViettel(params = null) {
    try {
        const url = `https://sandbox.viettel.vn/PaymentAPI/webresources/postData?`;
        const config = {
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        }
        let response = await  axios.post(url, params, config);
        if (response.status != undefined && response.status === 200) {
            return response;
        }
        else {
            return -1;
        }
    } catch (error) {
        console.log(error.response)
        return -1;
    }
    
}