import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '../../navigators/AppNavigators';

import {
    LOGIN_SUCCESS,
    NAV_HOME,
    NAV_LOGIN,
    NAV_VENDOR_DETAIL,
    NAV_VENDOR_INFO
} from '../../actions/actionTypes';

const initialState = AppNavigator.router.getStateForAction(
    AppNavigator.router.getActionForPathAndParams('splash')
);
console.log(initialState);

export default (state = initialState, action) => {
    let nextState;
    console.log(action.type);
    switch (action.type) {
        case LOGIN_SUCCESS:
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.navigate({ routeName: 'main' }),
                state
            );
            break;
        case NAV_HOME:
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.navigate({ routeName: 'main' }),
                state
            );
            break;
        case NAV_LOGIN:
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.navigate({ routeName: 'login' }),
                state
            );
            break;
        case 'LOGOUT_SUCCESS':
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.reset({
                    index: 0,
                    key: null,
                    actions: [NavigationActions.navigate({ routeName: 'login' })]
                }),
                state
            );

            break;
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
            nextState = AppNavigator.router.getStateForAction(action, state);
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