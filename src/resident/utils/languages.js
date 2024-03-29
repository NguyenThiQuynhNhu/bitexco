// ES6 module syntax
import LocalizedStrings from "react-native-localization";

// CommonJS syntax
// let LocalizedStrings  = require ('react-native-localization');

let Strings = new LocalizedStrings({
  vi: {
    home: {
      categories: "Doanh mục chức năng",
      titleNews1: "Tin mới",
      titleNews2: "Bài viết khác",
      projectInformation: "Thông tin dự án",
      registeredUtility: "Tiện ích đã đăng ký",
      registeredService: "Dịch vụ đã đăng ký",
      survey: "Phiếu khảo sát",
      carCard: "Thẻ xe",
      contact: "Liên hệ",
      buildingList: "Danh sách tòa nhà",
      roleChange: "Đổi vai trò người dùng",
      accountManagement: "Quản lý tài khoản",
      moreNews: "Xem thêm",
      help: "Hướng dẫn sử dụng App Bitexco",
    },
    message: {
      alert: "Thông báo",
      please: "Please type",
      pleaseType: "Vui lòng nhập",
      saveSuccess: "Cập nhật thành công.",
      saveError: "Đã xảy ra lỗi. Vui lòng thử lại sau, xin cảm ơn.",
      CODE_OTP_INVALID:
        "Mã xác thực không chính xác. Vui lòng thử lại, xin cảm ơn.",
      DATA_NOT_FOUND:
        "Số điện thoại chưa đăng ký. Vui lòng liên hệ Ban quản lý, xin cảm ơn.",
      INVALID_ACCESS:
        "Số điện thoại chưa đăng ký. Vui lòng liên hệ Ban quản lý, xin cảm ơn.",
      RESIDENTS_NOT_IN_THE_BUILDING:
        "Đã xảy ra lỗi. Vui lòng liên hệ Ban quản lý, xin cảm ơn.",
      PASS_INVALID: "Mật khẩu không chính xác.",
      bookSuccess: "Đặt thành công",
    },
    app: {
      placeholderSearchBar: "Tìm kiếm",
      emptyData: "Không có dữ liệu",
      error: "Lỗi kết nối",
      touchToRefresh: "Chạm để thử lại",
      cancel: "Hủy",
      close: "Đóng",
      chose: "Chọn",
      progressing: "Đang xử lý...",
      loading: "Đang tải dữ liệu...",
      confirm: "Xác nhận",
      description: "Diễn giải",
      download: "Tải về",
      message: "Phiên đã hết hạn. Bạn có muốn đăng nhập lại?",
      label1: "Hệ thống",
      label2: "Tiện ích",
    },
    tabbar: {
      home: "Trang chủ",
      // notification: 'Thông báo',
      request: "Phản ánh",
      more: "Thêm",
      my: "Của tôi",
      news: "Tin tức",
      payment: "Thanh toán",
      utility: "Tiện ích",
    },
    login: {
      logo: "MIK Home Living Excellence",
      title: "Vui lòng nhập Số điện thoại để tiếp tục",
      title2: "Quý khách vui lòng kiểm tra hộp thư SMS để nhận mã xác thực",
      titleRegister: "Tạo một tài khoản để trải nghiệm tất cả các tính năng",
      phone: "Số điện thoại",
      password: "Mật khẩu",
      passwordNew: "Mật khẩu mới",
      passwordRetype: "Nhập lại mật khẩu",
      passwordRetypeNew: "Nhập lại mật khẩu mới",
      code: "Mã xác thực",
      button1: "Tiếp tục",
      button2: "Xác thực",
      button3: "Đăng ký",
      resent: "Gửi lại mã",
      changephone: "Đổi số điện thoại",
      byOTP: "Sử dụng OTP",
      byPass: "Sử dụng mật khẩu",
      emptyPhone: "Vui lòng nhập số điện thoại đã đăng ký",
      emptyPass: "Vui lòng nhập số điện thoại hoặc mật khẩu đã đăng ký",
      notify1: "Vui lòng nhập đầy đủ thông tin",
      notify2: "Mật khẩu nhập lại không đúng",
      label1: "Đã có tài khoản?",
      label2: "Bạn chưa có tài khoản?",
      label3: "Đăng nhập",
      changePass: "Đổi mật khẩu",
      listBuilding: "Danh sách toà nhà",
    },
    listVendor: {
      option1: "Đã tham gia",
      option2: "Chưa tham gia",
      option3: "Tất cả",
    },
    detailVendor: {
      leave: "Rời khỏi",
      join: "Tham gia",
      more: "Thêm",
      request: "Quản lý yêu cầu",
      news: "Quản lý tin tức",
      fee: "Tra cứu phí",
      info: "Giới thiệu",
    },
    fee: {
      total: "Tổng phí dịch vụ theo tháng",
      detail: "chi tiết",
      unit: "Đơn vị tính",
      contractNo: "Số HĐ/Mã CH",
      balance: "Nợ đầu kỳ tháng",
      occursduring: "Phát sinh trong kỳ tháng",
      paid: "Đã thu",
    },
    listRequest: {
      option1: "Mới",
      option2: "Đang xử lý",
      option3: "Hoàn thành",
      option4: "Đã đóng",
    },
    createRequest: {
      navTitle: "Soạn yêu cầu",
      next: "Tiếp tục",
      vendor: "Gửi đến",
      department: "Nơi tiếp nhận",
      contractNo: "MÃ SỐ HĐ/CH",
      title: "Tiêu đề",
      content: "Nội dung",
      phone: "Số điện thoại",
      from: "Người gửi",
      date: "Thời gian liên lạc",
      at: "Vào lúc",
      unreceived: "Chưa tiếp nhận",
      received: "Đã tiếp nhận",
      placeholderVendor: "Chọn tòa nhà",
      placeholderDepartment: "Chọn phòng ban",
      contract: "Contract",
      placeholderTitle: "Nhập tiêu đề",
      placeholderContent: "Nhập nội dung yêu cầu",
      placeholderSender: "Tên người gửi",
      placeholderPhone: "Điện thoại liên hệ",
      titlePicker: "Ngày liên hệ",
      creatSucessAlert: "Tạo yêu cầu thành công",
      takeAPhoto: "Chụp ảnh",
      chooseAnImage: "Chọn hình ảnh",
      SelectFromGallery: "Chọn ảnh từ thư viện",
      cancel: "Huỷ",
      access: "Cấp quyền truy cập",
      access2: "Cho phép ứng dụng chụp ảnh và chọn từ thư viên ảnh",
      retry: " Thử lại",
      allow: " Cho phép",
      textPhoto: "Nhấn vào để tải ảnh",
    },
    detailRequest: {
      butonText: "Phản hồi",
      imagesCustomer: "Ảnh đã gửi",
      imagesAdmin: "Ảnh bql phản hồi",
      feedback: "Phản hồi",
      rating: "Đánh giá",
      ratingContentDefault: "Tôi hài lòng với chất lượng dịch vụ.",
      typeContent: "Vui lòng nhập nội dung.",
      sentRate: "Gửi đánh giá",
      rateSuccess: "Đánh giá thành công",
      feedbackSuccess: "Phản hồi thành công",
    },
    setting: {
      notification: "Thông báo",
      ring: "Đỗ chuông",
      vibrate: "Rung",
      message: "Khi có thông báo mới",
      language: "Ngôn ngữ",
      towerInfo: "Thông tin toà nhà",
      towerAddress: "Địa chỉ",
      departmentInfo: "Thông tin căn hộ",
      utilityRegister: "Tiện ích đã đăng ký",
      serviceRegister: "Dịch vụ đã đăng ký",
      surveySheet: "Phiếu khảo sát",
    },
    profile: {
      title: "Quản lý tài khoản",
      settinglanguage: "Ngôn ngữ",
      setting: "Cài đặt",
      logout: "Đăng xuất",
      questionLogout: "Bạn có chắc chắn muốn thoát ứng dụng?",
      changeTypeUser: "Đổi vai trò người dùng",
      questionChangeUser: "Bạn có chắc chắn muốn đổi sang tài khoản nhân viên?",
    },
    payment: {
      unpaidStatus: "Chưa thanh toán",
      paidStatus: "Đã thanh toán",
      time: "Kỳ tính phí",
      dealine: "Hạn thanh toán",
      status: "Trạng thái",
      total: "Tổng",
      paid: "Đã thanh toán",
      paidFront: "Thu trước",
      debt: "Còn lại",
      detailFee: "Chi tiết phí",
      contractNo: "Mã căn hộ",
      openingBalance: "Dư nợ",
      occursDuring: "Phát sinh",
      debitNote: "Thông báo phí",
      paymentHistory: "Lịch sử",
      title: "THANH TOÁN",
      summary: "TÓM TẮT",
      total: "Tổng tiền",
      discount: "Chiết khấu",
      afterDiscount: "Tổng tiền sau chiết khấu",
      bankPayment: "PHƯƠNG THỨC THANH TOÁN",
      momo: "Ví MoMo",
      vnpay: "VNPAY",
      agree: "Tôi đồng ý và Tiếp tục",
      description: "Ghi chú",
      number: "Số lượng",
      des: "Diễn giải",
      amount: "Thành tiền",
    },
    department: {
      code: "Mã căn",
      default: "Mặc định",
      save: "Lưu",
      titleHoline: "Thông tin liên hệ",
    },
    serviceBasic: {
      title: "Tiện ích",
      option1: "Chờ duyệt",
      option2: "Đã xác nhận",
      option3: "Đã duyệt",
      option4: "Đã huỷ",
      message: "Lời nhắn",
      deposit: "Tiền cọc",
      maximumAmountPeople: "Số lượng đặt tối đa",
      name: "Tên tiện ích",
      description: "Mô tả",
    },
    serviceExtension: {
      title: "Dịch vụ",
      message: "Lời nhắn",
      price: "Đơn giá",
      dateBook: "Ngày đặt",
      dateCreate: "Ngày tạo",
      deposit: "Tiền cọc",
      price: "Đơn giá",
      totalPrice: "Tổng tiền",
      amount: "Số lượng",
      messagePlaceholder: "Nhập lời nhắn",
      messageChoice: "Vui lòng chọn SUẤT ĐẶT, xin cảm ơn.",
      bookService: "Đặt dịch vụ",
      negotiable: "Thoả thuận",
    },
    serviceBasicBooking: {
      position: "Khu vực",
      deposit: "Tiền cọc",
      amountPeople: "Số lượng người",
      dateBook: "Ngày đặt",
      dateCreate: "Ngày tạo",
      time: "Suất đặt",
      message: "Lời nhắn",
      messagePlaceholder: "Nhập lời nhắn",
      messageChoice: "Vui lòng chọn SUẤT ĐẶT, xin cảm ơn.",
      zoneSelect: "Chọn khu",
      book: "Đặt tiện ích",
    },
    handoverSchedule: {
      title: "Lịch bàn giao",
    },
    surveyDetail: {
      isAnswer: "Đã thực hiện khảo sát!",
      titleModal:
        "Hãy tham gia khảo sát, hiểu được bạn giúp chúng tôi nâng cao chất lượng dịch vụ.",
      cancal: "Bỏ qua",
      agree: "Tham gia",
      sucsess: "Đã gửi khảo sát đến BQL!",
    },
    carCard: {
      name: "Thẻ xe", // "Car Card"
      title: "Danh sách thẻ xe", //"Car card list"
      activityCardText: "Thẻ hoạt động", // "Activity card"
      registrationCardText: "Thẻ đăng ký", //"Registration card"
      cancellationCardText: "Thẻ đã hủy", //"Cancellation card"
      carOwnerText: "Chủ xe",
      placeholderOwner: "Nhập chủ xe",
      licensePlateText: "Biển số",
      placeholderlicensePlate: "Nhập biển số",
      carColorText: "Màu xe",
      placeholderColor: "Nhập màu xe",
      carTypeText: "Loại xe",
      placeholderType: "Chọn loại xe",
      carModelText: "Đời xe",
      placeholderModel: "Nhập đời xe",
      approvedText: "Đã duyệt",
      cancelledText: "Đã hủy",
      requestCancelCardText: "Yêu cầu hủy thẻ xe", //"request to cancel the car card"
      cardCancellationWarningText: "Bạn có chắc chắn muốn yêu cầu hủy thẻ?", //"Are you sure you want to request cancellation?"
      cardHasBeenSentText: "Đã gửi yêu cầu hủy thẻ", //"Card cancellation request has been sent"
      deleteTheRequestText: "Xóa phiếu yêu cầu hủy thẻ xe", //"delete the request card to cancel the car card"
      alertThuHoiHuyThe: "Bạn có chắc chắn muốn thu hồi yêu cầu hủy thẻ?", //"Are you sure?"
      alertHuyThe: "Bạn có chắc chắn muốn hủy phiếu?", //"Are you sure?"
    },
  },
  en: {
    home: {
      categories: "Functional categories",
      titleNews1: "News",
      titleNews2: "More posts",
      projectInformation: "Project information",
      registeredUtility: "Registered utility",
      registeredService: "Registered Service",
      survey: "Survey",
      carCard: "Car card",
      contact: "Contact",
      buildingList: "Building List",
      roleChange: "Role change",
      accountManagement: "Account Management",
      moreNews: "More news",
      help: "Bitexco App User Guide",
    },
    message: {
      alert: "Alert",
      please: "Please",
      pleaseType: "Please typing",
      saveSuccess: "Updated successfull.",
      saveError: "Error! An error occurred. Please try again later.",
      CODE_OTP_INVALID:
        "Incorrect authentication code. Please try again, thanks.",
      DATA_NOT_FOUND:
        "Unregistered phone number. Please contact the management, thank you.",
      INVALID_ACCESS:
        "Unregistered phone number. Please contact the management, thank you.",
      RESIDENTS_NOT_IN_THE_BUILDING:
        "Error! An error occurred. Please contact the management, thank you.",
      PASS_INVALID: "Incorrect password.",
      bookSuccess: "Booking succesfully",
    },
    app: {
      placeholderSearchBar: "Find",
      emptyData: "No data",
      error: "Connecting failure",
      touchToRefresh: "Touch to try again",
      cancel: "Discard",
      close: "Cancel",
      chose: "Confirm",
      progressing: "Progressing...",
      loading: "Loading...",
      confirm: "confirm",
      description: "Description",
      download: "Download",
      label1: "System",
      label2: "Utilities",
      message: "Session has expired. Do you want to re-login?",
    },
    tabbar: {
      home: "Home",
      notification: "Anouncement",
      request: "Response",
      more: "More",
      my: "My",
      news: "News",
      payment: "Payment",
      utility: "Facility",
    },
    login: {
      logo: "MIK Home Living Excellence",
      title: "Please enter your Phone number to continue",
      title2: "Please check your SMS box to receive verify code",
      titleRegister: "Create an account to experience all the features",
      phone: "Phone number",
      password: "Password",
      passwordNew: "New password",
      passwordRetype: "Retype password",
      passwordRetypeNew: "Retype new password",
      code: "VerifyCode",
      button1: "Continue",
      button2: "Verify",
      button3: "Sign up",
      resent: "Resent Code",
      changephone: "Change Phone Number",
      byOTP: "Use OTP",
      byPass: "Use password",
      emptyPhone: "Please enter your registered phone number",
      emptyPass: "Please enter your registered phone number or password",
      notify1: "Please enter full information",
      notify2: "The confirmation password is incorrect",
      label1: "Had an account",
      label2: "Don't have an account",
      label3: "Login",
      changePass: "Change password",
      listBuilding: "List of buildings",
    },
    listVendor: {
      option1: "Joined",
      option2: "Not Join",
      option3: "All",
    },
    detailVendor: {
      leave: "Leave",
      join: "Join",
      more: "More",
      request: "Request Management",
      news: "News Management",
      fee: "Look up fees",
      info: "About",
    },
    fee: {
      total: "Total service fee by month",
      detail: "Detail",
      unit: "Unit",
      contractNo: "Contract No.",
      balance: "Opening Balance",
      occursduring: "Occurs during the month",
      paid: "Paid",
    },
    listRequest: {
      option1: "New",
      option2: "In process",
      option3: "Finish",
      option4: "Closed",
    },
    createRequest: {
      navTitle: "Write demand",
      next: "Next",
      vendor: "To",
      department: "Recipient",
      contractNo: "Contract no",
      title: "Title",
      content: "Content",
      phone: "Tel",
      from: "From",
      date: "Date",
      at: "Time",
      unreceived: "Not received",
      received: "Received",
      placeholderVendor: "Select tower",
      placeholderDepartment: "Select the reception board",
      contract: "Contract",
      placeholderTitle: "Type title",
      placeholderContent: "Type content request",
      placeholderSender: "Contact name",
      placeholderPhone: "Contact phone",
      titlePicker: "Date Contact",
      creatSucessAlert: "Successfully add demand",
      takeAPhoto: "Take a photo",
      chooseAnImage: "Choose An Image",
      SelectFromGallery: "Select photo from gallery",
      cancel: "Cancel",
      access: "Grant of access",
      access2: "Allows the app to take pictures and choose from photo gallery",
      retry: "Retry",
      allow: "Allow",
      textPhoto: "Click to download the photo",
    },
    detailRequest: {
      butonText: "Feedback",
      imagesCustomer: "Images sent",
      imagesAdmin: "Images feedback",
      feedback: "Feedback",
      rating: "Rate",
      ratingContentDefault: "I am pleased with service.",
      typeContent: "Please type content.",
      sentRate: "Send",
      rateSuccess: "Successfully add rate",
      feedbackSuccess: "Successfully add feedback",
    },
    setting: {
      notification: "Notification",
      ring: "Ringing",
      vibrate: "Vibrate",
      message: "When receive new notification",
      language: "language",
      towerInfo: "Building infomation",
      towerAddress: "Address",
      departmentInfo: "Apartment Information",
      utilityRegister: "Facility registered",
      serviceRegister: "Service registered",
      surveySheet: "Survey Sheet",
    },
    profile: {
      settinglanguage: "Language",
      setting: "Setting",
      logout: "Log out",
      questionLogout: "Are you sure you want to quit this app?",
      changeTypeUser: "Change user roles",
      questionChangeUser:
        "Are you sure you want to switch to an employee account?",
    },
    payment: {
      unpaidStatus: "Unpaid",
      paidStatus: "Paid",
      time: "Period",
      dealine: "Settle before",
      status: "State",
      total: "Total",
      paid: "Paid",
      paidFront: "Prepayment",
      debt: "Residual",
      detailFee: "Detail",
      contractNo: "Apt No",
      openingBalance: "Previous debt",
      occursDuring: "Incurred",
      debitNote: "Pro-form invoice",
      paymentHistory: "Payment progess",
      title: "PAYMENT",
      summary: "SUMMARY",
      total: "Total including VAT",
      discount: "Discount",
      afterDiscount: "After discount",
      bankPayment: "BANK PAYMENT",
      momo: "MoMo e-wallet",
      vnpay: "VNPAY",
      agree: "I agree and Continue",
      description: "Note",
      number: "Number",
      des: "Description",
      amount: "Amount",
    },
    department: {
      code: "Apt No",
      default: "Default",
      save: "Save",
      titleHoline: "Contact information",
    },
    serviceBasic: {
      title: "Facility",
      option1: "Waiting",
      option2: "Confirmed",
      option3: "Approved",
      option4: "Rejected",
      message: "Message",
      deposit: "Deposit",
      maximumAmountPeople: "Maximum people",
      name: "Name",
    },
    serviceExtension: {
      title: "Service",
      message: "Message",
      deposit: "Deposit",
      price: "Price",
      dateBook: "Date book",
      dateCreate: "Date create",
      time: "Time",
      message: "Message",
      price: "Price",
      totalPrice: "Total",
      amount: "Amount",
      message: "Message",
      messagePlaceholder: "Type message",
      bookService: "Book service",
      negotiable: "Negotiable",
    },
    serviceBasicBooking: {
      position: "Area",
      deposit: "Deposit",
      amountPeople: "Number of people",
      dateBook: "Booking date",
      dateCreate: "Date create",
      time: "Plot",
      message: "Comment",
      messagePlaceholder: "Type message",
      messageChoice: "Please choose [Plot]. Thank you",
      description: "description",
      zoneSelect: "Choice Position",
      book: "Book",
    },
    handoverSchedule: {
      title: "Handover schedule",
    },
    surveyDetail: {
      isAnswer: "Survey done!",
      titleModal:
        "Please participate in the survey, understand you help us improve service quality.",
      cancal: "Cancel",
      agree: "Ok",
      sucsess: "Submitted successfully",
    },
    carCard: {
      name: "Car Card",
      title: "Car card list",
      activityCardText: "Activity card",
      registrationCardText: "Registration card",
      cancellationCardText: "Cancellation card",
      carOwnerText: "Owner",
      placeholderOwner: "Type Owner",
      licensePlateText: "License Plate",
      placeholderlicensePlate: "Type License Plate",
      carColorText: "Car Color",
      placeholderColor: "Type Color",
      carTypeText: "Car Type",
      placeholderType: "Select car type",
      carModelText: "Car Model",
      placeholderModel: "Type Model",
      approvedText: "Approved",
      cancelledText: "Cancelled",
      requestCancelCardText: "Request to cancel the car card",
      cardCancellationWarningText:
        "Are you sure you want to request cancellation?",
      cardHasBeenSentText: "Card cancellation request has been sent",
      deleteTheRequestText: "Delete the request card to cancel the car card",
      alertHuyThe: "Are you sure?",
      alertThuHoiHuyThe: "Are you sure?",
    },
  },
});

module.exports = Strings;
