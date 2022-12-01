// import { Toast } from 'native-base';
// import Color from '../Libs/Color';
import { Alert, AlertIOS } from 'react-native';

import Strings from "./languages";
export const show = (message=`${Strings.message.saveSuccess}!`) => {
    // Toast.show({
    //     text: message,
    //     type: type,
    //     duration:2000
    //   })
    console.log(message)
    Alert.alert(Strings.handover.notify, message);
}
