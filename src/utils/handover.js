import Strings from './languages'

export const converDateToByString = (text) => {
    switch (text) {
        case "Hôm nay":
            return Strings.handover.today;
        case "Hôm qua":
            return Strings.handover.yesterday;
        case "Tháng này":
            return Strings.handover.thisMonth;
        case "Năm này":
            return Strings.handover.thisYear;
        case "Thời gian":
            return Strings.handover.time;
        default:
            return "";
    }
};

export const converStatusToByString = (text) => {
    switch (text) {
        case "Chờ bàn giao nội bộ":
            return Strings.handover.status1;
        case "Chuyển nhà thầu xử lý":
            return Strings.handover.status2;
        case "Chờ bàn giao khách hàng":
            return Strings.handover.status3;
        case "Nhà thầu đã sửa chữa xong":
            return Strings.handover.status4;
        case "Tất cả":
            return Strings.handover.status5;
        case "Chờ bàn giao khách hàng":
            return Strings.handover.status6;
        case "Bàn giao không thành công (Có lỗi)":
            return Strings.handover.status7;
        case "Bàn giao thành công có lỗi":
            return Strings.handover.status8;
        case "Đã bàn giao thành công":
            return Strings.handover.status9;
        case "Nhà thầu đã sửa chữa xong":
            return Strings.handover.status10;
        case "Mặc nhiên bàn giao":
            return Strings.handover.status11;
            case "Bàn giao nội bộ thành công (có lỗi)":
            return Strings.handover.status12;
        case "Bàn giao nội bộ thành công":
            return Strings.handover.status13;
        default:
            return "";
    }
};