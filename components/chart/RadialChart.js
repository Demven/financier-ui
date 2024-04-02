import { useState } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import Svg, {
  Circle,
  G,
  Path,
  Text,
} from 'react-native-svg';
import PropTypes from 'prop-types';
import { COLOR } from '../../styles/colors';

RadialChart.propTypes = {
  style: PropTypes.any,
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    getColor: PropTypes.func.isRequired,
  })).isRequired,
  selectedSegmentId: PropTypes.string,
  onSelectSegment: PropTypes.func,
};

export default function RadialChart (props) {
  const {
    style,
    data = [],
    selectedSegmentId,
    onSelectSegment = (id) => {},
  } = props;

  const [width, setWidth] = useState();
  const [highlightedId, setHighlightedId] = useState();

  function onLayout (event) {
    setWidth(event.nativeEvent.layout.width);
  }

  function getCoordinatesForPercent(percent) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);

    return [x, y];
  }

  function moveSelectedToTheTop (data) {
    const selectedItem = data.find(item => item.id === selectedSegmentId);

    return [
      ...data.filter(item => item.id !== selectedSegmentId),
      selectedItem,
    ].filter(Boolean);
  }

  let cumulativePercent = 0;

  return (
    <View
      style={[styles.radialChart, { height: width }, style]}
      onLayout={onLayout}
    >
      <Svg
        height="100%"
        width="100%"
        viewBox="-1 -1 2 2"
        style={{ transform: [{ rotate: '-90deg' }] }}
      >
        <G style={{ transform: [{ scale: 0.9 }] }}>
          {/* Circle border */}
          <Circle
            cx={0}
            cy={0}
            r={1}
            strokeWidth={width / 100 / 1000}
            stroke={COLOR.GRAY}
            fill={COLOR.TRANSPARENT}
          />

          {/* Segments */}
          {moveSelectedToTheTop(data).map(({ id, value, getColor }) => {
            const [startX, startY] = getCoordinatesForPercent(cumulativePercent);

            cumulativePercent += value/100;

            const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
            const largeArcFlag = value / 100 > 0.5 ? 1 : 0;

            const isSelected = id === selectedSegmentId;
            const isHighlighted = highlightedId === id && !isSelected;

            return (
              <G
                key={id}
                transform={isSelected ? 'translate(-0.02,0.02)' : 'translate(0,0)'}
              >
                <Path
                  style={[
                    styles.segment,
                    isSelected && { transform: [{ scale: 1.1 }] },
                  ]}
                  d={[
                    `M ${startX} ${startY}`, // Move
                    `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
                    'L 0 0', // Line
                  ].join(' ')}
                  // strokeWidth={width / 100 / 1000}
                  // stroke={isSelected ? COLOR.BLACK : undefined}
                  fill={isSelected
                    ? getColor(1)
                    : isHighlighted ? getColor(0.85) : getColor(0.7)
                  }
                  onClick={() => onSelectSegment(id)}
                  onMouseEnter={() => setHighlightedId(id)}
                  onMouseLeave={() => setHighlightedId(undefined)}
                />
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  radialChart: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    overflow: 'hidden',
  },

  segment: {
    transition: 'transform 0.3s',
    cursor: 'pointer',
  },
});
