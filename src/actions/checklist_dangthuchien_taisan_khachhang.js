import { get,post ,helper } from '../services/helper';
import {
    // FEEDBACK_GETLIST_REFRESHING,
    // // FEEDBACK_GETLIST_RESET_BY_KEY,
    // // FEEDBACK_GETLIST_REQUEST,
    // FEEDBACK_GETLIST_SUCCESS,
    // FEEDBACK_GETLIST_FAILURE,
    // FEEDBACK_PROGRESS_REQUEST,
    // FEEDBACK_PROGRESS_SUCCESS,
    // FEEDBACK_PROGRESS_FAILURE,
    // CHECKLIST_RESET_BY_KEY,

    CHECKLIST_CUSTOMER_TAISAN_GETLIST_RESET_BY_KEY,
    CHECKLIST_CUSTOMER_TAISAN_GETLIST_REFRESHING,
    CHECKLIST_CUSTOMER_TAISAN_GETLIST_REQUEST,
    CHECKLIST_CUSTOMER_TAISAN_GETLIST_SUCCESS,
    CHECKLIST_CUSTOMER_TAISAN_GETLIST_FAILURE,

    CHECKLIST_CUSTOMER_TAISAN_HANDOVER_REQUEST,
    CHECKLIST_CUSTOMER_TAISAN_HANDOVER_SUCCESS,
    CHECKLIST_CUSTOMER_TAISAN_HANDOVER_FAILURE,

    CHECKLIST_CUSTOMER_TAISAN_HANDOVER_UPLOAD_FILE_REQUEST,
    CHECKLIST_CUSTOMER_TAISAN_HANDOVER_UPLOAD_FILE_SUCCESS,
    CHECKLIST_CUSTOMER_TAISAN_HANDOVER_UPLOAD_FILE_FAILURE,

    CHECKLIST_CUSTOMER_TAISAN_HANDOVER_DELETE_FILE_REQUEST,
    CHECKLIST_CUSTOMER_TAISAN_HANDOVER_DELETE_FILE_SUCCESS,
    CHECKLIST_CUSTOMER_TAISAN_HANDOVER_DELETE_FILE_FAILURE

} from './actionTypes';
import firebase from 'firebase';
import axios from 'axios';

export const loadDataHandle = (dataRequest) => async (dispatch) => {
    try {
        //console.log(dataRequest)
        
        dispatch({ type: CHECKLIST_CUSTOMER_TAISAN_GETLIST_REQUEST });

        const url = '/HandOverCustomer/GetChecklist';
        const ret = await get(url, {scheduleApartmentId: dataRequest.Id});
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                //console.log(ret.data)
                dispatch({
                    type: CHECKLIST_CUSTOMER_TAISAN_GETLIST_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
            }
            else {
                dispatch({ type: CHECKLIST_CUSTOMER_TAISAN_GETLIST_FAILURE, payload: { data: ret.message } });
            }
        }
        else {
            dispatch({ type: CHECKLIST_CUSTOMER_TAISAN_GETLIST_FAILURE, payload: { data: ret.message } });
        }
    } catch (error) {
        dispatch({ type: CHECKLIST_CUSTOMER_TAISAN_GETLIST_FAILURE, payload: { data: ret.message } });
    }
};

export const HandoverHandle = (dataRequest) => async (dispatch) => {
    try {
        
        
        dispatch({ type: CHECKLIST_CUSTOMER_TAISAN_HANDOVER_REQUEST });
        var data = new Array()
        data.push(dataRequest.item)
        const url = '/HandOverCustomer/UpdateChecklist';
        var parrams = [
            {
                "id": dataRequest.item.id,
                "scheduleApartmentId": dataRequest.Id,
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
        //     "scheduleApartmentId":dataRequest.Id,
        //     "checklists":data
        // }
        //console.log(parrams)
        // return
        const ret = await post(url,parrams);
        //console.log(ret)
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                //console.log(ret.data)
                dispatch({
                    type: CHECKLIST_CUSTOMER_TAISAN_HANDOVER_SUCCESS,
                    payload: {
                        data: ret.data
                    }
                });
                return true
            }
            else {
                dispatch({ type: CHECKLIST_CUSTOMER_TAISAN_HANDOVER_FAILURE, payload: { data: ret.message } });
                return false
            }
        }
        else {
            dispatch({ type: CHECKLIST_CUSTOMER_TAISAN_HANDOVER_FAILURE, payload: { data: ret.message } });
            return false
        }
    } catch (error) {
        dispatch({ type: CHECKLIST_CUSTOMER_TAISAN_HANDOVER_FAILURE, payload: { data: ret.message } });
        return false
    }
};

