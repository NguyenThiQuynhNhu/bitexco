import Strings from './languages';
import moment from 'moment';

export const converStatusToColor = (id) => {
    switch (id) {
        case 2: return '#fab53e';
        case 3: return '#2ca935';
        case 4: return '#333';
        case 5: return '#333';
        default: return '#FF0000';
    }
}
export const converStatusToColor2 = (id) => {
    switch (id) {
        case 2: return '#FFC080';
        case 3: return '#80FF80';
        case 4: return '#C0C0C0';
        case 5: return '#C0C0C0';
        default: return '#FF8080';
    }
}

export const converStatusToString = (id) => {
    switch (id) {
        case 2: return Strings.serviceBasic.option2;
        case 3: return Strings.serviceBasic.option3;
        case 4: return Strings.serviceBasic.option4;
        default: return Strings.serviceBasic.option1;
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