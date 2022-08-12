import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  processColor,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import responsive from "../../../resources/responsive";
import { BarChart } from 'react-native-charts-wrapper';
class BarChartScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      },
      legend: {
        enabled: false,
        textSize: responsive.h(14),
        form: 'SQUARE',
        formSize: responsive.h(14),
        xEntrySpace: responsive.h(10),
        yEntrySpace: responsive.h(5),
        formToTextSpace: 0,
      },
      data: {
        dataSets: [{
          values: props.dataY,
          label: '',
          config: {
            color: processColor('orange'),
            barSpacePercent: responsive.h(10),
            barShadowColor: processColor('lightgrey'),

            highlightColor: processColor('red'),
            valueTextSize: responsive.h(12),
            drawValues: false
          }
        }],
        config: {
          barWidth: 0.5,
        }
      },
      xAxis: {
        axisMinimum: -0.3,
        valueFormatter: props.dataX,
        granularityEnabled: true,
        granularity: 1,
        textRotate: 90,
        position: 'BOTTOM',
        labelRotationAngle: 45,
      },
      yAxis: {
        right: { enabled: false },
        minimum: 1
      },
      onPress: props.on
    };

  }

  render() {
    return (
      <View style={{ flex: 1 }}>


        <View style={styles.container}>
          <BarChart
            options={this.state.options}
            legend={this.state.legend}
            style={styles.chart}
            data={this.state.data}
            xAxis={this.state.xAxis}
            yAxis={this.state.yAxis}
            gridBackgroundColor={processColor('#ffffff')}
            drawBarShadow={false}
            drawValueAboveBar={false}
            drawHighlightArrow={true}
            chartDescription={{ textColor: processColor('#ffffff00') }}
            autoScaleMinMaxEnabled={true}
            scaleYEnabled={false}
            onSelect ={event => 
              {
                if(event.nativeEvent.data){
                  this.state.onPress
                }
                // console.log(event.nativeEvent)
              }
              //props.onPress
            }
            //onChange={event => console.log(event.nativeEvent)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  chart: {
    height: responsive.h(300),
    flex: 1,
  }
});

export default BarChartScreen;
