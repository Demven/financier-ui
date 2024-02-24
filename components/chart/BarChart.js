import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PropTypes from 'prop-types';
import { FONT } from '../../styles/fonts';
import { COLOR } from '../../styles/colors';

BarChart.propTypes = {
  style: PropTypes.any,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  legendHeight: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  barsProportion: PropTypes.arrayOf(PropTypes.number),
  getColor: PropTypes.func.isRequired,
  barSelected: PropTypes.number,
  onBarSelected: PropTypes.func,
};

export default function BarChart (props) {
  const {
    style,
    width,
    height,
    legendHeight,
    data,
    barsProportion,
    getColor,
    barSelected,
    onBarSelected = () => {},
  } = props;

  const [maxPoint, setMaxPoint] = useState(0);
  const [barHighlightedIndex, setBarHighlightedIndex] = useState();
  const [barFocusedIndex, setBarFocusedIndex] = useState();

  useEffect(() => {
    const max = data.reduce((max, point) => point > max ? point: max, 0);
    setMaxPoint(max);
  }, [data]);

  useEffect(() => {
    if (typeof barSelected === 'number') {
      setBarFocusedIndex(barSelected);
    }
  }, [barSelected]);

  function getBarHeight (point) {
    return `${Math.round(point * 100 / maxPoint)}%`;
  }

  return (
    <View style={[styles.barChart, {
      width,
      height,
    }, style]}>
      <View style={[styles.bars, {
        height: height - legendHeight,
      }]}>
        {data.map((point, index) => {
          const highlighted = barHighlightedIndex === index;
          const focused = barFocusedIndex === index;

          return (
            <Pressable
              key={index}
              style={[styles.barButton, {
                height: getBarHeight(point),
                flexGrow: barsProportion?.[index] || 1,
              }]}
              onMouseEnter={() => setBarHighlightedIndex(index)}
              onMouseLeave={() => setBarHighlightedIndex(undefined)}
              onPressIn={() => setBarFocusedIndex(index)}
              onPress={() => onBarSelected(index)}
            >
              <View style={[
                styles.bar,
                focused && styles.barFocused,
              ]}>
                <View style={[
                  styles.barTop, {
                    backgroundColor: getColor(0.8),
                  },
                  (highlighted || focused) && styles.barTopHighlighted,
                ]}>
                  {!!point && (
                    <Text style={[
                      styles.value,
                      highlighted && styles.valueHighlighted,
                      focused && styles.valueFocused,
                    ]}>
                      {Math.round(point)}
                    </Text>
                  )}
                </View>

                <LinearGradient
                  style={styles.gradient}
                  colors={[
                    barFocusedIndex === index ? getColor(0.6) : getColor(0.5),
                    barFocusedIndex === index ? getColor(0.2) : getColor(0.1),
                  ]}
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barChart: {
    width: '100%',
    height: '100%',
  },

  bars: {
    width: '100%',
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  barButton: {},
  bar: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  barFocused: {
    outlineWidth: 1,
    outlineStyle: 'solid',
    outlineColor: COLOR.LIGHT_GRAY,
  },

  barTop: {
    width: '100%',
    height: 6,
    maxHeight: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    transition: 'height 0.25s',
  },
  barTopHighlighted: {
    height: 36,
  },

  gradient: {
    width: '100%',
    height: '100%',
  },

  value: {
    width: '100%',
    position: 'absolute',
    top: -20,
    left: 0,
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 10,
    lineHeight: 10,
    textAlign: 'center',
    color: COLOR.DARK_GRAY,
    whiteSpace: 'nowrap',
  },
  valueHighlighted: {
    fontSize: 11,
    lineHeight: 11,
  },
  valueFocused: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
    fontSize: 11,
    lineHeight: 11,
  },
});
