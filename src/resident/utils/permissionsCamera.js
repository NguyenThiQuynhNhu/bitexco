/*
 * Get GPS coordinates promise for Android and iOS
 * This React Native component fixes the particular error that comes from Android: "location request timed out"
 * @author a3diti
 * 0x332D7E58
USAGE:
import getCoordinates from './gps'
getCoordinates().then(position => {
  const coordinates = position.coords.latitude+','+position.coords.longitude
  Alert.alert(coordinates)
}).catch(error => {
  Alert.alert(error.message)
})
*/

import { PermissionsAndroid } from 'react-native'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker/src/index';
const requestPermission = () => {
	console.log('222')
	return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message:"App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        },
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "App write external storage Permission",
          message:"App needs access to your storage ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
	).then(granted => {
		if(granted === PermissionsAndroid.RESULTS.GRANTED) {
		  return Promise.resolve("Camera permission given")
		} else {
		  return Promise.reject("Camera permission denied")
		}
	})
}

const getImage = () => {
	return requestPermission()
	.then(ok => {
		console.log('ok', ok)
		return new Promise((resolve, reject) => {
			console.log('resolve', resolve)
			console.log('reject', reject)
            const options = {
                saveToPhotos: true,
                quality: 1,
                maxWidth: 512,
                maxHeight: 512,
                includeBase64: true,
                //mediaType: 'photo',
                //videoQuality: 'high',
            };
			launchCamera(options, resolve, reject)
	  })
	})
}

export default getImage