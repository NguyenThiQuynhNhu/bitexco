import AsyncStorage from '@react-native-community/async-storage'
import { applyMiddleware, compose, createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import thunk from 'redux-thunk'
import reducers from '../redercers'

const config = {
  key: 'root',
  timeout: null,
  storage: AsyncStorage,
  blacklist: [
    'nav',
    'vendor',
    'news',
    'fee',
    'feeDetail',
    'request',
    'requestCreate',
    'requestDetail',
    'notification',
    'vendorDetail',
    'vendorRequest',
    'vendorNews',
    'vendorHome',
    'departmentDetail',
    'paymentHistory',
    'utilities',
    'utilitiesServices',
    'utilitiesServicesDetail',
    'utilitiesServicesExtension',
    'utilitiesServicesExtensionDetail',
    'utilitiesServicesBasic',
    'utilitiesServicesBasicDetail',
    'utilitiesBasicDetail',
    'utilitiesBasicBooking',
    'ewallet'
  ]
}

export default function configureStore(onComplete) {
  const enhancers =compose(applyMiddleware(thunk))
  const persistedReducer = persistReducer(config, reducers)
  const store = createStore(persistedReducer, enhancers)
  persistStore(store, { enhancers }, onComplete)
  return store
}