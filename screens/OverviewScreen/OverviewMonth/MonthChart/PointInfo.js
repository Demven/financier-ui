import { Circle, G, Rect, Text } from 'react-native-svg';
import PropTypes from 'prop-types';
import { FONT } from '../../../../styles/fonts';

const MIN_SPACE = 24;

PointInfo.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  chartWidth: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

export default function PointInfo (props) {
  const {
    title = '',
    subTitle = '',
    x,
    y,
    chartWidth,
    color,
  } = props;

  const subTitleWidth = subTitle?.length * 6.3;
  const width = subTitleWidth + (8 * 2);
  const height = 46;
  let xOffset = 6;
  const yOffset = 6;
  let tipTxtX = 16;
  const tipTxtY = 24;

  const outOfBounds = chartWidth - x - width - MIN_SPACE < 0;

  if (outOfBounds) {
    xOffset = -(xOffset + width);
    tipTxtX = tipTxtX - width - 12;
  }

  return (
    <G>
      <Circle
        cx={x}
        cy={y}
        r={5}
        stroke={color}
        strokeWidth={2}
        fill={color}
      />

      <G
        x={x}
        y={y}
      >
        <Rect
          x={xOffset}
          y={yOffset}
          width={width}
          height={height}
          fill={color}
          rx={3}
          ry={3}
        />

        <Text
          x={tipTxtX}
          y={tipTxtY}
          fontFamily={FONT.NOTO_SERIF.REGULAR}
          fontSize={12}
          textAnchor='start'
          fill='white'
        >
          {title}
        </Text>

        <Text
          x={tipTxtX}
          y={tipTxtY + 18}
          fontFamily={FONT.NOTO_SERIF.BOLD}
          fontSize={12}
          textAnchor='start'
          fill='white'
        >
          {subTitle}
        </Text>
      </G>
    </G>
  );
}
