import { get,post ,helper } from '../services/helper';
import {

    CHECKLIST_TAISAN_GETLIST_RESET_BY_KEY,
    CHECKLIST_TAISAN_GETLIST_REFRESHING,
    CHECKLIST_TAISAN_GETLIST_REQUEST,
    CHECKLIST_TAISAN_GETLIST_SUCCESS,
    CHECKLIST_TAISAN_GETLIST_FAILURE,

    CHECKLIST_TAISAN_HANDOVER_REQUEST,
    CHECKLIST_TAISAN_HANDOVER_SUCCESS,
    CHECKLIST_TAISAN_HANDOVER_FAILURE,

    CHECKLIST_TAISAN_HANDOVER_UPLOAD_FILE_REQUEST,
    CHECKLIST_TAISAN_HANDOVER_UPLOAD_FILE_SUCCESS,
    CHECKLIST_TAISAN_HANDOVER_UPLOAD_FILE_FAILURE,

    CHECKLIST_TAISAN_HANDOVER_DELETE_FILE_REQUEST,
    CHECKLIST_TAISAN_HANDOVER_DELETE_FILE_SUCCESS,
    CHECKLIST_TAISAN_HANDOVER_DELETE_FILE_FAILURE,

    CHECKLIST_TAISAN_CHECKLIST_ADD_REQUEST,
    CHECKLIST_TAISAN_CHECKLIST_ADD_SUCCESS,
    CHECKLIST_TAISAN_CHECKLIST_ADD_FAILURE,

    CHECKLIST_ADD_DATA_REQUEST,
    CHECKLIST_ADD_DATA_SUCCESS,
    CHECKLIST_ADD_DATA_FAILURE,

} from './actionTypes';
import firebase from 'firebase';
import axios from 'axios';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest)
        
        dispatch({ type: CHECKLIST_TAISAN_GETLIST_REQUEST });

        const url = '/HandOverCustomer/GetChecklistHandover'
        const ret = await post(url, {scheduleApartmentId: dataRequest.Id});
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                //
                dispatch({
                    type: CHECKLIST_TAISAN_GETLIST_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
            }
            else {
                dispatch({ type: CHECKLIST_TAISAN_GETLIST_FAILURE, payload: { data: ret.message } });
            }
        }
        else {
            dispatch({ type: CHECKLIST_TAISAN_GETLIST_FAILURE, payload: { data: ret.message } });
        }
    } catch (error) {
        dispatch({ type: CHECKLIST_TAISAN_GETLIST_FAILURE, payload: { data: ret.message } });
    }
};

export const HandoverHandle = (dataRequest) => async (dispatch) => {
    try {
        
        
        dispatch({ type: CHECKLIST_TAISAN_HANDOVER_REQUEST });
        //console.log(dataRequest)
        //console.log(dataRequest.item)

        var data = new Array()
        data.push(dataRequest.item)
        //console.log(data)

        const url = '/HandOverLocal/PostHandoverChecklistLocal'

        
        //console.log(url)
        
          
        var parrams = {
            "apartmentId": dataRequest.scheduleApartmentId,
            "checklist": [
              {
                "id": dataRequest.item.id,
                "scheduleApartmentId": dataRequest.scheduleApartmentId,
                "groupName": dataRequest.item.groupName,
                "description": dataRequest.item.description,
                "quality": dataRequest.item.quality,
                "image": dataRequest.item.image,
                "url": dataRequest.item.url,
                "note": dataRequest.item.note,
                "valueInput": dataRequest.item.valueInput,
                "userAllowName": dataRequest.item.userAllowName,
                "name": dataRequest.item.name,
                "planName": dataRequest.item.planName,
                "userAllowNote": dataRequest.item.userAllowNote,
                "scheduleName": dataRequest.item.scheduleName,
                "checklistName": dataRequest.item.checklistName,
                "floorName": dataRequest.item.floorName,
                "buildingId": dataRequest.item.buildingId,
                "dateAction": dataRequest.item.dateAction,
                "dateAllow": dataRequest.item.dateAllow,
                "valueChoose": dataRequest.item.valueChoose,
                "isNoQuality": dataRequest.item.isNoQuality
              }
            ]
          }
        // return
        const ret = await post(url,parrams);
        //console.log(ret)
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                //
                dispatch({
                    type: CHECKLIST_TAISAN_HANDOVER_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
                return true
            }
            else {
                dispatch({ type: CHECKLIST_TAISAN_HANDOVER_FAILURE, payload: { data: ret.message } });
                return false
            }
        }
        else {
            dispatch({ type: CHECKLIST_TAISAN_HANDOVER_FAILURE, payload: { data: ret.message } });
            return false
        }
    } catch (error) {
        dispatch({ type: CHECKLIST_TAISAN_HANDOVER_FAILURE, payload: { data: ret.message } });
        return false
    }
};

