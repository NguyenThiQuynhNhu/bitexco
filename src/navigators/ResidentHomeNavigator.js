import { createDrawerNavigator,createAppContainer } from 'react-navigation'
import HomeScreenResident from '../resident/Home';

import colors from '../theme/colors';

const DrawerMainResident = createDrawerNavigator(
    {
        home: { screen: HomeScreenResident }
    }
)

export default createAppContainer(DrawerMainResident)