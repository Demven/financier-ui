import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Path } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import PropTypes from 'prop-types';
import { COLOR } from '../../../styles/colors';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const SCALE_FACTOR = 1.03;
const SCALE_DURATION = 300; // ms

RadialSegment.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  getColor: PropTypes.func.isRequired,
  chartWidth: PropTypes.number.isRequired,
  startX: PropTypes.number.isRequired,
  startY: PropTypes.number.isRequired,
  endX: PropTypes.number.isRequired,
  endY: PropTypes.number.isRequired,
  isSelected: PropTypes.bool,
  isHighlighted: PropTypes.bool,
  onSelect: PropTypes.func,
  onHighlight: PropTypes.func,
};

export default function RadialSegment (props) {
  const {
    id,
    value,
    getColor,
    chartWidth,
    startX,
    startY,
    endX,
    endY,
    isSelected,
    isHighlighted,
    onSelect = () => {},
    onHighlight = () => {},
  } = props;

  const animatedStartX = useSharedValue(startX);
  const animatedStartY = useSharedValue(startY);
  const animatedEndX = useSharedValue(endX);
  const animatedEndY = useSharedValue(endY);

  useEffect(() => {
    animatedStartX.value = withTiming(isSelected ? animatedStartX.value * SCALE_FACTOR : animatedStartX.value / SCALE_FACTOR, {
      duration: SCALE_DURATION,
      easing: Easing.inOut(Easing.cubic),
      reduceMotion: 'system',
    });
    animatedStartY.value = withTiming(isSelected ? animatedStartY.value * SCALE_FACTOR : animatedStartY.value / SCALE_FACTOR, {
      duration: SCALE_DURATION,
      easing: Easing.inOut(Easing.cubic),
      reduceMotion: 'system',
    });
    animatedEndX.value = withTiming(isSelected ? animatedEndX.value * SCALE_FACTOR : animatedEndX.value / SCALE_FACTOR, {
      duration: SCALE_DURATION,
      easing: Easing.inOut(Easing.cubic),
      reduceMotion: 'system',
    });
    animatedEndY.value = withTiming(isSelected ? animatedEndY.value * SCALE_FACTOR : animatedEndY.value / SCALE_FACTOR, {
      duration: SCALE_DURATION,
      easing: Easing.inOut(Easing.cubic),
      reduceMotion: 'system',
    });
  }, [isSelected]);

  const largeArcFlag = value / 100 > 0.5 ? 1 : 0;

  const animatedProps = useAnimatedProps(() => ({
    d: [
      `M ${animatedStartX.value} ${animatedStartY.value}`, // Move
      `A 1 1 0 ${largeArcFlag} 1 ${animatedEndX.value} ${animatedEndY.value}`, // Arc
      'L 0 0', // Line
      `L ${animatedStartX.value} ${animatedStartY.value}`, // Move to the start
    ].join(' '),
  }));

  return (
    <AnimatedPath
      style={styles.radialSegment}
      animatedProps={animatedProps}
      stroke={isSelected ? COLOR.BLACK : COLOR.GRAY}
      strokeWidth={isSelected ? chartWidth / 100 / 650 : chartWidth / 100 / 1500}
      fill={isSelected
        ? getColor(0.9)
        : isHighlighted ? getColor(0.82) : getColor(0.67)
      }
      onClick={() => onSelect(id)}
      onMouseEnter={() => onHighlight(id)}
      onMouseLeave={() => onHighlight(undefined)}
    />
  );
}


const styles = StyleSheet.create({
  radialSegment: {
    cursor: 'pointer',
  },
});
