import {
  useState,
  useMemo,
  Fragment,
  useEffect,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { useSelector } from 'react-redux';
import Svg from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import PropTypes from 'prop-types';
import DonutChartSegment from './DonutChartSegment';
import DonutChartLabel from './DonutChartLabel';
import { COLOR } from '../../../styles/colors';
import { FONT } from '../../../styles/fonts';
import { MEDIA } from '../../../styles/media';

DonutChart.propTypes = {
  style: PropTypes.any,
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    absoluteValue: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    textColor: PropTypes.string.isRequired,
    getColor: PropTypes.func.isRequired,
  })).isRequired,
  selectedSegmentId: PropTypes.number,
  onSelectSegment: PropTypes.func,
};

const DEGREES_IN_CIRCLE = 360;
const DONUT_RADIUS = 0.46;
const SPACE_BETWEEN = 0.8;
const DEFAULT_SCALE = 0.9;

function degreesToRadians (degrees) {
  return degrees * (Math.PI / (DEGREES_IN_CIRCLE / 2));
}

function polarToCartesian (
  radius,
  cutoutRadius,
  angleInDegrees,
) {
  const angleInRadians = degreesToRadians(angleInDegrees - 90);

  return {
    x: radius + cutoutRadius * Math.cos(angleInRadians),
    y: radius + cutoutRadius * Math.sin(angleInRadians),
  }
}

