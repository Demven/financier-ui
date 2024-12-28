import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Path } from 'react-native-svg';
import PropTypes from 'prop-types';
import { COLOR } from '../../../styles/colors';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const SCALE_FACTOR = 1.2;
const SCALE_DURATION = 300; // ms

DonutChartSegment.propTypes = {
  id: PropTypes.number.isRequired,
  getColor: PropTypes.func.isRequired,
  startAngle: PropTypes.number.isRequired,
  endAngle: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  cutoutRadius: PropTypes.number.isRequired,
  isSelected: PropTypes.bool,
  isHighlighted: PropTypes.bool,
  isAnimated: PropTypes.bool,
  onSelect: PropTypes.func,
  onHighlight: PropTypes.func,
};

const DEGREES_IN_CIRCLE = 360;

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

function getArcPath (
  radius,
  cutoutRadius,
  startAngle,
  endAngle,
) {
  const start1 = polarToCartesian(radius, radius, endAngle);
  const end1 = polarToCartesian(radius, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= DEGREES_IN_CIRCLE / 2
    ? 0
    : 1;

  const start2 = polarToCartesian(radius, cutoutRadius, endAngle);
  const end2 = polarToCartesian(radius, cutoutRadius, startAngle);

  return {
    start1,
    end1,
    largeArcFlag,
    start2,
    end2,
  };
}

export default function DonutChartSegment (props) {
  const {
    id,
    getColor = (opacity) => COLOR.BLACK,
    startAngle,
    endAngle,
    radius,
    cutoutRadius,
    isSelected,
    isHighlighted,
    isAnimated = false,
    onSelect = (id) => {},
    onHighlight = (id) => {},
  } = props;

  const {
    start1,
    end1,
    largeArcFlag,
    start2,
    end2,
  } = getArcPath(radius, cutoutRadius, startAngle, endAngle);

  const animatedStart1X = useSharedValue(start1.x);
  const animatedStart1Y = useSharedValue(start1.y);
  const animatedEnd1X = useSharedValue(end1.x);
  const animatedEnd1Y = useSharedValue(end1.y);

  const animatedStart2X = useSharedValue(start2.x);
  const animatedStart2Y = useSharedValue(start2.y);
  const animatedEnd2X = useSharedValue(end2.x);
  const animatedEnd2Y = useSharedValue(end2.y);

  useEffect(() => {
    if (isAnimated && isSelected) {
      animatedStart1X.value = withTiming(isSelected ? animatedStart1X.value * SCALE_FACTOR : animatedStart1X.value, {
        duration: SCALE_DURATION,
        easing: Easing.inOut(Easing.cubic),
        reduceMotion: 'system',
      });
      animatedStart1Y.value = withTiming(isSelected ? animatedStart1Y.value * SCALE_FACTOR : animatedStart1Y.value, {
        duration: SCALE_DURATION,
        easing: Easing.inOut(Easing.cubic),
        reduceMotion: 'system',
      });
      animatedEnd1X.value = withTiming(isSelected ? animatedEnd1X.value * SCALE_FACTOR : animatedEnd1X.value, {
        duration: SCALE_DURATION,
        easing: Easing.inOut(Easing.cubic),
        reduceMotion: 'system',
      });
      animatedEnd1Y.value = withTiming(isSelected ? animatedEnd1Y.value * SCALE_FACTOR : animatedEnd1Y.value, {
        duration: SCALE_DURATION,
        easing: Easing.inOut(Easing.cubic),
        reduceMotion: 'system',
      });

      animatedStart2X.value = withTiming(isSelected ? animatedStart2X.value * SCALE_FACTOR : animatedStart2X.value, {
        duration: SCALE_DURATION,
        easing: Easing.inOut(Easing.cubic),
        reduceMotion: 'system',
      });
      animatedStart2Y.value = withTiming(isSelected ? animatedStart2Y.value * SCALE_FACTOR : animatedStart2Y.value, {
        duration: SCALE_DURATION,
        easing: Easing.inOut(Easing.cubic),
        reduceMotion: 'system',
      });
      animatedEnd2X.value = withTiming(isSelected ? animatedEnd2X.value * SCALE_FACTOR : animatedEnd2X.value, {
        duration: SCALE_DURATION,
        easing: Easing.inOut(Easing.cubic),
        reduceMotion: 'system',
      });
      animatedEnd2Y.value = withTiming(isSelected ? animatedEnd2Y.value * SCALE_FACTOR : animatedEnd2Y.value, {
        duration: SCALE_DURATION,
        easing: Easing.inOut(Easing.cubic),
        reduceMotion: 'system',
      });
    }
  }, [isAnimated, isSelected]);

  let path = [
    'M',
    start1.x,
    start1.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end1.x,
    end1.y,
    'L',
    radius,
    radius,
    'Z',
    'M',
    start2.x,
    start2.y,
    'A',
    cutoutRadius,
    cutoutRadius,
    0,
    largeArcFlag,
    0,
    end2.x,
    end2.y,
    'L',
    radius,
    radius,
    'Z',
  ].join(' ');

  if (endAngle - startAngle >= DEGREES_IN_CIRCLE) {
    const largeArcFlag = 0;
    const outerStart = polarToCartesian(radius, radius, 0);
    const outerMid = polarToCartesian(radius, radius, DEGREES_IN_CIRCLE / 2);
    const outerEnd = polarToCartesian(radius, radius, DEGREES_IN_CIRCLE);
    const innerStart = polarToCartesian(radius, cutoutRadius, 0);
    const innerMid = polarToCartesian(radius, cutoutRadius, DEGREES_IN_CIRCLE / 2);
    const innerEnd = polarToCartesian(radius, cutoutRadius, DEGREES_IN_CIRCLE);

    path = [
      'M',
      outerStart.x,
      outerStart.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      1,
      outerMid.x,
      outerMid.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      1,
      outerEnd.x,
      outerEnd.y,
      'L',
      innerEnd.x,
      innerEnd.y,
      'A',
      cutoutRadius,
      cutoutRadius,
      0,
      largeArcFlag,
      0,
      innerMid.x,
      innerMid.y,
      'A',
      cutoutRadius,
      cutoutRadius,
      0,
      largeArcFlag,
      0,
      innerStart.x,
      innerStart.y,
      'Z',
    ].join(' ');
  }

  const animatedProps = useAnimatedProps(() => ({
    d: path,
  }));

  return <AnimatedPath
    style={styles.donutChartSegment}
    fillRule='evenodd'
    fill={isSelected
      ? getColor(1)
      : isHighlighted
        ? getColor(0.75)
        : getColor(0.6)
    }
    animatedProps={animatedProps}
    onClick={() => onSelect(id)}
    onPress={() => onSelect(id)}
    onMouseEnter={() => onHighlight(id)}
    onMouseLeave={() => onHighlight(undefined)}
  />
}

const styles = StyleSheet.create({
  donutChartSegment: {
    cursor: 'pointer',
  },
});
