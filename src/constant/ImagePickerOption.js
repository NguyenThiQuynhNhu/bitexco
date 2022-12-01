
import Strings from "../utils/languages"; 

export default ImagePickerOption = {
    quality: 1.0,
    maxWidth: 512,
    maxHeight: 512,
    storageOptions: {
        skipBackup: true
    },
    title: Strings.createRequest.takeAPhoto,
      takePhotoButtonTitle: Strings.createRequest.chooseAnImage,
      chooseFromLibraryButtonTitle: Strings.createRequest.SelectFromGallery,
      cancelButtonTitle: Strings.createRequest.cancel,
    permissionDenied: {
        title: Strings.createRequest.access,
        text: Strings.createRequest.access2,
        reTryTitle: Strings.createRequest.retry,
        okTitle: Strings.createRequest.allow,
      },
}