//import liraries
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Platform,
    ScrollView,
    Image,
    Modal,
    FlatList,
    Keyboard,
    Switch
} from 'react-native';
import * as mineTypes from 'react-native-mime-types';
import DateTimePicker from 'react-native-modal-datetime-picker';

import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import Lightbox from 'react-native-lightbox';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import _ from 'lodash';
import Toast, { DURATION } from 'react-native-easy-toast';
import ModalPicker from '../../../components/common/ModalPicker';
import colors from '../../../theme/colors';
import { MyIcon } from '../../../theme/icons';
import { titleStyle } from '../../../theme/styles'
import Lookup from '../../../components/Request/RequestCreate/Lookup';
import { createRequestHandle } from '../../../actions/requestCreate';
import Strings from '../../../utils/languages';
import ImageProgress from '../../../components/common/ImageProgress';
import NavBar from '../../../components/common/NavBar';
import IconButton from '../../../components/common/IconButton';
import fontsize from '../../../theme/fontsize';


// create a component
class CreateScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalView: null,
            modalVisible: false,
            images: [],
            levelSelected: null,
            showModalLevel: false,
            isToggleDate: false,
            isToggleTimeFrom: false,
            isToggleTimeTo: false,
            title: '',
            content: '',
            time: '',
            day: '',
            userContact: props.user.fullName,
            phoneContact: props.user.phoneNumber,
            depSelected: null,
            employeeSelected: null,
            groupSelected: null,
            apartmentSelected: null
        }
    }

    componentWillUnmount() {
        // this.props.resetStateByKey({ key: 'state', path: '', value: null });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.error && nextProps.error !== this.props.error) {
            if (nextProps.error.status === 200) {
                this.props.navigation.goBack();
            }
        }
    }
    componentDidMount() {
        this.props.navigation.dispatch({ type: 'SAVE_KEY', payload: this.props.navigation.state.key });
        this.props.navigation.setParams({ onAttachment: this._onAttachment, onNext: this._onNext });

        // const { vendorDetail } = this.props;
        // if (!_.isNull(vendorDetail)) {
        //     this.props.resetStateByKey({ key: 'vendorSelected', value: { id: vendorDetail.id, name: vendorDetail.towerName } })
        // }
    }
    render() {

        const {
            next,
            vendor,
            department,
            contractNo,
            phone,
            from,
            date,
            at,
            unreceived,
            received
        } = Strings.createRequest
        const {
            title,
            content,
            userContact,
            phoneContact,
            showModalLevel,
            levelSelected,
            isShowTime,
            time,
            day,
            depSelected,
            employeeSelected,
            groupSelected,
            apartmentSelected
        } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <NavBar
                    leftButton={<TouchableOpacity
                        style={{ padding: 10 }}
                        onPress={() => this.props.navigation.goBack()}
                    >
                        <MyIcon
                            name="arrow"
                            size={20}
                            color="#fff"
                        />
                    </TouchableOpacity>}
                    body={<Text style={titleStyle}>Tạo công việc</Text>}
                    rightView={<TouchableOpacity
                        onPress={this._onSend}
                        style={{
                            padding: 10
                        }}>
                        <MyIcon
                            name="paperplane"
                            color="#fff"
                            size={24}
                        />
                    </TouchableOpacity>}
                />
                <KeyboardAwareScrollView style={{ borderTopRightRadius: 20 }}>
                    <View style={styles.container}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingBottom: 10,
                            borderTopRightRadius: 20,
                        }}>
                            <Text style={{
                                color: "#282828",
                                fontFamily: "Inter-Bold",
                                fontSize: 16,
                                fontWeight: "bold",
                                fontStyle: "normal",
                                letterSpacing: 0,
                                textAlign: "left"
                            }}>{Strings.createRequest.title} (*)</Text>
                            {/* <TextInput
                                maxLength={50}
                                style={{ flex: 1, marginLeft: 20, paddingHorizontal: 0, paddingVertical: 0, fontSize: fontsize.small }}
                                placeholder={Strings.createRequest.placeholderTitle}
                                placeholderTextColor="#9e9e9e"
                                value={this.state.title}
                                underlineColorAndroid='transparent'
                                onChangeText={(title) => { this.setState({ title }) }}
                            /> */}
                            <Text style={{
                                fontFamily: "Inter-Regular",
                                fontSize: 10,
                                fontWeight: "normal",
                                fontStyle: "normal",
                                letterSpacing: 0,
                                textAlign: "left",
                                color: "#6f6f6f"
                            }}>{title.length}/50</Text>
                        </View>
                        <TextInput
                            maxLength={50}
                            underline={false}
                            multiline
                            style={{
                                width: '100%',
                                flex: 1,
                                height: 66,
                                padding: 10,
                                textAlignVertical: Platform.OS === 'ios' ? 'auto' : 'top',
                                alignContent: 'flex-start',
                                alignSelf: 'flex-start',
                                fontSize: fontsize.small,
                                fontFamily: "Inter-Regular",
                                borderRadius: 8,
                                borderStyle: "solid",
                                borderWidth: 1,
                                borderColor: "#cbcbcb", marginBottom: 20
                            }}
                            placeholder={Strings.createRequest.placeholderTitle}
                            placeholderTextColor="#6b6b6b"
                            value={this.state.title}
                            underlineColorAndroid='transparent'
                            onChangeText={(title) => { this.setState({ title }) }}
                        />
                        {/* <Lookup
                            fielName={`MẶT BẰNG`.toLocaleUpperCase()}
                            text={apartmentSelected ? apartmentSelected.name : 'Chọn mặt bằng'}
                            onPress={() => this.props.navigation.navigate('apartmentDictionary', { onSelected: (apartmentSelected) => { this.setState({ apartmentSelected }) } })}
                        /> */}
                        <Lookup
                            // visible={depSelected == null}
                            fielName={`Phòng ban (*)`}
                            text={depSelected ? depSelected.name : Strings.createRequest.placeholderDepartment}
                            onPress={() => this.props.navigation.navigate('depDictionary', { onSelected: (depSelected) => { this.setState({ depSelected }) } })}
                        />
                        <Lookup
                            visible={depSelected !== null}
                            fielName={`Nhân viên (*)`}
                            text={employeeSelected ? employeeSelected.name : Strings.createRequest.placeholderEmployee}
                            onPress={() => this.props.navigation.navigate('empDictionary', { departmentId: depSelected.id, onSelected: (employeeSelected) => { this.setState({ employeeSelected }) } })}
                        />
                        <Lookup
                            visible={depSelected !== null}
                            fielName={`Nhóm công việc (*)`}
                            text={groupSelected ? groupSelected.name : Strings.createRequest.placeholderGroup}
                            onPress={() => this.props.navigation.navigate('groupDictionary', { departmentId: depSelected.id, onSelected: (groupSelected) => { this.setState({ groupSelected }) } })}
                        />
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingBottom: 20,
                        }}
                            onPress={() => this.setState({ showModalLevel: true })}
                        >
                            <Text style={{
                                color: "#282828",
                                fontFamily: "Inter-Bold",
                                fontSize: 16,
                                fontWeight: "bold",
                                fontStyle: "normal",
                                letterSpacing: 0,
                                textAlign: "left", marginRight: 10, flex: 0.4
                            }}>Cấp độ(*)</Text>
                            <View style={{
                                justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center',
                                borderRadius: 8,
                                borderStyle: "solid",
                                borderWidth: 1,
                                borderColor: "#cbcbcb",
                                padding: 5,
                                flex: 0.55
                            }}>
                                <Text style={{
                                    color: "#282828",
                                    fontFamily: "Inter-SemiBold",
                                    fontSize: 14,
                                    fontWeight: "600",
                                    fontStyle: "normal",
                                    letterSpacing: 0,
                                    textAlign: "left",
                                }}>{levelSelected ? levelSelected.value : Strings.createRequest.placeholderPriority}</Text>
                                <MyIcon
                                    size={14}
                                    color={"#C0C0C0"}
                                    name="arrow-down" />
                            </View>

                        </TouchableOpacity>


                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            paddingBottom: 10,
                        }}>
                            <Text style={{
                                color: "#282828",
                                fontFamily: "Inter-Bold",
                                fontSize: 16,
                                fontWeight: "bold",
                                fontStyle: "normal",
                                letterSpacing: 0,
                                textAlign: "left"
                            }}>{Strings.createRequest.content} (*)</Text>
                            {/* <TextInput
                                maxLength={500}
                                underline={false}
                                multiline
                                underlineColorAndroid='transparent'
                                style={{
                                    flex: 1,
                                    height: 150,
                                    marginLeft: 20,
                                    paddingTop: Platform.OS === 'ios' ? 0 : 5,
                                    textAlignVertical: Platform.OS === 'ios' ? 'auto' : 'top',
                                    alignContent: 'flex-start',
                                    alignSelf: 'flex-start',
                                    fontSize: fontsize.small
                                }}
                                placeholder={Strings.createRequest.placeholderContent}
                                placeholderTextColor="#9e9e9e"
                                value={this.state.content}
                                onChangeText={(content) => { this.setState({ content }) }}
                            /> */}

                            <Text style={{
                                fontFamily: "Inter-Regular",
                                fontSize: 10,
                                fontWeight: "normal",
                                fontStyle: "normal",
                                letterSpacing: 0,
                                textAlign: "left",
                                color: "#6f6f6f"
                            }}>{content.length}/500</Text>
                        </View>
                        <TextInput
                            maxLength={500}
                            underline={false}
                            multiline
                            underlineColorAndroid='transparent'
                            style={{
                                width: '100%',
                                flex: 1,
                                height: 100,
                                padding: 10,
                                textAlignVertical: Platform.OS === 'ios' ? 'auto' : 'top',
                                alignContent: 'flex-start',
                                alignSelf: 'flex-start',
                                fontSize: fontsize.small,
                                fontFamily: "Inter-Regular",
                                borderRadius: 8,
                                borderStyle: "solid",
                                borderWidth: 1,
                                borderColor: "#cbcbcb"
                            }}
                            placeholder={Strings.createRequest.placeholderContent}
                            placeholderTextColor="#9e9e9e"
                            value={this.state.content}
                            onChangeText={(content) => { this.setState({ content }) }}
                        />


                        {this.state.images.length > 0 ?
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ marginTop: 20, }}>
                                {this.state.images.length < 5 && <View
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: colors.grayBorder,
                                        borderRadius: 8,
                                        padding: 5,
                                        marginTop: 10,
                                        marginRight: 10
                                    }}>
                                    <MyIcon
                                        onPress={() => this._onAttachment()}
                                        name="camera"
                                        size={40}
                                        color="#a8acaf"
                                    />
                                    <View style={{
                                        borderRadius: 2,
                                        backgroundColor: "#abafb2", padding: 3
                                    }}>
                                        <Text style={{
                                            fontFamily: "OpenSans-Regular",
                                            fontSize: 8,
                                            fontWeight: "normal",
                                            fontStyle: "normal",
                                            letterSpacing: 0,
                                            textAlign: "left",
                                            color: "#ffffff"
                                        }}
                                        >Thêm ảnh</Text>
                                    </View>
                                </View>}

                                {this.state.images.map((eachImage, y) => {
                                    return (
                                        <View key={y}>
                                            <Lightbox
                                                style={{ marginTop: 10, marginRight: 10, borderRadius: 5, backgroundColor: '#eeeeee' }}
                                                activeProps={{
                                                    style: styles.imageActive
                                                }}
                                                {...this.props.lightboxProps}
                                            >
                                                <Image source={{ uri: eachImage.uri }} style={{ width: 90, height: 120, zIndex: 0, borderRadius: 8 }} />
                                            </Lightbox>

                                            <TouchableOpacity
                                                onPress={() => { this.deleteImage(eachImage); }}
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 0,
                                                    borderRadius: 15,
                                                    marginTop: 0,
                                                    backgroundColor: '#505c5c5c',
                                                    zIndex: 1,
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Text style={{ padding: 5, color: '#fff' }}> X </Text>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                })}
                            </ScrollView> :
                            <TouchableOpacity
                                onPress={() => this._onAttachment()}
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 20,
                                    paddingVertical: 20,
                                    borderRadius: 8,
                                    backgroundColor: "#eaeaea"

                                }}>
                                <MyIcon
                                    name="camera"
                                    size={40}
                                    color="#a8acaf"
                                />
                                <View style={{
                                    borderRadius: 2,
                                    backgroundColor: "#abafb2", padding: 3
                                }}>
                                    <Text style={{
                                        fontFamily: "OpenSans-Regular",
                                        fontSize: 8,
                                        fontWeight: "normal",
                                        fontStyle: "normal",
                                        letterSpacing: 0,
                                        textAlign: "left",
                                        color: "#ffffff"
                                    }}
                                    >Nhấn vào để tải ảnh</Text>
                                </View>
                            </TouchableOpacity>
                        }
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingVertical: 20,
                        }}>
                            <Text style={{
                                color: "#282828",
                                fontFamily: "Inter-Bold",
                                fontSize: 16,
                                fontWeight: "bold",
                                fontStyle: "normal",
                                letterSpacing: 0
                            }}>{Strings.createRequest.date}</Text>
                            <Switch
                                style={{ flex: 0, paddingHorizontal: 0, paddingVertical: 0 }}
                                value={this.state.isShowTime}
                                onValueChange={() => { this.setState({ isShowTime: !this.state.isShowTime }); }}
                            />
                        </View>

                        {
                            isShowTime &&
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: -10,
                                marginBottom: 20
                            }}>
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: 10,
                                        flex: 0.45,
                                        borderRadius: 8,
                                        borderStyle: "solid",
                                        borderWidth: 1,
                                        borderColor: "#cbcbcb"
                                    }}
                                    onPress={() => { this.setState({ isToggleDate: true, day: moment(), time: moment() }); }}
                                >

                                    {this.props.language == 'en' ?
                                        <Text
                                            style={{
                                                //marginLeft: 20,
                                                // fontSize: fontsize.larg,
                                                flex: 1,
                                                fontFamily: "Inter-SemiBold",
                                                fontSize: 14,
                                                fontWeight: "600",
                                                fontStyle: "normal",
                                                letterSpacing: 0,
                                                textAlign: "left",
                                                color: "#282828"
                                            }}>{day ? moment(day).format('DD/MM/YYYY') : moment().format('DD/MM/YYYY')}</Text> :
                                        <Text
                                            style={{
                                                //marginLeft: 20,
                                                fontFamily: "Inter-SemiBold",
                                                fontSize: 14,
                                                fontWeight: "600",
                                                fontStyle: "normal",
                                                letterSpacing: 0,
                                                textAlign: "left",
                                                color: "#282828",
                                                flex: 1,
                                            }}>{day ? moment(day).format('DD/MM/YYYY') : moment().format('DD/MM/YYYY')}</Text>}
                                    <DateTimePicker
                                        cancelTextIOS={Strings.createRequest.cancel}
                                        titleIOS={Strings.createRequest.titlePicker}
                                        confirmTextIOS={Strings.createRequest.chose}
                                        mode="date"
                                        minimumDate={new Date()}
                                        isVisible={this.state.isToggleDate}
                                        onConfirm={(day) => {
                                            this.setState({ isToggleDate: false, day });
                                        }}
                                        onCancel={() => { this.setState({ isToggleDate: false }); }}
                                    />
                                    <MyIcon
                                        name="calendar1"
                                        size={20}
                                        color="rgba(0, 0, 0, 0.54)"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => { this.setState({ isToggleTimeFrom: true }); }}
                                    style={{
                                        padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                                        // borderBottomWidth: 1,
                                        // borderBottomColor: colors.grayBorder
                                        borderRadius: 8,
                                        borderStyle: "solid",
                                        borderWidth: 1,
                                        borderColor: "#cbcbcb",
                                        flex: 0.45
                                    }}>

                                    <Text style={{
                                        //marginLeft: 20,
                                        fontFamily: "Inter-SemiBold",
                                        fontSize: 14,
                                        fontWeight: "600",
                                        fontStyle: "normal",
                                        letterSpacing: 0,
                                        textAlign: "left",
                                        color: "#282828",
                                        flex: 1,
                                    }}>{time ? moment(time).format('HH:mm') : moment().format('HH:mm')}</Text>
                                    <DateTimePicker
                                        cancelTextIOS={Strings.app.cancel}
                                        titleIOS={Strings.createRequest.at}
                                        confirmTextIOS={Strings.app.chose}
                                        mode="time"
                                        isVisible={this.state.isToggleTimeFrom}
                                        onConfirm={(time) => {
                                            this.setState({ isToggleTimeFrom: false, time });
                                        }}
                                        onCancel={() => { this.setState({ isToggleTimeFrom: false }); }}
                                    />
                                    <MyIcon
                                        name="clock1"
                                        size={20}
                                        color="rgba(0, 0, 0, 0.54)"
                                    />
                                </TouchableOpacity>
                            </View>
                        }
                        {/* {isShowTime &&
                            <View>
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        paddingVertical: 20,
                                        borderBottomWidth: 1,
                                        borderBottomColor: colors.grayBorder
                                    }}
                                    onPress={() => { this.setState({ isToggleDate: true }); }}
                                >
                                    <MyIcon
                                        name="calendar"
                                        size={20}
                                        color='gray'
                                    />
                                    {this.props.language == 'en' ?
                                        <Text
                                            style={{
                                                marginLeft: 20,
                                                fontSize: fontsize.small,
                                                flex: 1,
                                                color: 'gray'
                                            }}>{day ? moment(day).format('MMMM Do YYYY') : moment().format('MMMM Do YYYY')}</Text> :
                                        <Text
                                            style={{
                                                marginLeft: 20,
                                                fontSize: fontsize.small,
                                                flex: 1,
                                                color: 'gray'
                                            }}>{day ? moment(day).format('[Ngày] DD [tháng] MM[,] YYYY') : moment().format('[Ngày] DD [tháng] MM[,] YYYY')}</Text>}

                                    <DateTimePicker
                                        cancelTextIOS={Strings.createRequest.cancel}
                                        titleIOS={Strings.createRequest.titlePicker}
                                        confirmTextIOS={Strings.createRequest.chose}
                                        mode="date"
                                        minimumDate={new Date()}
                                        isVisible={this.state.isToggleDate}
                                        onConfirm={(date) => {
                                            this.setState({ isToggleDate: false, date });
                                        }}
                                        onCancel={() => { this.setState({ isToggleDate: false }); }}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => { this.setState({ isToggleTimeFrom: true }); }}
                                    style={{ paddingVertical: 15, flexDirection: 'row', alignItems: 'center' }}>
                                    <MyIcon
                                        name="clock"
                                        size={20}
                                        color='gray'
                                    />
                                    <Text style={{
                                        marginLeft: 20,
                                        fontSize: fontsize.small,
                                        flex: 1,
                                        color: 'gray'
                                    }}>{Strings.createRequest.at}    {time ? moment(time).format('HH:mm') : moment().format('HH:mm')}</Text>
                                    <DateTimePicker
                                        cancelTextIOS={Strings.app.cancel}
                                        titleIOS={Strings.createRequest.at}
                                        confirmTextIOS={Strings.app.chose}
                                        mode="time"
                                        isVisible={this.state.isToggleTimeFrom}
                                        onConfirm={(time) => {
                                            this.setState({ isToggleTimeFrom: false, time });
                                        }}
                                        onCancel={() => { this.setState({ isToggleTimeFrom: false }); }}
                                    />
                                </TouchableOpacity>
                            </View>
                        } */}
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingBottom: 20
                        }}>
                            <Text style={{
                                color: "#282828",
                                fontFamily: "Inter-Bold",
                                fontSize: 16,
                                fontWeight: "bold",
                                fontStyle: "normal",
                                letterSpacing: 0,
                                flex: 0.4
                            }}>{Strings.createRequest.from}</Text>
                            <TextInput
                                style={{
                                    flex: 1, marginLeft: 20, paddingHorizontal: 10, paddingVertical: 5, fontSize: fontsize.small, fontFamily: "Inter-Regular", borderRadius: 8,
                                    borderStyle: "solid",
                                    borderWidth: 1,
                                    borderColor: "#cbcbcb",
                                    flex: 0.55
                                }}
                                placeholder={Strings.createRequest.placeholderSender}
                                placeholderTextColor="#9e9e9e"
                                value={userContact}
                                underlineColorAndroid='transparent'
                                onChangeText={(text) => { this.setState({ userContact: text }) }}
                            />
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingBottom: 20,
                        }}>
                            <Text style={{
                                color: "#282828",
                                fontFamily: "Inter-Bold",
                                fontSize: 16,
                                fontWeight: "bold",
                                fontStyle: "normal",
                                letterSpacing: 0,
                                flex: 0.4
                            }}>{Strings.createRequest.phone}</Text>
                            <TextInput

                                style={{
                                    flex: 1, marginLeft: 20, paddingHorizontal: 10, paddingVertical: 5, fontSize: fontsize.small,
                                    fontFamily: "Inter-Regular", borderRadius: 8,
                                    borderStyle: "solid",
                                    borderWidth: 1,
                                    borderColor: "#cbcbcb",
                                    flex: 0.55
                                }}
                                placeholder={Strings.createRequest.placeholderPhone}
                                placeholderTextColor="#9e9e9e"
                                value={phoneContact}
                                underlineColorAndroid='transparent'
                                onChangeText={(text) => { this.setState({ phoneContact: text }) }}
                            />

                        </View>
                    </View>
                </KeyboardAwareScrollView>



                <Toast ref="toast" style={{ backgroundColor: colors.toast.warning, opacity: 1, borderRadius: 5, padding: 10, }} />

                <ModalPicker
                    visible={showModalLevel}
                    selectedValue={levelSelected ? this.state.levelSelected.id : 0}
                    onValueChange={(levelSelected) => this.setState({ showModalLevel: false, levelSelected })}
                    data={[
                        { id: 1, value: 'Khẩn cấp' },
                        { id: 2, value: 'Bình thường' },
                        { id: 3, value: 'Thấp' },

                    ]}
                    dislayValue="value"
                    onClose={() => this.setState({ showModalLevel: false })}
                />

            </View>

        );
    }
    deleteImage(item) {
        const array = this.state.images;
        const index = array.indexOf(item);
        array.splice(index, 1);
        this.setState({ images: array });
    }

    _onAttachment = () => {

        // if (this.props.images && _.size(this.props.images) < 5) {
        const options = {
            quality: 1.0,
            maxWidth: 512,
            maxHeight: 512,
            storageOptions: {
                skipBackup: true
            },
            title: 'Chọn hình ảnh',
            takePhotoButtonTitle: 'Chụp ảnh...',
            chooseFromLibraryButtonTitle: 'Chọn ảnh từ thư viện...',
            cancelButtonTitle: 'Bỏ qua',
            permissionDenied: { title: 'Cấp quyền truy cập', text: 'Cho phép ứng dụng chụp ảnh và chọn từ thư viên ảnh...', reTryTitle: 'Thử lại', okTitle: 'Cho phép' }
        };

        ImagePicker.showImagePicker(options, (response) => {
            // console.log('Response showImagePicker = ', response);

            if (response.didCancel) {
                // console.log('User cancelled photo picker');
            } else if (response.error) {
                // console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                // console.log('User tapped custom button: ', response.customButton);
            } else {

                const image = {
                    data: response.data,
                    uri: response.uri,
                    type: Platform.OS === 'ios' ? mineTypes.lookup(response.uri) : response.type,
                    fileName: response.fileName
                };

                // const source = { uri: response.uri, data: response.data };
                // You can also display the image using data:
                // const source = { uri: `data:image/jpeg;base64,${response.data}` };
                this.setState({ images: [...this.state.images, image] })
                //this.props.addImageToList(image);
            }
        });
        // } else {
        //     Toast.show({
        //         text: 'Bạn chỉ chọn được tối đa 5 hình',
        //         position: 'bottom',
        //         type: 'warning',
        //         duration: 2000
        //     });
        // }

    }
    _onSend = () => {
        const { levelSelected, apartmentSelected, employeeSelected, groupSelected, phoneContact, userContact, contractSelected, depSelected, title, content, time, day, imagesInformation } = this.state;

        if (title.length == 0) {
            return this.refs.toast.show(`${Strings.message.pleaseType} ${Strings.createRequest.title}`, DURATION.LENGTH_LONG);
        }

        if (depSelected.id == 0) {
            return this.refs.toast.show(`Vui lòng chọn Phòng ban`, DURATION.LENGTH_LONG);
        }
        if (employeeSelected.id == 0) {
            return this.refs.toast.show(`Vui lòng chọn Nhân viên`, DURATION.LENGTH_LONG);
        }
        if (groupSelected.id == 0) {
            return this.refs.toast.show(`Vui lòng chọn Nhóm công việc`, DURATION.LENGTH_LONG);
        }
        if (levelSelected.id == 0) {
            return this.refs.toast.show(`Vui lòng chọn Cấp độ`, DURATION.LENGTH_LONG);
        }
        if (content.length == 0) {
            return this.refs.toast.show(`${Strings.message.pleaseType} ${Strings.createRequest.content}`, DURATION.LENGTH_LONG);
        }

        return this.props.createRequestHandle({
            vendorSelected: { id: this.props.user.towerId },
            employeeSelected,
            groupSelected,
            apartmentSelected,
            levelSelected,
            depSelected,
            title,
            content,
            time,
            day,
            userContact,
            phoneContact,
            imageInformation: this.state.images.map(o => ({ mineType: o.type, bytes: o.data }))
        })
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderTopRightRadius: 20,
        paddingBottom: 20
    },
    imageActive: {
        flex: 1,
        resizeMode: "contain"
    },
});

const mapStateToProps = (state) => ({
    vendorSelected: state.requestCreate.vendorSelected,
    depSelected: state.requestCreate.depSelected,
    contractSelected: state.requestCreate.contractSelected,
    title: state.requestCreate.title,
    content: state.requestCreate.content,
    imagesInformation: state.requestCreate.imagesInformation,
    user: state.auth.user,
    userContact: state.requestCreate.userContact,
    phoneContact: state.requestCreate.phoneContact,
    error: state.requestCreate.error,

})

//make this component available to the app
export default connect(mapStateToProps, { createRequestHandle })(CreateScreen);