export const UploadImages = (dataRequest) => async (dispatch) => {
    
    var data = new Array()

    dispatch({ type: CHECKLIST_CUSTOMER_TAISAN_HANDOVER_UPLOAD_FILE_REQUEST });
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
                //console.log(ret)
                if (ret !== undefined && ret !== null) {
                    if (ret.status == 200) {
                        dispatch({
                            type: CHECKLIST_CUSTOMER_TAISAN_HANDOVER_UPLOAD_FILE_SUCCESS,
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
                        dispatch({ type: CHECKLIST_CUSTOMER_TAISAN_HANDOVER_UPLOAD_FILE_FAILURE, payload: { data: ret.message } });
                        // return false
                        item.status=JSON.parse(ret.data).status
                        item.message=JSON.parse(ret.data).message + ' - ' + ret.message
                    }
                }
                else {
                    dispatch({ type: CHECKLIST_CUSTOMER_TAISAN_HANDOVER_UPLOAD_FILE_FAILURE, payload: { data: ret.message } });
                    // return false
                    item.status=JSON.parse(ret.data).status
                    item.message=JSON.parse(ret.data).message + ' - ' + ret.message
                }
            } catch (error) {
                dispatch({ type: CHECKLIST_CUSTOMER_TAISAN_HANDOVER_UPLOAD_FILE_FAILURE, payload: { data: ret.message } });
                // return false
                item.status = JSON.parse(ret.data).status
                item.message = JSON.parse(ret.data).message + ' - ' + ret.message
            }
        }
        
        data.push(item)

    } 

    return await data
}

export const DeleteImages = (dataRequest) => async (dispatch) => {
    
    dispatch({ type: CHECKLIST_CUSTOMER_TAISAN_HANDOVER_DELETE_FILE_REQUEST });
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
                //console.log(ret.data)
                dispatch({
                    type: CHECKLIST_CUSTOMER_TAISAN_HANDOVER_DELETE_FILE_SUCCESS,
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
                dispatch({ type: CHECKLIST_CUSTOMER_TAISAN_HANDOVER_DELETE_FILE_FAILURE, payload: { data: ret.message } });
                return false
            }
        }
        else {
            dispatch({ type: CHECKLIST_CUSTOMER_TAISAN_HANDOVER_DELETE_FILE_FAILURE, payload: { data: ret.message } });
            return false
        }
    } catch (error) {
        dispatch({ type: CHECKLIST_CUSTOMER_TAISAN_HANDOVER_DELETE_FILE_FAILURE, payload: { data: ret.message } });
        return false
    }


}



// export const progressHandle = (dataRequest) => async (dispatch) => {
//     dispatch({ type: FEEDBACK_PROGRESS_REQUEST });
//     try {
//         const token = await firebase.auth().currentUser.getIdToken();
//         const response = await axios.put(`${helper.URL_API}/Vendors/Feedback/Reply`,
//             dataRequest,
//             {
//                 headers: {
//                     Authorization: `bearer ${token}`
//                 }
//             })
//         console.log(response)
//         if (response.status === 200) {
//             dispatch({
//                 type: FEEDBACK_PROGRESS_SUCCESS
//             });
//         } else {
//             dispatch({
//                 type: FEEDBACK_PROGRESS_FAILURE,
//                 payload: {
//                     data: response.message
//                 }
//             });
//         }
//     } catch (error) {
//         console.log(error)
//         dispatch({
//             type: FEEDBACK_PROGRESS_FAILURE,
//             payload: {
//                 data: 'Xảy ra lỗi'
//             }
//         });
//     }
// };

export const resetStateByKey = (payload) => ({
    type: CHECKLIST_CUSTOMER_TAISAN_GETLIST_RESET_BY_KEY,
    payload
});
export const refreshDataHandle = () => ({
    type: CHECKLIST_CUSTOMER_TAISAN_GETLIST_REFRESHING
});

// export const goListTaiSan = payload => ({
//     type: CHECKLIST_GO_LIST_TAISAN,
//     payload
// });

