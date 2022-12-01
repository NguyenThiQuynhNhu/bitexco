import moment from "moment";
import Strings from "./languages";

export const converTypeToIcon = (typeId) => {
  switch (typeId) {
    case 1: //Công việc
      return "clock";

    case 2: //Tin tức
      return "volume-low";

    case 3: //Tiện ích
      return "#2ca935";

    case 4: //Dịch vụ
      return "#333";

    case 5: //checklist
      return "clipboard-check-outline";

    case 6: //propsal
      return "message-settings-variant";

    case 7: //shift
      return "calendar-clock";

    default:
      return "volume-low";
  }
};

export const converTypeToString = (id) => {
  console.log(id);
  switch (id) {
    case "0":
      return Strings.notifycation.all;
    case "1":
      return Strings.notifycation.request;

    case "3":
      return Strings.notifycation.service;
    case "4":
      return Strings.notifycation.extension;
    case "5":
      return "Checklist";
    case "6":
      return Strings.notifycation.suggestedRepair;

    default:
      return Strings.notifycation.all;
  }
};
