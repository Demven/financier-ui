import { useState } from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { COLOR } from '../styles/colors';
import { FONT } from '../styles/fonts';

export const INPUT_TYPE = {
  DEFAULT: 'default',
  NUMBER: 'number',
  QUANTITY: 'quantity',
  CURRENCY: 'currency',
  EMAIL: 'email',
};

const KEYBOARD_TYPE = {
  [INPUT_TYPE.DEFAULT]: 'default',
  [INPUT_TYPE.NUMBER]: 'decimal-pad',
  [INPUT_TYPE.QUANTITY]: 'decimal-pad',
  [INPUT_TYPE.CURRENCY]: 'decimal-pad',
  [INPUT_TYPE.EMAIL]: 'email-address',
};

Input.propTypes = {
  style: PropTypes.object,
  inputType: PropTypes.oneOf(Object.values(INPUT_TYPE)),
  label: PropTypes.string,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  multiline: PropTypes.bool,
  secure: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onKeyPress: PropTypes.func,
  errorText: PropTypes.string,
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
};

export default function Input (props) {
  const {
    style,
    label,
    placeholder,
    inputType,
    maxLength,
    multiline,
    secure,
    value,
    errorText,
    onChange,
    onBlur,
    onKeyPress,
    disabled,
    autoFocus,
  } = props;

  const currencySymbol = useSelector(state => state.account.currencySymbol) || '';

  const [focused, setFocused] = useState(false);

  return (
    <View style={{ flexGrow: 1 }}>
      <View
        style={[
          styles.inputContainer,
          focused && styles.inputContainerFocused,
          disabled && styles.inputContainerDisabled,
          errorText && styles.inputContainerInvalid,
          style,
        ]}
      >
        {label && (
          <Text style={[
            styles.label,
            focused && styles.labelFocused,
            !!errorText && styles.labelError
          ]}>
            {label}
          </Text>
        )}

        {(inputType === INPUT_TYPE.QUANTITY || inputType === INPUT_TYPE.CURRENCY) && (
          <Text style={[styles.symbol, focused && styles.symbolFocused]}>
            {inputType === INPUT_TYPE.QUANTITY ? '#' : currencySymbol}
          </Text>
        )}

        <TextInput
          style={[
            styles.input,
            multiline && styles.multiline,
            disabled && styles.inputDisabled,
            inputType === INPUT_TYPE.NUMBER && styles.inputNumber,
            (inputType === INPUT_TYPE.QUANTITY || inputType === INPUT_TYPE.CURRENCY) && styles.inputWithSymbol,
          ]}
          keyboardType={KEYBOARD_TYPE[inputType] || KEYBOARD_TYPE[INPUT_TYPE.DEFAULT]}
          placeholder={placeholder}
          placeholderTextColor={COLOR.LIGHT_GRAY}
          maxLength={maxLength}
          multiline={multiline}
          secureTextEntry={secure}
          value={value}
          onChangeText={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur();
          }}
          onKeyPress={onKeyPress}
          autoFocus={autoFocus}
        />
      </View>

      {errorText && (
        <Text style={styles.error}>{errorText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexGrow: 1,
    borderBottomWidth: 2,
    borderBottomColor: COLOR.LIGHTER_GRAY,
    borderStyle: 'solid',
  },
  inputContainerFocused: {
    borderBottomWidth: 3,
    borderBottomColor: COLOR.BRIGHT_ORANGE,
  },
  inputContainerDisabled: {
    cursor: 'not-allowed',
  },
  inputContainerInvalid: {
    borderBottomWidth: 3,
    borderBottomColor: COLOR.RED,
  },

  label: {
    marginBottom: Platform.select({ web: 8, ios: 0 }),
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
  labelError: {
    color: COLOR.RED,
  },

  symbol: {
    position: 'absolute',
    left: 3,
    bottom: Platform.select({ web: 10, ios: 7 }),
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: Platform.select({ web: 24, ios: 28 }),
    lineHeight: Platform.select({ web: 24, ios: 28 }),
    color: COLOR.GRAY,
  },
  symbolFocused: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
  },

  input: {
    paddingTop: Platform.select({ web: 0, ios: 4 }),
    paddingBottom: Platform.select({ web: 4, ios: 12 }),
    paddingHorizontal: 4,
    backgroundColor: COLOR.TRANSPARENT,
    color: COLOR.DARK_GRAY,
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: Platform.select({ web: 20, ios: 22 }),
    lineHeight: 34,
    borderWidth: 0,
    transition: Platform.select({ web: 'border 0.3s' }),
    outlineStyle: 'none',
  },
  inputDisabled: {
    color: COLOR.LIGHT_GRAY,
    pointerEvents: 'none',
  },
  inputNumber: {
    textAlign: 'right',
  },
  inputWithSymbol: {
    paddingLeft: 20,
    textAlign: 'right',
  },

  multiline: {
    minHeight: 100,
    textAlignVertical : 'top',
  },

  error: {
    marginTop: 10,
    paddingLeft: 4,
    fontSize: 12,
    color: COLOR.RED,
  },
});
