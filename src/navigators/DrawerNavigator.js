import { createDrawerNavigator,createAppContainer } from 'react-navigation'
import HomeScreen from '../screens/home';

import Drawer from '../components/Drawer'

import colors from '../theme/colors';

const DrawerMain = createDrawerNavigator(
    {
        home: { screen: HomeScreen }
    },
    {
        contentComponent: Drawer,
        overlayColor: 'rgba(68, 68, 68, 0.6)'
    }
)

export default createAppContainer(DrawerMain)
