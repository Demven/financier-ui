import { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import ReanimatedColorPicker, { Panel5 } from 'reanimated-color-picker';
import ColorTile from './ColorTile';
import AddColorButton from './AddColorButton';
import { addColorAction, deleteColorAction } from '../../redux/reducers/colors';
import { getColorIntensityName } from '../../services/colors';
import { COLOR } from '../../styles/colors';
import { FONT } from '../../styles/fonts';
import { MEDIA } from '../../styles/media';

ColorPicker.propTypes = {
  style: PropTypes.object,
  label: PropTypes.string,
  color: PropTypes.shape({
    name: PropTypes.string,
    hex: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
};

export default function ColorPicker (props) {
  const {
    style,
    label,
    color,
    onChange,
  } = props;

  const dispatch = useDispatch();

  const [focused, setFocused] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const colors = useSelector(state => state.colors) || [];

  useEffect(() => {
    if (!color && colors?.length) {
      onChange(colors[0]);
    }
  }, [color, colors]);

  function onChooseColor (color) {
    onChange(color);
    setFocused(true);
  }

  const onSelectColor = ({ hex, rgb }) => {
    setTimeout(() => {
      const [red, green, blue] = rgb
        .replace('rgb(', '')
        .replace(')', '')
        .split(',')
        .map(colorString => Number(colorString.trim()));

      saveColor(hex, red, green, blue);

      setShowPicker(false);
    }, 750);
  };

  function saveColor (hex, red, green, blue) {
    dispatch(addColorAction({
      id: `${Math.floor(Math.random() * 100000)}`,
      name: hex,
      hex,
      red,
      green,
      blue,
      intensity: getColorIntensityName([red, green, blue]),
    }));
  }

  function onDeleteColor (id) {
    dispatch(deleteColorAction(id));

    if (id === color.id) {
      onChange(undefined);
    }
  }

  const colorsPerRow = windowWidth < MEDIA.MOBILE
    ? 3 // mobile
    : windowWidth < MEDIA.WIDE_MOBILE ?
      4 // wide-mobile
      : windowWidth < MEDIA.TABLET // desktop
        ? 5 // tablet
        : 6; // desktop

  const colorsByRow = Array.from(new Array(Math.ceil(colors.length / colorsPerRow)))
    .map((_, index) => {
      const chunkStart = index * colorsPerRow;
      return colors.slice(chunkStart, chunkStart + colorsPerRow);
    });

  const addColorButton = (
    <AddColorButton
      style={styles.color}
      pickerVisible={showPicker}
      onPress={() => setShowPicker(!showPicker)}
    />
  );

  return (
    <View
      style={[
        styles.colorPicker,
        { justifyContent: windowWidth < MEDIA.WIDE_MOBILE ? 'flex-end' : 'flex-start' },
        style,
      ]}
      onBlur={() => setFocused(false)}
    >
      {label && (
        <Text style={[styles.label, focused && styles.labelFocused]}>
          {`${label}: ${color?.name || ''}`}
        </Text>
      )}

      <View style={styles.colors}>
        {colorsByRow.map((colors, index) => (
          <View
            key={index}
            style={styles.colorsRow}
          >
            {colors.map((currentColor) => (
              <ColorTile
                key={currentColor.id}
                style={styles.color}
                color={currentColor}
                selected={color?.id === currentColor.id}
                onPress={() => onChooseColor(currentColor)}
                onDelete={() => onDeleteColor(currentColor.id)}
              />
            ))}

            {colors.length < colorsPerRow && addColorButton}
          </View>
        ))}

        {colorsByRow[colorsByRow.length - 1].length === colorsPerRow && addColorButton}
      </View>

      {showPicker && (
        <ReanimatedColorPicker
          style={styles.picker}
          value={color?.hex}
          onComplete={onSelectColor}
        >
          <Panel5 />
        </ReanimatedColorPicker>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  colorPicker: {
    flexGrow: 1,
  },

  label: {
    marginLeft: 4,
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 10,
    lineHeight: 10,
    color: COLOR.GRAY,
    transition: Platform.select({ web: 'color 0.3s' }),
  },
  labelFocused: {
    color: COLOR.ORANGE,
    fontFamily: FONT.NOTO_SERIF.BOLD,
  },

  colors: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  colorsRow: {
    flexDirection: 'row',
  },

  color: {
    paddingTop: 24,
    paddingRight: 12,
    paddingLeft: 12,
  },

  picker: {
    width: '100%',
    marginTop: 24,
  },
});
