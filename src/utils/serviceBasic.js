import Strings from './languages'
import moment from 'moment'

export const converStatusToColor = (id) => {
    switch (id) {
        case 2: return '#fab53e';
        case 3: return '#2ca935';
        case 4: return '#333';
        default: return '#FF0000';
    }
}
export const converStatusToString = (id) => {
    switch (id) {
        case 1: return 'Mới';
        case 2: return 'Đã xác nhận';
        case 3: return 'Đã hoàn thành';
        case 4: return 'Đã huỷ';
        default: return '';
    }
}

export const myFromNow=(created_at)=>{
    let time = ''
    const duration = moment().diff(created_at, 'days')
    if (duration == 0) {
        time = moment(created_at).fromNow()
    } else if (duration == 1) {
        time = moment(created_at).format('[Hôm qua lúc] HH:mm')
    } else if (duration <= 7) {
        time = moment(created_at).format('dddd [lúc] HH:mm')
    } else {
        time = moment(created_at).format('DD [tháng] MM [lúc] HH:mm')
    }
    return time
}