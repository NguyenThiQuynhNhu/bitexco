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
import { BarChart } from 'react-native-charts-wrapper';
// export const BarChartScreen = (props) => {
//   const options = {
//     scales: {
//       yAxes: [{
//         ticks: {
//           beginAtZero: true
//         }
//       }]
//     }
//   }
//   const legend = {
//     enabled: false,
//     textSize: 14,
//     form: 'SQUARE',
//     formSize: 14,
//     xEntrySpace: 10,
//     yEntrySpace: 5,
//     formToTextSpace: 0,
//   }
//   const data = {
//     dataSets: [{
//       values: props.dataY,
//       label: '',
//       config: {
//         color: processColor('orange'),
//         barSpacePercent: 10,
//         barShadowColor: processColor('lightgrey'),

//         highlightColor: processColor('red'),
//         valueTextSize: 12,
//         drawValues: false
//       }
//     }],
//     config: {
//       barWidth: 0.5,
//     }
//   }
//   const xAxis = {
//     axisMinimum: -0.3,
//     valueFormatter: props.dataX,
//     granularityEnabled: true,
//     granularity: 1,
//     textRotate: 90,
//     position: 'BOTTOM',
//     labelRotationAngle: 45,
//   }
//   const yAxis = {
//     right: { enabled: false },
//     minimum: 1
//   }
//   const { onPress } = props
//   console.log(props)
//    return (
//            <View style={{ flex: 1 }}>

// <TouchableOpacity
// onPress={onPress}>
//   <Text>nhuuuu</Text>
// </TouchableOpacity>
//         <View style={styles.container}>
//           <BarChart
//             options={options}
//             legend={legend}
//             style={styles.chart}
//             data={data}
//             xAxis={xAxis}
//             yAxis={yAxis}
//             gridBackgroundColor={processColor('#ffffff')}
//             drawBarShadow={false}
//             drawValueAboveBar={false}
//             drawHighlightArrow={true}
//             chartDescription={{ textColor: processColor('#ffffff00') }}
//             autoScaleMinMaxEnabled={true}
//             scaleYEnabled={false}
//             onSelect ={event => 
//               {
//                 if(event.nativeEvent.data){
//                   onPress
//                   console.log(event.nativeEvent)
//                   //props.on
//                   //console.log(this.state)
//                 }
                
//               }
//               //props.onPress
//             }
//             //onChange={event => console.log(event.nativeEvent)}
//           />
//         </View>
//       </View>
//    )
// }
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
        textSize: 14,
        form: 'SQUARE',
        formSize: 14,
        xEntrySpace: 10,
        yEntrySpace: 5,
        formToTextSpace: 0,
      },
      data: {
        dataSets: [{
          values: props.dataY,
          label: '',
          config: {
            color: processColor('orange'),
            barSpacePercent: 10,
            barShadowColor: processColor('lightgrey'),

            highlightColor: processColor('red'),
            valueTextSize: 12,
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
    height: 300,
    flex: 1,
  }
});

export default BarChartScreen;
