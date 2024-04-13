import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  G,
  Text,
} from 'react-native-svg';
import PropTypes from 'prop-types';
import RadialSegment from './RadialSegment';
import { FONT } from '../../../styles/fonts';

RadialChart.propTypes = {
  style: PropTypes.any,
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    textColor: PropTypes.string.isRequired,
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

  const [width, setWidth] = useState(400);
  const [highlightedId, setHighlightedId] = useState();

  function onLayout (event) {
    setWidth(event.nativeEvent.layout.width);
  }

  function getCoordinatesForPercent (percent) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);

    return [x, y];
  }

  let cumulativePercent1 = -25/100; // non-selected segments
  let cumulativePercent2 = -25/100; // selected segments
  let cumulativePercent3 = -25/100; // text segments

  return (
    <View
      style={[styles.radialChart, { height: width }, style]}
      onLayout={onLayout}
    >
      <Svg
        height='100%'
        width='100%'
        viewBox='-1 -1 2 2'
      >
        <G style={{ transform: [{ scale: 0.92 }]}}>
          {data.map(({ id, value, getColor }) => {
            const [startX, startY] = getCoordinatesForPercent(cumulativePercent1);

            cumulativePercent1 += value/100;

            const [endX, endY] = getCoordinatesForPercent(cumulativePercent1);

            const isSelected = id === selectedSegmentId;
            const isHighlighted = highlightedId === id && !isSelected;

            if (isSelected) {
              return null;
            }

            return (
              <RadialSegment
                key={id}
                id={id}
                value={value}
                getColor={getColor}
                chartWidth={width}
                startX={startX}
                startY={startY}
                endX={endX}
                endY={endY}
                isSelected={isSelected}
                isHighlighted={isHighlighted}
                onSelect={onSelectSegment}
                onHighlight={setHighlightedId}
              />
            );
          })}
        </G>

        <G style={{ transform: [{ scale: 0.92 }]}}>
          {data.map(({ id, value, getColor }) => {
            const [startX, startY] = getCoordinatesForPercent(cumulativePercent2);

            cumulativePercent2 += value/100;

            const [endX, endY] = getCoordinatesForPercent(cumulativePercent2);

            const isSelected = id === selectedSegmentId;
            const isHighlighted = highlightedId === id && !isSelected;

            if (!isSelected) {
              return null;
            }

            return (
              <RadialSegment
                key={id}
                id={id}
                value={value}
                getColor={getColor}
                chartWidth={width}
                startX={startX}
                startY={startY}
                endX={endX}
                endY={endY}
                isSelected={isSelected}
                isHighlighted={isHighlighted}
                onSelect={onSelectSegment}
                onHighlight={setHighlightedId}
              />
            );
          })}
        </G>

        <G style={{ transform: [{ scale: 0.72 }]}}>
          {data.map(({ id, value, textColor }) => {
            cumulativePercent3 += value/100;

            const middlePercent = cumulativePercent3 - value/100/2;
            const [middleX, middleY] = getCoordinatesForPercent(middlePercent);

            const isSelected = id === selectedSegmentId;

            return (
              <Text
                key={id}
                x={middleX}
                y={middleY}
                textAnchor='middle'
                alignmentBaseline='middle'
                fill={textColor}
                fontSize={isSelected ? 0.1 : 0.085}
                fontFamily={FONT.NOTO_SERIF.BOLD}
              >
                {value.toFixed(1).replace('.0', '')}
              </Text>
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
    cursor: 'pointer',
  },
});
