import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  processColor
} from 'react-native';
import update from 'immutability-helper';
import responsive from "../../../resources/responsive";
import _ from 'lodash';
import { LineChart } from 'react-native-charts-wrapper';

const COLOR_PURPLE = processColor('#0084ff');

class AxisLineChartScreen extends React.Component {

  constructor() {
    super();

    this.state = {
      data: {},
      xAxis: {},
      yAxis: {}
    };
  }

  componentDidMount() {
    const valueRange = 100;
    const size = 30;

    this.setState(
      update(this.state, {
        xAxis: {
          $set: {
            axisMinimum: 1,
            granularityEnabled: true,
            granularity : 1,
            labelRotationAngle: responsive.h(45),
            textColor: processColor('black'),
            textSize: responsive.h(9),
            textRotate: 90,
            gridColor: processColor('white'),
            axisLineColor: processColor('darkgray'),
            axisLineWidth: 1.5,
            gridDashedLine: {
              lineLength: 0,
              spaceLength: 0
            },
            avoidFirstLastClipping: false,
            position: 'BOTTOM',
            valueFormatter: this.props.dataX
          }
        },
        yAxis: {
          $set: {
            left: {
              drawGridLines: false
            },
            right: {
              enabled: false
            }
          }
        },
        data: {
          $set: {
            dataSets: [{
              values: this.props.dataY,
              label: '',
              config: {
                circleRadius: responsive.h(3),
                lineWidth: 1.5,
                drawCircles: true,
                drawCubicIntensity: 0.1,
                drawCubic: true,
                drawHighlightIndicators: true,
                circleHoleColor: COLOR_PURPLE,
                color: COLOR_PURPLE,
                valueTextSize: responsive.h(12),
                drawValues:false
              }
            }],
          }
        }
      })
    );
  }

  _randomYValues(range, size) {
    const nextValueMaxDiff = 0.1;
    let lastValue = range;

    return _.times(size, () => {
      let min = lastValue * (1 - nextValueMaxDiff);
      let max = lastValue * (1 + nextValueMaxDiff);
      return { y: Math.random() * (max - min) + min };
    });
  }

  handleSelect(event) {
    let entry = event.nativeEvent
    if (entry == null) {
      this.setState({ ...this.state, selectedEntry: null })
    } else {
      this.setState({ ...this.state, selectedEntry: JSON.stringify(entry) })
    }
  }

  render() {

    return (

      <View style={{ flex: 1 }}>

        {/* <View style={{height:80}}>
          <Text> selected entry</Text>
          <Text> {this.state.selectedEntry}</Text>
        </View> */}

        <View style={styles.container}>
          <LineChart
            style={styles.chart}
            data={this.state.data}
            description={{ text: '' }}
            xAxis={this.state.xAxis}
            yAxis={this.state.yAxis}
            legend={{ enabled: false }}
            onSelect={this.handleSelect.bind(this)}
            marker={{
                            enabled: true,
                            markerColor: processColor('#0084ff'),
                            textColor: processColor('white'),
                            markerFontSize: responsive.h(14),
                        }}
            chartDescription={{textColor:processColor('#ffffff00')}}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  chart: {  
    height: responsive.h(300),  
    flex: 1,

  }
});

export default AxisLineChartScreen;