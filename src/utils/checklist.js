import Strings from './languages'
import moment from 'moment'

export const converStatusToColor = (id) => {
    switch (id) {
        case 1: return '#fab53e';
        case 2: return '#00adef';
        case 3: return '#2ca935';
        case 4: return '#333';
        default: return '#FF0000';
    }
}

export const converStatusToString = (id) => {
    switch (id) {
        case 0: return 'Mới';
        case 1: return 'Đang thực hiện';
        case 2: return 'Chờ duyệt';
        case 3: return 'Đã duyệt';
        case 4: return 'Đã hủy';
        default: return '';
    }
}

export const converLevelToString = (id) => {
    switch (id) {
        case 1: return 'LOẠI TÀI SẢN';
        case 2: return 'TÊN TÀI SẢN';
        case 3: return 'CHI TIẾT TÀI SẢN';
        default: return '';
    }
}