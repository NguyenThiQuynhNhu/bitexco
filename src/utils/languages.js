// ES6 module syntax
import LocalizedStrings from 'react-native-localization';

// CommonJS syntax
// let LocalizedStrings  = require ('react-native-localization');

let Strings = new LocalizedStrings({
    vi: {
        message: {
            please: 'Please',
            pleaseType: 'Vui lòng nhập',
            pleaseType: 'Vui lòng nhập',
            saveSuccess:'Cập nhật thành công.',
            saveError: 'Đã xảy ra lỗi. Vui lòng thử lại sau, xin cảm ơn.',
            CODE_OTP_INVALID: 'Mã xác thực không chính xác. Vui lòng thử lại, xin cảm ơn.',
            DATA_NOT_FOUND: 'Số điện thoại chưa đăng ký. Vui lòng liên hệ Ban quản lý, xin cảm ơn.',
            INVALID_ACCESS: 'Số điện thoại chưa đăng ký. Vui lòng liên hệ Ban quản lý, xin cảm ơn.',
            RESIDENTS_NOT_IN_THE_BUILDING: 'Đã xảy ra lỗi. Vui lòng liên hệ Ban quản lý, xin cảm ơn.',
            PASS_INVALID: 'Mật khẩu không chính xác.',
            bookSuccess: 'Đặt thành công'
        },
        app: {
            placeholderSearchBar: 'Tìm kiếm',
            emptyData: 'Không có dữ liệu',
            error: 'Lỗi kết nối',
            cancel: 'Hủy',
            chose: 'Chọn',
            progressing: 'Đang xử lý...',
            confirm: 'Xác nhận',
            description: 'Diễn giải'
        },
        tabbar: {
            home: 'Trang chủ',
            notification: 'Thông báo',
            request: 'Yêu cầu',
            more: 'Thêm',
            my: 'Của tôi',
            news: 'Tin tức'
        },
        login: {
            logo: "MIK Home Living Excellence",
            title: "Vui lòng nhập Số điện thoại để tiếp tục",
            title2: "Quý khách vui lòng kiểm tra hộp thư SMS để nhận mã xác thực",
            phone: "Số điện thoại",
            password: "Mật khẩu",
            code: "Mã xác thực",
            button1: 'Tiếp tục',
            button2: 'Xác thực',
            resent: 'Gửi lại mã',
            changephone: 'Đổi số điện thoại',
            byOTP: "Sử dụng OTP",
            byPass: "Sử dụng mật khẩu",
            emptyPhone: "Vui lòng nhập số điện thoại đã đăng ký",
            emptyPass: "Vui lòng nhập số điện thoại hoặc mật khẩu đã đăng ký",
            emptyOtp: "Vui lòng nhập otp gửi tới số điện thoại của bạn đã đăng ký",
            button3: 'Đăng ký',
            passwordRetype: "Nhập lại mật khẩu",
            label1: "Đã có tài khoản?",
            label2: "Bạn là cư dân chưa có tài khoản?",
            label3: "Đăng nhập",
            changePass: "Đổi mật khẩu"
        },
        listVendor: {
            option1: 'Đã tham gia',
            option2: 'Chưa tham gia',
            option3: 'Tất cả'
        },
        detailVendor: {
            leave: 'Rời khỏi',
            join: 'Tham gia',
            more: 'Thêm',
            request: 'Quản lý yêu cầu',
            news: 'Quản lý tin tức',
            fee: 'Tra cứu phí',
            info: 'Giới thiệu'
        },
        fee: {
            total: 'Tổng phí dịch vụ theo tháng',
            detail: 'chi tiết',
            unit: 'Đơn vị tính',
            contractNo: 'Số HĐ/Mã CH',
            balance: 'Nợ đầu kỳ tháng',
            occursduring: 'Phát sinh trong kỳ tháng',
            paid: 'Đã thu'
        },
        listRequest: {
            option1: 'Mới',
            option2: 'Đang xử lý',
            option3: 'Hoàn thành',
            option4: 'Đóng'

        },
        createRequest: {
            navTitle: 'Soạn yêu cầu',
            next: 'Tiếp tục',
            vendor: 'Gửi đến',
            department: 'Nơi tiếp nhận',
            contractNo: 'MÃ SỐ HĐ/CH',
            title: 'Tiêu đề',
            content: 'Nội dung',
            reason: 'Lý do',
            phone: 'Số điện thoại',
            from: 'Người gửi',
            date: 'Thời gian liên lạc',
            at: 'Vào lúc',
            unreceived: 'Chưa tiếp nhận',
            received: 'Đã tiếp nhận',
            placeholderVendor: 'Chọn tòa nhà',
            placeholderDepartment: 'Chọn phòng ban',
            placeholderEmployee: 'Chọn nhân viên',
            placeholderStatus: 'Chọn trạng thái',
            placeholderGroup: 'Chọn nhóm công việc',
            placeholderPriority: 'Chọn cấp độ',
            contract: 'Contract',
            placeholderTitle: 'Nhập tiêu đề',
            placeholderContent: 'Nội dung yêu cầu',
            placeholderReason: 'Lý do đổi ',
            placeholderSender: 'Tên người gửi',
            placeholderPhone: 'Điện thoại liên hệ',
            titlePicker: 'Ngày liên hệ',
            takeAPhoto: 'Chụp ảnh',
            chooseAnImage: 'Chọn hình ảnh',
            SelectFromGallery: 'Chọn ảnh từ thư viện',
            cancel: 'Huỷ',
            access: 'Cấp quyền truy cập',
            access2: 'Cho phép ứng dụng chụp ảnh và chọn từ thư viên ảnh',
            retry: ' Thử lại',
            allow: ' Cho phép'

        },
        detailRequest: {
            tabContent: 'Nội dung',
            tabHistory: 'Lịch sử',
            tabContact: 'Liên hệ',
            butonText: 'Phản hồi',
            imagesCustomer: 'Ảnh đã gửi',
            imagesAdmin: 'Ảnh bql phản hồi',
            forward: 'Chuyển tiếp',
            inform: 'Tiếp nhận',
            complete:'Hoàn thành'
        },
        forwardRequest: {
            group: 'nhóm xử lý',
            isChoseemployee: 'chọn nhân viên cụ thể',
            employee: 'nhân viên',
            phoneemployee: 'số đt nhân viên',
            resion: 'lý do chuyển tiếp',
            selectVendor: 'Chọn nhà cung cấp',
            unSelect: 'chưa chọn',
            inputPhonenumber: 'Nhập số điện thoại'
        },
        setting: {
            notification: 'thông báo',
            ring: 'Đỗ chuông',
            vibrate: 'Rung',
            message: 'Khi có thông báo mới',
            language: 'Ngôn ngữ',
            towerAddress: 'Địa chỉ',

        },
        profile: {
            setting: 'Cài đặt',
            logout: 'Đăng xuất',
            changeTypeUser: 'Đổi vai trò người dùng',
            questionChangeUser: 'Bạn có chắc chắn muốn đổi sang tài khoản cư dân?',

        },
        serviceBasicBooking:{
            position:'Khu vực',
            deposit:'Tiền cọc',
            amountPeople:'Số lượng người',
            dateBook: 'Ngày đặt',
            dateCreate: 'Ngày tạo',
            time: 'Suất đặt',
            message:'Lời nhắn',
            messagePlaceholder:'Nhập lời nhắn',
            messageChoice:'Vui lòng chọn SUẤT ĐẶT, xin cảm ơn.'
        },
        serviceExtension:{
            amount:'Số lượng',
            dateBook: 'Ngày đặt',
            dateCreate: 'Ngày tạo',
            message:'Lời nhắn',
            totalPrice: 'Tổng tiền',
            price:'Đơn giá'
        },
        checklist:{
            download:'Tải',
            unDownload: "Xoá tải"
        },
        home: {
            titleNews1: 'Tin mới',
            titleNews2: 'Bài viết khác'
        },
    },
    en: {
        home: {
            titleNews1: 'News',
            titleNews2: 'More posts'
        },
        message: {
            please: 'Please',
            pleaseType: 'Please typing',
            saveSuccess:'Updated successfull.',
            saveError: 'Error! An error occurred. Please try again later.',
            CODE_OTP_INVALID: 'Incorrect authentication code. Please try again, thanks.',
            DATA_NOT_FOUND: 'Unregistered phone number. Please contact the management, thank you.',
            INVALID_ACCESS: 'Unregistered phone number. Please contact the management, thank you.',
            RESIDENTS_NOT_IN_THE_BUILDING: 'Error! An error occurred. Please contact the management, thank you.',
            PASS_INVALID: 'Incorrect password.',
            bookSuccess: 'Booking succesfully'
        },
        app: {
            placeholderSearchBar: 'Search',
            emptyData: 'Empty Data',
            error: 'Conneting failure',
            cancel: 'Cancel',
            chose: 'Confirm',
            progressing: 'Progressing...',
            confirm: 'Confirm',
            description: 'Description'
        },
        tabbar: {
            home: 'Home',
            notification: 'Notification',
            request: 'Reuqest',
            more: 'More',
            my: 'My',
            news: 'News'
        },
        login: {
            logo: "MIK Home Living Excellence",
            title: "Please enter your Phone number to continue",
            title2: "Please check your SMS box to recive verify code",
            phone: "Phone number",
            password: "Password",
            code: "VerifyCode",
            button1: 'Continue',
            button2: 'Verify',
            resent: 'Resent Code',
            changephone: 'Change Phone Number',
            byOTP: "Use OTP",
            byPass: "Use password",
            emptyPhone: "Please enter your registered phone number",
            emptyPass: "Please enter your registered phone number or password",
            emptyOtp: "Please enter OTP",
            button3: 'Sign up',
            passwordRetype: "Retype password",
            label1: "Had an account",
            label2: "Don't have an account",
            label3: "Login",
            changePass: "Change password"
        },
        listVendor: {
            option1: 'Joined',
            option2: 'Not Join',
            option3: 'All'
        },
        detailVendor: {
            leave: 'Leave',
            join: 'Join',
            more: 'More',
            request: 'Request Management',
            news: 'News Management',
            fee: 'Look up fees',
            info: 'About'
        },
        fee: {
            total: 'Total service fee by month',
            detail: 'detail',
            unit: 'Unit',
            contractNo: 'Contract No.',
            balance: 'Opening Balance',
            occursduring: 'Occurs during the month',
            paid: 'Paid'
        },
        listRequest: {
            option1: 'New',
            option2: 'Progressing',
            option3: 'Complete',
            option4: 'Close'

        },
        createRequest: {
            navTitle: 'Compose Request',
            next: 'Next',
            vendor: 'Send to',
            department: 'Recipient',
            contractNo: 'Contract no',
            title: 'Title',
            content: 'Content',
            reason: 'Reason',
            phone: 'Phone',
            from: 'Sender',
            date: 'Contact time',
            at: 'At',
            unreceived: 'Not received',
            received: 'Received',
            placeholderVendor: 'Select tower',
            placeholderDepartment: 'Select the reception board',
            placeholderEmployee: 'Select Employee',
            placeholderStatus: 'Select Status',
            placeholderGroup: 'Select group',
            placeholderPriority: 'Select priority',

            contract: 'Contract',
            placeholderTitle: 'Enter title',
            placeholderContent: 'Content Request',
            placeholderReason: 'Reason Request',
            placeholderSender: 'Contact name',
            placeholderPhone: 'Contact phone',
            titlePicker: 'Date Contact',
            takeAPhoto: 'Take a photo',
            chooseAnImage: 'Choose An Image',
            SelectFromGallery: 'Select photo from gallery',
            cancel: 'Cancel',
            access: 'Grant of access',
            access2: 'Allows the app to take pictures and choose from photo gallery',
            retry: 'Retry',
            allow: 'Allow'
        },
        detailRequest: {
            tabContent: 'Content',
            tabHistory: 'History',
            tabContact: 'Contact',
            butonText: 'Feedback',
            imagesCustomer: 'Photos has been sent',
            imagesAdmin: 'Photos feedback',
            forward: 'Forward',
            inform: 'Inform',
            complete:'Complete'
        },
        forwardRequest: {
            group: 'Group',
            isChoseemployee: 'chọn nhân viên cụ thể',
            employee: 'Employee',
            phoneemployee: 'Phone number',
            resion: 'Resion',
            selectVendor: 'Select Vendor',
            unSelect: 'UnSelect',
            inputPhonenumber: 'Enter Phone Number'
        },
        setting: {
            notification: 'notification',
            ring: 'Ringing',
            vibrate: 'Vibrate',
            message: 'When receive new notification',
            language: 'Language',
            towerAddress: 'Address',

        },
        profile: {
            setting: 'Setting',
            logout: 'Logout',
            changeTypeUser: 'Change user roles',
            questionChangeUser: 'Are you sure you want to switch to an resident account?',
        },
        serviceBasicBooking:{
            position:'Position',
            deposit:'Deposit',
            amountPeople:'Amount people',
            dateBook: 'Date book',
            dateCreate:'Date create',
            time: 'Time',
            message:'Message',
            messagePlaceholder:'Type message',
            messageChoice:'Please select [TIME], thank you.'
        },
        serviceExtension:{
            amount:'Amount',
            dateBook: 'Date book',
            dateCreate: 'Date create',
            message:'Message',
            totalPrice: 'Total',
            price:'Price'
        },
        checklist:{
            download:'Download',
            unDownload: "Unload"
        }
    }
});

module.exports = Strings;
