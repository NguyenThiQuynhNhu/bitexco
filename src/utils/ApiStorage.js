// import {AsyncStorage} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

_storeData = async (key,value) => {
    try {
      await AsyncStorage.setItem(key, value);
      return await {status:1,message:''}
    } catch (error) {
      // Error saving data
      return await {status:2,message:error}
    }
  }

  _retrieveData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // We have data!!
        // console.log(value);
        return await {status:1,content:value}
      }else{
        return await {status:0}
      }
      throw await 'null'
     } catch (error) {
       // Error retrieving data
       return await {status:2,content:error}
     }
  }


module.exports.set = _storeData;
module.exports.get = _retrieveData;