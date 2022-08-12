import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  processColor
} from 'react-native';

import { PieChart } from 'react-native-charts-wrapper';
import colors from '../../../theme/colors';
import responsive from "../../../resources/responsive";
class PieChartScreen extends React.Component {

  constructor(props) {
    super(props);
    console.log(this.props.dataX)
    this.state = {
      legend: {
        enabled: false,
        textSize: 8,
        form: 'CIRCLE',
        position: 'RIGHT_OF_CHART',
        wordWrapEnabled: true,
        drawFilled: true
      },
      data: {

        dataSets: [{
          values: this.props.dataX,
          label: 'Phòng ban',
          config: {
            colors: [processColor('orange'), processColor('#3292FC'), processColor('#45bf6e'), processColor('#8CEAFF'), processColor('#ff66ff'), processColor('#ff0000'), processColor('#0080b3')],
            valueTextSize: 12,
            valueTextColor: processColor('#000'),
            sliceSpace: 0,
            selectionShift: 5
          }
        }],
      },
      description: {
        text: '',
        textSize: 15,
        textColor: processColor('darkgray'),

      }
    };
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
      <View style={styles.container}>
        <PieChart
        
          style={styles.chart}
          logEnabled={true}
          chartBackgroundColor={processColor('#fff')}
          chartDescription={this.state.description}
          data={this.state.data}
          legend={this.state.legend}
          highlights={this.state.highlights}

          entryLabelColor={processColor('black')}
          entryLabelTextSize={responsive.h(12)}
          drawEntryLabels={true}

          rotationEnabled={true}
          rotationAngle={45}
          usePercentValues={true}
          styledCenterText={{ text: '%', color: processColor(colors.appTheme), size: responsive.h(20) }}
          centerTextRadiusPercent={responsive.h(100)}
          holeRadius={responsive.h(40)}
          holeColor={processColor('#f0f0f0')}
          transparentCircleRadius={responsive.h(45)}
          transparentCircleColor={processColor('#f0f0f088')}
          maxAngle={360}
          onSelect={this.handleSelect.bind(this)}
          onChange={(event) => console.log(event.nativeEvent)}
        />
      </View>


    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
  chart: {
    height: responsive.h(300),
    flex: 1,
    backgroundColor: '#fff'
  }
});

export default PieChartScreen;