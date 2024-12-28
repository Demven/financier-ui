import { G, Text, Rect } from 'react-native-svg';
import PropTypes from 'prop-types';
import { FONT } from '../../../styles/fonts';

DonutChartLabel.propTypes = {
  color: PropTypes.string,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
};

const LABEL_WRAPPER_SIZE = 20;

export default function DonutChartLabel (props) {
  const {
    color,
    x,
    y,
    label,
  } = props;

  return (
    <G>
      <Rect
        fill='transparent'
        x={x - LABEL_WRAPPER_SIZE / 2}
        y={y - LABEL_WRAPPER_SIZE / 2}
        width={LABEL_WRAPPER_SIZE}
        height={LABEL_WRAPPER_SIZE}
      />

      <Text
        x={x}
        y={y}
        dominantBaseline='middle'
        textAnchor='middle'
        fontFamily={FONT.NOTO_SERIF.BOLD}
        fontSize={20}
        fill={color}
      >
        {label}
      </Text>
    </G>
  )
}
