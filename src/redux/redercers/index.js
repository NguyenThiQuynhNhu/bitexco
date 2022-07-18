import { combineReducers } from 'redux'
import { createNavigationReducer } from 'react-navigation-redux-helpers'

import auth from './auth'
import vendor from './vendor'
import request from './request'
import requestCreate from './requestCreate'
import requestDetail from './requestDetail'
import app from './app'
import drawer from './drawer'
import statistics from './statistics'
import servicesExtension from './servicesExtension'
import servicesExtensionDetail from './servicesExtensionDetail'
import servicesBasic from './servicesBasic'
import servicesBasicDetail from './servicesBasicDetail'
import reportGeneral from './reportGeneral'
import reportGroupProgressStatus from './reportGroupProgressStatus'
import reportGroupProgressRating from './reportGroupProgressRating'
import reportGroupProgressTimeComplete from './reportGroupProgressTimeComplete'
import home from './home'

import proposal from './proposal'
import proposalDetail from './proposalDetail'
import checklist from './checklist'
import maintenance from './maintenance'
import checklistDetail from './checklistDetail'
import shifts from './shifts'
import shiftsDayList from './shiftsDayList'
import notification from './notification'
import dashboard from './dashboard'
import dashboardLevel2 from './dashboardLevel2'
import dashboardChecklist from './dashboardChecklist'
import water from './water'
import waterDetail from './waterDetail'
import electric from './electric'
import electricDetail from './electricDetail'
import shiftChange from './shiftChange'
import shiftChangeDetail from './shiftChangeDetail'
import shiftsChoice from './shiftsChoice'
import shiftsDayListChoice from './shiftsDayListChoice'
import gas from './gas'
import gasDetail from './gasDetail'
import checklist_dangthuchien_khachhang from './checklist_dangthuchien_khachhang'
import checklist_dangthuchien from './checklist_dangthuchien'
import utils from './utils'
import nav from './nav'
import checklist_dangthuchien_taisan from './checklist_dangthuchien_taisan'
import checklist_dangthuchien_taisan_khachhang from './checklist_dangthuchien_taisan_khachhang'
import checklist_handovermore from './checklist_handovermore'
import notification_bangiao from './notification_bangiao'
import vendorHome from './vendorHome'
import notificationResident from './notificationResident'
import news from './news'
import requestResident from './requestResident'
import requestCreateResident from './requestCreateResident'
import vendorDetail from './vendorDetail'
import requestDetailResident from './requestDetailResident'
import feeDetail from './feeDetail'
import paymentHistory from './paymentHistory'
import utilities from './utilities'
import utilitiesServices from './utilitiesServices'
import utilitiesBasicDetail from './utilitiesBasicDetail'
import utilitiesBasicBooking from './utilitiesBasicBooking'
import utilitiesServicesDetail from './utilitiesServicesDetail'
import utilitiesServicesExtension from './utilitiesServicesExtension'
import utilitiesServicesExtensionDetail from './utilitiesServicesExtensionDetail'
import fee from './fee'
import departmentDetail from './departmentDetail'
import utilitiesServicesBasic from './utilitiesServicesBasic'
import utilitiesServicesBasicDetail from './utilitiesServicesBasicDetail'
import hotline from './hotline'
import badge from './badge'
import handoverSchedule from './handoverSchedule'
import handoverScheduleDayList from './handoverScheduleDayList'
import building from './building'
import survey from './survey'
import surveyDetail from './surveyDetail'
import reportSurvey from './reportSurvey'
import carCard from './carCard'
import carCardCreate from './carCardCreate'
import version from './version'
import { AppNavigator } from '../../navigators/AppNavigators'

const navReducer = createNavigationReducer(AppNavigator)

const reducers = combineReducers({
    app,
    nav: navReducer,
    auth,
    vendor,
    drawer,
    request,
    requestCreate,
    requestDetail,
    servicesExtension,
    servicesExtensionDetail,
    statistics,
    servicesBasic,
    servicesBasicDetail,
    reportGeneral,
    reportGroupProgressStatus,
    reportGroupProgressRating,
    reportGroupProgressTimeComplete,
    home,
    proposal,
    checklist,
    maintenance,
    checklistDetail,
    shifts,
    shiftsDayList,
    proposalDetail,
    notification,
    dashboard,
    dashboardLevel2,
    dashboardChecklist,
    water,
    waterDetail,
    electric,
    electricDetail,
    shiftChange,
    shiftChangeDetail,
    shiftsChoice,
    shiftsDayListChoice,
    gas,
    gasDetail,
    checklist_dangthuchien_khachhang,
    checklist_dangthuchien,
    utils,
    nav,
    checklist_dangthuchien_taisan,
    checklist_dangthuchien_taisan_khachhang,
    checklist_handovermore,
    notification_bangiao,
    vendorHome,
    notificationResident,
    news,
    requestResident,
    vendorDetail,
    requestCreateResident,
    requestDetailResident,
    feeDetail,
    paymentHistory,
    utilities,
    utilitiesServices,
    utilitiesBasicDetail,
    utilitiesBasicBooking,
    utilitiesServicesDetail,
    utilitiesServicesExtension,
    utilitiesServicesExtensionDetail,
    fee,
    departmentDetail,
    utilitiesServicesBasic,
    utilitiesServicesBasicDetail,
    hotline,
    badge,
    handoverSchedule,
    handoverScheduleDayList,
    building,
    survey,
    surveyDetail,
    reportSurvey,
    carCard,
    carCardCreate,
    version

})

export default reducers
