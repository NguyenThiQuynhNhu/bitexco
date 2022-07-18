import { combineReducers } from 'redux'
import { createNavigationReducer } from 'react-navigation-redux-helpers'

import auth from './auth'
import vendor from './vendor'
import news from './news'
import request from './request'
import requestCreate from './requestCreate'
import requestDetail from './requestDetail'
import notification from './notification'
import vendorDetail from './vendorDetail'
import vendorRequest from './vendorRequest'
import vendorHome from './vendorHome'
import vendorNews from './vendorNews'
import departmentDetail from './departmentDetail'
import fee from './fee'
import feeDetail from './feeDetail'
import app from './app'
import paymentHistory from './paymentHistory'
import utilities from './utilities'
import utilitiesServices from './utilitiesServices'
import utilitiesServicesDetail from './utilitiesServicesDetail'
import utilitiesServicesExtension from './utilitiesServicesExtension'
import utilitiesServicesExtensionDetail from './utilitiesServicesExtensionDetail'
import utilitiesServicesBasic from './utilitiesServicesBasic'
import utilitiesServicesBasicDetail from './utilitiesServicesBasicDetail'
import utilitiesBasicDetail from '././utilitiesBasicDetail'
import utilitiesBasicBooking from '././utilitiesBasicBooking'
import hotline from '././hotline'

import { AppNavigator } from '../../navigators/AppNavigators'

const navReducer = createNavigationReducer(AppNavigator)

const reducers = combineReducers({
    app,
    nav: navReducer,
    auth,
    vendor,
    news,
    fee,
    feeDetail,
    request,
    requestCreate,
    requestDetail,
    notification,
    vendorDetail,
    vendorRequest,
    vendorNews,
    vendorHome,
    departmentDetail,
    paymentHistory,
    utilities,
    utilitiesServices,
    utilitiesServicesDetail,
    utilitiesServicesExtension,
    utilitiesServicesExtensionDetail,
    utilitiesServicesBasic,
    utilitiesServicesBasicDetail,
    utilitiesBasicDetail,
    utilitiesBasicBooking,
    hotline
})

export default reducers
