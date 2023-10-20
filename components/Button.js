import { useState } from 'react';
import {
  StyleSheet,
  Pressable,
  View,
  Text, Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import { FONT } from '../styles/fonts';
import { COLOR } from '../styles/colors';

export const BUTTON_LOOK = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary',
};

Button.propTypes = {
  style: PropTypes.object,
  look: PropTypes.oneOf([Object.values(BUTTON_LOOK)]),
  onPress: PropTypes.func,
  text: PropTypes.string.isRequired,
};

export default function Button (props) {
  const {
    style,
    look = BUTTON_LOOK.PRIMARY,
    onPress,
    text,
  } = props;

  const [hover, setHover] = useState(false);

  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, style]}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onPress={onPress}
    >
      <View style={[
        styles.buttonContainer,
        hover && styles.buttonContainerHover,
        styles[`buttonContainer--${look}`
      ]]}>
        <Text style={[styles.text, styles[`text--${look}`]]}>
          {text}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {},
  buttonPressed: {
    opacity: 0.7,
  },

  buttonContainer: {
    position: 'relative',
    height: Platform.select({ ios: 46, web: 40 }),
    paddingTop: Platform.select({ ios: 12, web: 8 }),
    paddingHorizontal: Platform.select({ ios: 36, web: 24 }),
    paddingBottom: Platform.select({ ios: 0, web: 8 }),
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 2,
    boxSizing: 'border-box',
  },
  buttonContainerHover: {
    borderWidth: 2,
    paddingVertical: 7,
    paddingHorizontal: 23,
  },
  ['buttonContainer--primary']: {
    backgroundColor: COLOR.LIGHT_ORANGE,
    borderColor: COLOR.ORANGE,
  },
  ['buttonContainer--secondary']: {
    backgroundColor: COLOR.PALE_GRAY,
    borderColor: COLOR.LIGHTER_GRAY,
  },
  ['buttonContainer--tertiary']: {
    backgroundColor: COLOR.TRANSPARENT,
    borderColor: COLOR.TRANSPARENT,
  },

  text: {
    paddingBottom: Platform.select({ ios: 0, web: 3 }),
    fontFamily: FONT.SUMANA.REGULAR,
    fontSize: Platform.select({ ios: 21, web: 18 }),
    lineHeight: Platform.select({ ios: 38, web: 18 }),
  },
  ['text--primary']: {
    fontFamily: FONT.SUMANA.BOLD,
  },
});
