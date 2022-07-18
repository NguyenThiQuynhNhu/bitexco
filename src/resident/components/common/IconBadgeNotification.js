import React, { Component } from 'react';
import {
  View, StyleSheet, Text, Image, Platform
} from 'react-native';
import { connect } from 'react-redux';
import { MyIcon } from '../../theme/icons';


const mapStateToProps = state => ({
  //totalUnread: 0
});
class IconBadgeNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Hidden: false
    }
  }

  render() {
    return (
      <View style={styles.MainView}>
        <MyIcon name="message" size={24} color={this.props.tintColor } />
        {this.props.totalUnread !== 0 &&
          <View style={styles.IconBadge}>
            <Text style={{ color: 'white', fontSize: 10 }}>{this.props.totalUnread ? this.props.totalUnread : 0}</Text>
          </View>
        }
      </View>);
  }
}
export default connect(mapStateToProps)(IconBadgeNotification);

const styles = StyleSheet.create({
  IconBadge: {
    top: 0,
    right: -5,
    position: 'absolute',
    borderRadius: 45,
    minWidth: 15,
    minHeight: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF0000'
  },
  MainView: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});
