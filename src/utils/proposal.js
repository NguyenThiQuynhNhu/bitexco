import Strings from './languages'
import moment from 'moment'

export const converStatusToString = (id) => {
    switch (id) {
        case 0: return 'Chờ duyệt';
        case 1: return 'Đã duyệt';
        case 2: return 'Không duyệt';
        default: return 'Tất cả';
    }
}