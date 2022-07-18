// import _ from 'lodash';
// import {
//     FEE_GETLIST_REFRESHING,
//     FEE_GETLIST_REQUEST,
//     FEE_GETLIST_SUCCESS,
//     FEE_GETLIST_FAILURE,
//     FEE_GETLIST_RESET_BY_KEY

// } from '../../actions/actionTypes';


// const INITIAL_STATE = {
//     initList: false,
//     currentPage: 0,
//     rowPerPage: 20,
//     outOfStock: false, // đánh dấu dữ liệu trên API đã load hết,
//     emptyData: false,
//     isRefreshing: false,
//     isLoading: false,
//     data: [],
//     error: null,
//     isApplySearchKey:false,
//     searchKey:''
// };

// export default (state = INITIAL_STATE, action) => {
//     switch (action.type) {
//         case FEE_GETLIST_RESET_BY_KEY: {
//             if (action.payload.key === 'state') {
//                 return INITIAL_STATE;
//             }
//             const newValues = state[action.payload.key];
//             return {
//                 ...state,
//                 [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
//             };
//         }
//         case FEE_GETLIST_REQUEST: {
//             return {
//                 ...state,
//                 isLoading: true,
//                 emptyData: INITIAL_STATE.emptyData,
//                 error: INITIAL_STATE.error
//             };
//         }
//         case FEE_GETLIST_SUCCESS: {
//             // const newData = [...state.data, ...action.payload.data]

//             return {
//                 ...state,
//                 initList: false,
//                 isLoading: false,
//                 isRefreshing: false,
//                 data: action.payload.data,
//                 outOfStock: action.payload.data.length < state.rowPerPage,
//                 emptyData: action.payload.data.length === 0,
//                 currentPage: action.payload.data.length > 0 ? state.currentPage + 1 : state.currentPage,
//                 error: {
//                     hasError: false,
//                 }
//             };
//         }
//         case FEE_GETLIST_FAILURE: {
//             return {
//                 ...state,
//                 initList: INITIAL_STATE.initList,
//                 isLoading: false,
//                 isRefreshing: false,
//                 error: {
//                     hasError: true,
//                     error: action.payload.data.message 
//                 }
//             };
//         }
//         case FEE_GETLIST_REFRESHING: {
//             return {
//                 ...state,
//                 currentPage: INITIAL_STATE.currentPage,
//                 isRefreshing: true,
//                 outOfStock: INITIAL_STATE.outOfStock,
//                 data: INITIAL_STATE.data
//             };
//         }

//         case 'FEE_UPDATE_ITEM_TOLIST':
//             let newData = state.data;
//             newData = newData.map((item) => {
//                 if (item.time === action.payload.data.time) {
//                     const data = {
//                         time: item.time,
//                         title: item.title,
//                         amountOldDebt: item.amountOldDebt,
//                         amountIncurred: item.amountIncurred,
//                         amountPaid: item.amountPaid,
//                         amountLeft: item.amountLeft,
//                         isPaid: true,
//                         index: item.index
//                     };
//                     return { ...item, isPaid: true };
//                 }
//                 return item;
//             });
//         return { ...state, data: newData };

//         default:return state;
//     }
// };
