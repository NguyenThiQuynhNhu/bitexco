import Strings from './languages';
import moment from 'moment';

export const converStatusToColor = (id) => {
    switch (id) {
        case 'dang_xu_ly': return '#fab53e';
        case 'hoan_thanh': return '#2ca935';
        case 'dong': return '#333';
        default: return '#FF0000';
    }
}
export const converStatusToColorService = (id) => {
    switch (id) {
        case 2: return '#fab53e';
        case 3: return '#2ca935';
        case 5: return '#333';
        default: return '#FF0000';
    }
}
export const converStatusToColorServiceByString = (id) => {
    switch (id) {
        case 'Đang xử lý': return '#fab53e';
        case 'Đã hoàn thành': return '#2ca935';
        case 'Đã đóng': return '#333';
        default: return '#FF0000';
    }
}
export const converStatusToString = (id) => {
    switch (id) {
        case 2: return Strings.listRequest.option2;
        case 3: return Strings.listRequest.option3;
        case 5: return Strings.listRequest.option4;
        default: return Strings.listRequest.option1;
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