export default function DonutChart (props) {
  const {
    style,
    data = [],
    selectedSegmentId,
    onSelectSegment = () => {},
  } = props;

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const currencySymbol = useSelector(state => state.account.currencySymbol);

  const total = data.reduce((total, { value }) => total + value, 0);
  const adjustment = total - 100;

  const selectedSegmentAbsoluteValue = (data
    ?.find(segment => segment.id === selectedSegmentId)
    ?.absoluteValue || 0).toFixed(2);

  const [width, setWidth] = useState(400);
  const [highlightedId, setHighlightedId] = useState();

  const itemsWithAngles = useMemo(() => getItemsWithAngles(data), [data])

  const radius = width / 2;
  const donutRadius = radius * DONUT_RADIUS;

  const scale = useSharedValue(DEFAULT_SCALE);

  useEffect(() => {
    animate();
  }, [selectedSegmentId]);

  function animate () {
    scale.value = DEFAULT_SCALE;

    setTimeout(() => {
      scale.value = withTiming(1, {
        duration: 250,
        easing: Easing.inOut(Easing.cubic),
        reduceMotion: 'system',
      });
    }, 0);
  }

  function onLayout (event) {
    setWidth(event.nativeEvent.layout.width);
  }

  function getItemsWithAngles (items) {
    const itemsWithAngles = [];

    items.forEach((item, index) => {
      const startAngle = index === 0 ? 0 : itemsWithAngles[index - 1].endAngle;
      const endAngle = startAngle + (item.value / total) * DEGREES_IN_CIRCLE;

      itemsWithAngles.push({
        ...item,
        startAngle,
        endAngle,
      });
    })

    return itemsWithAngles;
  }

  const circleTextFontSize = windowWidth < MEDIA.MEDIUM_DESKTOP
    ? windowWidth < MEDIA.DESKTOP
      ? windowWidth < MEDIA.TABLET
        ? 32 // mobile
        : 42// tablet
      : 32 // desktop
    : 42; // wide desktop
  const circleTextLineHeight = windowWidth < MEDIA.MEDIUM_DESKTOP
    ? windowWidth < MEDIA.DESKTOP
      ? windowWidth < MEDIA.TABLET
        ? 36// mobile
        : 46 // tablet
      : 36 // desktop
    : 46; // wide desktop

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View
      style={[
        styles.donutChart,
        {
          height: width,
          borderRadius: width / 2,
        },
        style,
      ]}
      onLayout={onLayout}
    >
      <View
        style={[
          styles.chartWrapper,
          { transform: [{ scale: DEFAULT_SCALE }] },
        ]}
      >
        <Svg
          height='100%'
          width='100%'
          viewBox={`0 0 ${width} ${width}`}
        >
          {itemsWithAngles.map(({ id, getColor, textColor, startAngle, endAngle, value }, index) => {
            const adjustedValue = value - (adjustment * value / 100);
            const percentage = Math.round((adjustedValue * 100) / total);

            const isSelected = id === selectedSegmentId;
            const isHighlighted = highlightedId === id && !isSelected;

            const { x, y } = polarToCartesian(
              radius,
              donutRadius + (radius - donutRadius) / 2,
              startAngle + (endAngle - startAngle) / 2,
            );

            return (
              <Fragment key={index}>
                <DonutChartSegment
                  id={id}
                  getColor={getColor}
                  radius={radius}
                  cutoutRadius={donutRadius}
                  startAngle={startAngle}
                  endAngle={endAngle - SPACE_BETWEEN}
                  isSelected={isSelected}
                  isHighlighted={isHighlighted}
                  onSelect={onSelectSegment}
                  onHighlight={setHighlightedId}
                />

                {percentage > 5 && itemsWithAngles.length > 1 && (
                  <DonutChartLabel
                    color={textColor}
                    label={`${Math.round(((endAngle - startAngle) * 100) / DEGREES_IN_CIRCLE)}%`}
                    x={x}
                    y={y}
                  />
                )}
              </Fragment>
            );
          })}
        </Svg>
      </View>

      <Animated.View
        style={[
          styles.chartWrapper,
          animatedStyle,
          { pointerEvents: 'none' },
        ]}
      >
        <Svg
          height='100%'
          width='100%'
          viewBox={`0 0 ${width} ${width}`}
        >
          {itemsWithAngles.map(({ id, getColor, textColor, startAngle, endAngle, value }, index) => {
            const adjustedValue = value - (adjustment * value / 100);
            const percentage = Math.round((adjustedValue * 100) / total);

            const isSelected = id === selectedSegmentId;
            const isHighlighted = highlightedId === id && !isSelected;

            if (!isSelected) {
              return null;
            }

            const { x, y } = polarToCartesian(
              radius,
              donutRadius + (radius - donutRadius) / 2,
              startAngle + (endAngle - startAngle) / 2,
            );

            return (
              <Fragment key={index}>
                <DonutChartSegment
                  id={id}
                  getColor={() => getColor(1)}
                  radius={radius}
                  cutoutRadius={donutRadius}
                  startAngle={startAngle}
                  endAngle={endAngle - SPACE_BETWEEN}
                  isSelected={isSelected}
                  isHighlighted={isHighlighted}
                  onSelect={onSelectSegment}
                  onHighlight={setHighlightedId}
                />

                {percentage > 5 && itemsWithAngles.length > 1 && (
                  <DonutChartLabel
                    color={textColor}
                    label={`${Math.round(((endAngle - startAngle) * 100) / DEGREES_IN_CIRCLE)}%`}
                    x={x}
                    y={y}
                  />
                )}
              </Fragment>
            );
          })}
        </Svg>
      </Animated.View>

      <View
        style={[styles.circle, {
          width: `${100 * DONUT_RADIUS}%`,
          height: `${100 * DONUT_RADIUS}%`,
          top: `${(100 - (100 * DONUT_RADIUS)) / 2}%`,
          left: `${(100 - (100 * DONUT_RADIUS)) / 2}%`,
          borderRadius: width * DONUT_RADIUS,
        }]}
      >
        {Number(selectedSegmentAbsoluteValue) > 0 && (
          <Text style={[
            styles.circleText,
            windowWidth <= MEDIA.DESKTOP && styles.circleTextMobileTablet,
            {
              fontSize: circleTextFontSize,
              lineHeight: circleTextLineHeight,
            }]}
          >
            {currencySymbol}{selectedSegmentAbsoluteValue}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  donutChart: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
  },

  chartWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    transformOrigin: 'center',
  },

  segment: {
    cursor: 'pointer',
  },

  circle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
  },
  circleText: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
  },
  circleTextMobileTablet: {
    textAlign: 'center',
  },
});