export const UploadImages = (dataRequest) => async (dispatch) => {
    
    var data = new Array()

    dispatch({ type: CHECKLIST_TAISAN_HANDOVER_UPLOAD_FILE_REQUEST });
    //console.log(dataRequest)

    const url = '/Upload/UploadFile'

    for (const item of dataRequest) {
        
        if(item.uri.substring(0,4).toLowerCase()==='http')
        {
            item.status=1//ảnh này ko đã up rồi ko up nữa
        }
        else{
            var parrams = {
                data: item.bytes,
            }
    
            try {
                const ret = await post(url, parrams)
                if (ret !== undefined && ret !== null) {
                    if (ret.status == 200) {
                        //console.log(ret.data)
                        dispatch({
                            type: CHECKLIST_TAISAN_HANDOVER_UPLOAD_FILE_SUCCESS,
                            payload: {
                                data: JSON.parse(ret.data)
                            }
                        });
                        item.status=JSON.parse(ret.data).status
                        item.url=JSON.parse(ret.data).data
                        //item.message=JSON.parse(ret.data).message + ' - ' + ret.message
                        item.message=ret.message
                    }
                    else {
                        dispatch({ type: CHECKLIST_TAISAN_HANDOVER_UPLOAD_FILE_FAILURE, payload: { data: ret.message } });
                        // return false
                        item.status=JSON.parse(ret.data).status
                        item.message=JSON.parse(ret.data).message + ' - ' + ret.message
                    }
                }
                else {
                    dispatch({ type: CHECKLIST_TAISAN_HANDOVER_UPLOAD_FILE_FAILURE, payload: { data: ret.message } });
                    // return false
                    item.status=JSON.parse(ret.data).status
                    item.message=JSON.parse(ret.data).message + ' - ' + ret.message
                }
            } catch (error) {
                dispatch({ type: CHECKLIST_TAISAN_HANDOVER_UPLOAD_FILE_FAILURE, payload: { data: ret.message } });
                // return false
                item.status=JSON.parse(ret.data).status
                item.message=JSON.parse(ret.data).message + ' - ' + ret.message
            }
        }
        
        data.push(item)

    } 

    return await data
}

export const DeleteImages = (dataRequest) => async (dispatch) => {
    
    dispatch({ type: CHECKLIST_TAISAN_HANDOVER_DELETE_FILE_REQUEST });
    //console.log(dataRequest)

    const url = '/Upload/DeleteFile'

    // return
    var parrams = {
        url: dataRequest,
    }
    await console.log(parrams)

    try {
        const ret = await post(url, parrams)
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                //
                dispatch({
                    type: CHECKLIST_TAISAN_HANDOVER_DELETE_FILE_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });

                if(ret.data.status===2) return false

                return true
                // item.status = ret.data.status
                // item.url = ret.data.data
                // item.message = ret.data.message + ' - ' + ret.message
            }
            else {
                dispatch({ type: CHECKLIST_TAISAN_HANDOVER_DELETE_FILE_FAILURE, payload: { data: ret.message } });
                return false
            }
        }
        else {
            dispatch({ type: CHECKLIST_TAISAN_HANDOVER_DELETE_FILE_FAILURE, payload: { data: ret.message } });
            return false
        }
    } catch (error) {
        dispatch({ type: CHECKLIST_TAISAN_HANDOVER_DELETE_FILE_FAILURE, payload: { data: ret.message } });
        return false
    }


}

export const CheckListAdd = (dataRequest) => async (dispatch) => {
    try {

        dispatch({ type: CHECKLIST_TAISAN_CHECKLIST_ADD_REQUEST });
        //console.log(dataRequest)

        const url = '/HandOverCustomer/PostNewHandoverChecklist'

        var parrams = {
            "apartmentId":dataRequest.Id,
            "checklist":dataRequest.data,
            "username":dataRequest.username
        }
        //console.log(parrams)
        // return
        const ret = await post(url,parrams);
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                //console.log(ret.data)
                dispatch({
                    type: CHECKLIST_TAISAN_CHECKLIST_ADD_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
                return ret
            }
            else {
                dispatch({ type: CHECKLIST_TAISAN_CHECKLIST_ADD_FAILURE, payload: { data: ret.message } });
                return {
                    status:2,
                    message:ret.message
                }
            }
        }
        else {
            dispatch({ type: CHECKLIST_TAISAN_CHECKLIST_ADD_FAILURE, payload: { data: ret.message } });
            return {
                status:2,
                message:ret.message
            }
        }
    } catch (error) {
        dispatch({ type: CHECKLIST_TAISAN_CHECKLIST_ADD_FAILURE, payload: { data: ret.message } });
        return {
            status:2,
            message:ret.message
        }
    }
};

export const HandOverAddCheckListData = () => async (dispatch) => {
    try {
        //console.log('dataRequest', dataRequest)
        
        dispatch({ type: CHECKLIST_ADD_DATA_REQUEST });
        // return
        const url = '/HandOver/HandOverAddCheckListData';
        const ret = await get(url);
        //console.log('ret', ret.data)
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                //

                dispatch({
                    type: CHECKLIST_ADD_DATA_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });

                return ret.data
                
            }
            else {
                dispatch({ type: CHECKLIST_ADD_DATA_FAILURE, payload: { data: ret.message } });
                return {}
            }
        }
        else {
            dispatch({ type: CHECKLIST_ADD_DATA_FAILURE, payload: { data: ret.message } });
            return {}
        }
    } catch (error) {
        dispatch({ type: CHECKLIST_ADD_DATA_FAILURE, payload: { data: ret.message } });
        return {}
    }
};


export const resetStateByKey = (payload) => ({
    type: CHECKLIST_TAISAN_GETLIST_RESET_BY_KEY,
    payload
});
export const refreshDataHandle = () => ({
    type: CHECKLIST_TAISAN_GETLIST_REFRESHING
});


