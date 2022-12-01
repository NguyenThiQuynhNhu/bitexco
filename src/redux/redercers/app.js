import _ from 'lodash';



const INITIAL_STATE = {
    isLoading: false,
    showModal: false,
    language: 'vi',
    enableVibrate: true,
    enableSound: true,
    enableNotification: true,

    // language: 'vi',
    // enableVibrate: true,
    // enableSound: true,
    // enableNotification: true,
    keyWord: ['ádasd', 'ádasd', '1232']
};

export default (state = INITIAL_STATE, action) => {
    //console.log(action)
    switch (action.type) {
        
        case 'APP_RESET_BY_KEY': {
            console.log(action)
            console.log(action.payload)
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            return {
                ...state,
                ...action.payload
            };
        }
        case 'APP_ON_SUBMIT_EDITTING':{
            return{
                ...state,
                keyWord: [...state.keyWord, action.payload.searchKey]
            }
        }
        case 'APP_ON_CHANGE_TEXT':{
            return{
                ...state,
                keyWord: [...state.keyWord, action.payload]
            }
        }
        default:
            return state;
    }
};