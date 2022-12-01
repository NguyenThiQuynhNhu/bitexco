import _ from 'lodash';


const INITIAL_STATE = {
    user: '',
    pass: ''
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'LOGIN_REQUEST': {
            return {
                user: action.payload ? action.payload.data.phoneNumber : '',
                pass: action.payload ?  action.payload.data.password : ''
            }
        }
        default:
            return state;
    }
};
