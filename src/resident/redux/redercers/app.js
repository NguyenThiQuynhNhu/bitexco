import _ from 'lodash';



const INITIAL_STATE = {
    language: 'vi',
    enableVibrate: true,
    enableSound: true,
    enableNotification: true,
    keyWord: ['ádasd', 'ádasd', '1232']
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'APP_RESET_BY_KEY': {
            if (action.payload.key === 'state') {
                return INITIAL_STATE;
            }
            const newValues = state[action.payload.key];
            return {
                ...state,
                [action.payload.key]: action.payload.path && !_.isEmpty(action.payload.path) ? _.set(newValues, action.payload.path, action.payload.value) : action.payload.value
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
        default: return state;
    }
};