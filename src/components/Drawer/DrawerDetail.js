import React, { Component } from 'react'
import { SectionList, StyleSheet, View } from 'react-native'


import PlatformTouchable from '../shared/PlatformTouchable'
import colors from '../shared/colors'
import { FlexView, Text14 } from '../shared/styles'
import Device from '../../utils/device'

class DrawerDetail extends Component {
  static keyExtractor(item, index) {
    return `${item.id} ${index}`
  }

  static renderItem({ item }) {
    return (
      <PlatformTouchable
        onPress={() => {
          if (item.action) {
            item.action({ slug: item.link, title: item.name })
          }
        }}
      >
        <View
          style={{
            height: 36,
            backgroundColor: colors.defaultWhite,
            justifyContent: 'center',
            paddingLeft: 16,
            paddingRight: 16
          }}
        >
          <Text14 numberOfLines={1}>{item.name}</Text14>
        </View>
      </PlatformTouchable>
    )
  }

  static renderSectionHeader({ section }) {
    if (!section.title) return null
    return (
      <View
        style={{
          height: 36,
          backgroundColor: colors.defaultDarkerGray,
          justifyContent: 'center',
          paddingLeft: 16
        }}
      >
        <Text14 style={{ color: colors.defaultWhite }}>{section.title}</Text14>
      </View>
    )
  }

  static renderSeparator() {
    return (
      <View
        style={{
          height: StyleSheet.hairlineWidth,
          backgroundColor: colors.defaultGrayLighter,
          marginLeft: 16,
          marginRight: 16
        }}
      />
    )
  }

  constructor(props) {
    super(props)
    const { categories, customer } = props

    let customerData = [
      { name: 'Đăng nhập', action: props.navSignIn },
      { name: 'Đăng ký', action: props.navSignUp }
    ]

    if (customer) {
      customerData = [
        { name: 'Thông tin tài khoản', action: props.navUser },
        { name: 'Thay đổi mật khẩu', action: props.navEditPassword },
        { name: 'Kiểm tra đơn hàng', action: props.navHistory }
      ]
    }

    const categoryDatas = categories.map(el => ({
      ...el,
      action: props.navCategory
    }))

    this.state = {
      menu: [
        {
          data: customerData,
          title: undefined
        },
        { data: categoryDatas, title: 'Danh mục sản phẩm' },
        {
          data: [
            {
              name: 'Quy chế hoạt động',
              link: 'quy-che-hoat-dong',
              action: props.navHtmlView
            },
            {
              name: 'Danh sách cửa hàng',
              link: 'danh-sach-cac-cua-hang',
              action: props.navMap
            },
            {
              name: 'Giới thiệu Pharmacity',
              link: 'gioi-thieu-pharmacity',
              action: props.navHtmlView
            }
          ],
          title: 'Pharmacity'
        },
        {
          data: [
            {
              name: 'Các câu hỏi thường gặp',
              link: 'cac-cau-hoi-thuong-gap',
              action: props.navHtmlView
            },
            {
              name: 'Chính sách đổi trả hàng',
              link: 'chinh-sach-doi-tra-hang',
              action: props.navHtmlView
            },
            {
              name: 'Liên hệ',
              link: 'lien-he',
              action: props.navHtmlView
            }
          ],
          title: 'Hỗ trợ khách hàng'
        }
      ]
    }
  }

  render() {
    const { navHome } = this.props

    return (
      <FlexView>
        <View
          style={{
            ...Device.defaultNavBarStyle(),
            backgroundColor: colors.defaultBlue
          }}
        >
          <PlatformTouchable onPress={() => navHome()}>
            <View
              style={{
                ...Device.defaultNavBarHeight(),
                paddingHorizontal: 16,
                justifyContent: 'center'
              }}
            >
              <Text14 style={{ color: colors.defaultWhite }}>Pharmacity</Text14>
            </View>
          </PlatformTouchable>
        </View>
        <SectionList
          keyExtractor={DrawerDetail.keyExtractor}
          renderItem={DrawerDetail.renderItem}
          renderSectionHeader={DrawerDetail.renderSectionHeader}
          sections={this.state.menu}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={DrawerDetail.renderSeparator}
          // ListHeaderComponent={() => {
          // if (this.props.customer) {
          //   return <DrawerHeader customer={this.props.customer} />
          // }
          // return null
          // }}
          ListFooterComponent={() => (
            <DrawerFooter customer={this.props.customer} signOut={this.props.signOut} />
          )}
        />
      </FlexView>
    )
  }
}

export default DrawerDetail
