// import { Toast } from 'native-base';
// import Color from '../Libs/Color';
import { Alert, AlertIOS } from 'react-native';

export const show = (message='Thành công!') => {
    // Toast.show({
    //     text: message,
    //     type: type,
    //     duration:2000
    //   })
    Alert.alert('Thông báo', message);
}
