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

class PieChartSurveyScreen extends React.Component {

  constructor(props) {
    super(props);
    console.log(this.props.dataX)
    this.state = {
      legend: {
        enabled: false,
        textSize: 7,
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
        textSize: 12,
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
          entryLabelTextSize={10}
          drawEntryLabels={true}

          rotationEnabled={true}
          rotationAngle={270}
          usePercentValues={true}
          styledCenterText={{ text: '%', color: processColor(colors.appTheme), size: 20 }}
          centerTextRadiusPercent={0}
          holeRadius={20}
          holeColor={processColor('#f0f0f0')}
          transparentCircleRadius={25}
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
    height: 300,
    flex: 1,
    backgroundColor: '#fff'
  }
});

export default PieChartSurveyScreen;