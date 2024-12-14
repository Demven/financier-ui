import { useState } from 'react';
import {
  StyleSheet,
  Pressable,
  View,
  Text,
  Platform,
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
  style: PropTypes.any,
  buttonContainerStyle: PropTypes.object,
  textStyle: PropTypes.object,
  look: PropTypes.oneOf(Object.values(BUTTON_LOOK)),
  onPress: PropTypes.func,
  text: PropTypes.string.isRequired,
  destructive: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default function Button (props) {
  const {
    style,
    buttonContainerStyle,
    textStyle,
    look = BUTTON_LOOK.PRIMARY,
    onPress,
    text,
    destructive,
    disabled,
  } = props;

  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
        destructive && styles.buttonDestructive,
        Platform.OS === 'web' && {
          outlineStyle: 'none',
        },
        style,
      ]}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onPressIn={() => setPressed(true)}
      onPress={!disabled ? onPress : undefined}
      onPressOut={() => setPressed(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <View style={[
        styles.buttonContainer,
        styles[`buttonContainer--${look}`],
        ((hover || focused) && !disabled) && styles.buttonContainerActive,
        disabled && styles.buttonContainerDisabled,
        buttonContainerStyle,
      ]}>
        <Text style={[
          styles.text,
          styles[`text--${look}`],
          destructive && styles.textDestructive,
          textStyle,
          ((pressed || focused) && !disabled && !destructive) && styles.textActive,
          ((hover || focused) && look === BUTTON_LOOK.TERTIARY) && styles.textTertiaryActive,
        ]}>
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
  buttonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  buttonDestructive: {},

  buttonContainer: {
    position: 'relative',
    height: Platform.select({ ios: 46, web: 40 }),
    paddingVertical: 8,
    paddingHorizontal: Platform.select({ ios: 36, web: 24 }),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 2,
    boxSizing: 'border-box',
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
  buttonContainerActive: {
    borderWidth: 2,
    paddingVertical: 7,
    paddingHorizontal: 23,
  },
  buttonContainerDisabled: {
    backgroundColor: COLOR.LIGHTER_GRAY,
    borderColor: COLOR.LIGHT_GRAY,
  },

  text: {
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: Platform.select({ ios: 20, web: 18 }),
    lineHeight: Platform.select({ ios: 26, web: 18 }),
    color: COLOR.DARK_GRAY,
  },
  ['text--primary']: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
  },
  textActive: {
    color: COLOR.BLACK,
  },
  textDestructive: {
    color: COLOR.RED,
  },
  textTertiaryActive: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
});
