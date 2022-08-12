import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View, processColor
} from 'react-native';

import { BarChart } from 'react-native-charts-wrapper';
import responsive from "../../../resources/responsive";
class StackedBarChartScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      legend: {
        enabled: true,
        textSize: responsive.h(14),
        form: "SQUARE",
        formSize: responsive.h(14),
        xEntrySpace: responsive.h(10),
        yEntrySpace: responsive.h(5),
        wordWrapEnabled: true
      },
      data: {
        dataSets: [{
          values:props.dataStackY,
          label: '',
          config: {
            colors: [processColor('orange'), processColor('#3292FC'), processColor('#45bf6e'), processColor('#8CEAFF')],
            stackLabels: ['Yêu cầu mới', 'Đang xử lý', 'Đã hoàn thành', 'Đã đóng',],
            drawFilled: true,
            drawHighlightIndicators: true,
            valueTextSize: responsive.h(12),
            drawValues: false,
            axisDependency: 'Right'
          }

        }],
        config: {
          barWidth: 0.5,
        }
      },
      highlights: [{ x: 1, stackIndex: 2 }, { x: 2, stackIndex: 1 }],
      xAxis: {
        valueFormatter:props.dataStackX,
        granularityEnabled: true,
        granularity: 1,
        position: 'BOTTOM',
        textRotate: 90,
        avoidFirstLastClipping: false,
        labelRotationAngle: 45,
      },
      yAxis: {
        right: { enabled: false },
        spaceBottom: 0,
        spaceTop: 0,
        zeroLine: {
          enabled: false,
          lineWidth: 0,
          lineColor: '#fff'
        }
      },
    };
  }

  handleSelect(event) {
    let entry = event.nativeEvent
    if (entry == null) {
      this.setState({ ...this.state, selectedEntry: null })
    } else {
      this.setState({ ...this.state, selectedEntry: JSON.stringify(entry) })
    }
    console.log(event.nativeEvent)
  }

  render() {
    return (

      <View style={{ flex: 1 }}>

        {/* <View style={{ height: 80 }}>
          <Text> selected entry</Text>
          <Text> {this.state.selectedEntry}</Text>
        </View> */}

        <View style={styles.container}>
          <BarChart
            style={styles.chart}
            xAxis={this.state.xAxis}
            data={this.state.data}
            legend={this.state.legend}
            drawValueAboveBar={false}
            chartDescription={{ textColor: processColor('#ffffff00') }}

            marker={{
              enabled: true,
              markerColor: processColor('#F0C0FF8C'),
              textColor: processColor('white'),
              markerFontSize: responsive.h(14),
            }}
            highlights={this.state.highlights}
            onSelect={this.handleSelect.bind(this)}
            onChange={(event) => console.log(event.nativeEvent)}
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
    height: responsive.h(400),
    flex: 1
  }
});


export default StackedBarChartScreen;