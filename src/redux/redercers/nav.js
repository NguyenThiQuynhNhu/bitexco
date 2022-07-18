import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '../../navigators/AppNavigators';

import {
    LOGIN_SUCCESS,
    NAV_LOGIN,
    CHECKLIST_GO_LIST_TAISAN,
    CHECKLIST_CUSTOMER_GO_LIST_TAISAN
} from '../../actions/actionTypes';

const initialState = AppNavigator.router.getStateForAction(
    AppNavigator.router.getActionForPathAndParams('splash')  
);

export default (state = initialState, action) => {
    let nextState;
    switch (action.type) {

        case LOGIN_SUCCESS: {
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.reset({
                    index: 0,
                    key: null,
                    actions: [NavigationActions.navigate({ routeName: 'home' })]
                }),
                state
            );
            // nextState = AppNavigator.router.getStateForAction(
            //     NavigationActions.navigate({ routeName: 'home' }),
            //     state
            // );
        } break;
        // case 'SAVE_USER': {
        //     nextState = AppNavigator.router.getStateForAction(
        //         NavigationActions.reset({
        //             index: 0,
        //             key: null,
        //             actions: [NavigationActions.navigate({ routeName: 'splash' })]
        //         }),
        //         state
        //     );
        //     // nextState = AppNavigator.router.getStateForAction(
        //     //     NavigationActions.navigate({ routeName: 'home' }),
        //     //     state
        //     // );
        // } break;
        case NAV_LOGIN: {
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.navigate({ routeName: 'login' }),
                state
            );
        } break;
        // case 'LOGOUT_SUCCESS': {
        //     nextState = AppNavigator.router.getStateForAction(
        //         NavigationActions.reset({
        //             index: 0,
        //             key: null,
        //             actions: [NavigationActions.navigate({ routeName: 'login' })]
        //         }),
        //         state
        //     );
        // } break;

        case CHECKLIST_GO_LIST_TAISAN: {
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.navigate({ routeName: 'DangThucHien_TaiSan' }),
                state
            );
        } break;

        case CHECKLIST_CUSTOMER_GO_LIST_TAISAN: {
            // nextState = AppNavigator.router.getStateForAction(
            //     NavigationActions.reset({
            //         index: 0,
            //         key: null,
            //         actions: [NavigationActions.navigate({ routeName: 'DangThucHien_TaiSan' })]
            //     }),
            //     state
            // );
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.navigate({ routeName: 'DangThucHien_TaiSan_KhachHang' }),
                state
            );
        } break;
        
        case 'GO_CHANGE_PASS': {
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.navigate({ routeName: 'changePass' }),
                state
            );
        } break;
        default:
            if (action.type === 'Navigation/NAVIGATE') {
                const { routes, index } = state;
                const { routeName, params } = action;
                const currentScreen = routes[index];
                // Check for duplication
                if (currentScreen.routeName === routeName /*&& isEqual(currentScreen.params, params)*/) {
                    return state;
                }
            }
            //const { routes, index } = state;
            // if(routes = 'splash'){
            //     console.log('routes1');
            // }
            // const { routeName, params } = action;
            // console.log('params', params);
            // nextState = AppNavigator.router.getStateForAction(action, state);
            if (action.type === 'SAVE_USER') {
                // nextState = AppNavigator.router.getStateForAction(
                //     AppNavigator.router.getActionForPathAndParams('splash', {type: action.typeUser})  
                // )
                // nextState = AppNavigator.router.getStateForAction(
                //     NavigationActions.navigate({ routeName: 'DangThucHien_TaiSan_KhachHang' }),
                //     state
                // );
                // console.log('nextState', AppNavigator.router.getStateForAction(action, state))
                // console.log('nextState1', AppNavigator.router.getStateForAction(action, AppNavigator.router.getStateForAction(
                //     AppNavigator.router.getActionForPathAndParams('login', {type: action.typeUser})  
                // )))
                // state = AppNavigator.router.getStateForAction(
                //     AppNavigator.router.getActionForPathAndParams('splash', {type: action.typeUser})  
                // );
                nextState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('splash', {type: action.typeUser})); 
            }else nextState = AppNavigator.router.getStateForAction(action, state);

            
            break;
    }
    
    return nextState || state;
};

export const getCurrentRoute = (state) => {
    if (state.index !== undefined) {
        return getCurrentRoute(state.routes[state.index]);
    }
    return state.routeName;
};