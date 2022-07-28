import Strings from "./languages";
import moment from "moment";

// export const converStatusToColor = (id) => {
//     switch (id) {
//         case 2: return '#fab53e';
//         case 3: return '#2ca935';
//         case 5: return '#333';
//         default: return '#FF0000';
//     }
// }
export const converStatusToColor = (id) => {
  switch (id) {
    case "dang_xu_ly":
      return "#fab53e";
    case "hoan_thanh":
      return "#2ca935";
    case "dong":
      return "#333";
    default:
      return "#FF0000";
  }
};
export const converStatusToColorServiceByString = (id) => {
  switch (id) {
    case "Đã xác nhận":
      return "#fab53e";
    case "Đã hoàn thành":
      return "#2ca935";
    case "Đã hủy":
      return "#333";
    default:
      return "#FF0000";
  }
};
export const converStatusToColorService = (id) => {
  switch (id) {
    case 2:
      return "#fab53e";
    case 3:
      return "#2ca935";
    case 5:
      return "#333";
    default:
      return "#FF0000";
  }
};

export const converTypeToSource = (id) => {
  switch (id) {
    case 0:
      return "Tất cả";
    case 1:
      return "Từ cư dân";
    case 2:
      return "Từ vận hành";
    default:
      return "";
  }
};

export const converStatusToString = (id) => {
  switch (id) {
    case 1:
      return "Mới"; //Yêu cầu mới
    case 2:
      return "Đang xử lý"; //Yêu cầu mới
    case 3:
      return "Đã hoàn thành"; //Đang xử lý
    case 5:
      return "Đã đóng"; //Đã xử lý xong
    case 6:
      return "Hủy phiếu"; //Hủy phiếu
    case 8:
      return "Xử lý lại"; //Xử lý lại
    case 9:
      return "Giao nhân viên"; //Xử lý lại
    case 13:
      return "Khách phản hồi"; //Khách phản hồi
    case 49:
      return "Chuyển nhà thầu"; //Chuyển nhà thầu
    case 56:
      return "Phản hồi"; //Phan hoi
    default:
      return Strings.listRequest.option1;
  }
};
// export const converStatusToStringService = (id) => {
//     switch (id) {
//         case 1: return 'Mới';//Yêu cầu mới
//         case 2: return 'Đang xử lý';//Yêu cầu mới
//         case 3: return 'Đã hoàn thành';//Đang xử lý
//         case 5: return 'Đã đóng';//Đã xử lý xong
//         case 6: return 'Hủy phiếu';//Hủy phiếu
//         case 8: return 'Xử lý lại';//Xử lý lại
//         case 9: return 'Giao nhân viên';//Xử lý lại
//         case 13: return 'Khách phản hồi';//Khách phản hồi
//         case 49: return 'Chuyển nhà thầu';//Chuyển nhà thầu
//         case 56: return 'Phản hồi'//Phan hoi
//         default: return Strings.listRequest.option1;
//     }
// }

export const converStatusToIcon = (id) => {
  switch (id) {
    case 0:
      return "layers3"; //Tất cả
    case 1:
      return "yu-cu-mi-01"; //Yêu cầu mới
    case 2:
      return "setting3"; //Đang xử lý
    case 3:
      return "check"; //Đã xử lý xong
    case 5:
      return "delete1"; //Báo Cáo Hoàn Thành
    case 6:
      return "pause-circle"; //Hủy phiếu
    case 8:
      return "reprocess"; //Xử lý lại
    case 9:
      return "user-plus"; //Giao nhân viên
    case 13:
      return "reply"; //Khách phản hồi
    case 49:
      return "corner-right-up"; //Chuyển nhà thầu
    case 56:
      return "transfer"; //Phan hoi
    default:
      return "settings";
  }
};

export const myFromNow = (created_at) => {
  let time = "";
  const duration = moment().diff(created_at, "days");
  if (duration == 0) {
    time = moment(created_at).fromNow();
  } else if (duration == 1) {
    time = moment(created_at).format("[Hôm qua lúc] HH:mm");
  } else if (duration <= 7) {
    time = moment(created_at).format("dddd [lúc] HH:mm");
  } else {
    time = moment(created_at).format("DD [tháng] MM [lúc] HH:mm");
  }
  return time;
};
