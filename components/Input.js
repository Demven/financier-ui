import { useState } from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { COLOR } from '../styles/colors';
import { FONT } from '../styles/fonts';

export const KEYBOARD_TYPE = {
  DEFAULT: 'default',
  NUMBER: 'numeric',
};

Input.propTypes = {
  style: PropTypes.object,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  keyboardType: PropTypes.oneOf(Object.values(KEYBOARD_TYPE)),
  maxLength: PropTypes.number,
  multiline: PropTypes.bool,
  secure: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func.isRequired,
  errorText: PropTypes.string,
};

export default function Input (props) {
  const {
    style,
    label,
    placeholder,
    keyboardType,
    maxLength,
    multiline,
    secure,
    value,
    errorText,
    onChange,
  } = props;

  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        styles.inputContainer,
        focused && styles.inputContainerFocused,
        style,
      ]}
    >
      <Text style={[styles.label, focused && styles.labelFocused]}>
        {label}
      </Text>

      <TextInput
        style={[
          styles.input,
          multiline && styles.multiline,
          errorText && styles.inputInvalid,
        ]}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={COLOR.LIGHT_GRAY}
        maxLength={maxLength}
        multiline={multiline}
        secureTextEntry={secure}
        value={value}
        onChangeText={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

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

  label: {
    marginBottom: 8,
    marginLeft: 4,
    fontFamily: FONT.SUMANA.REGULAR,
    fontSize: 12,
    lineHeight: 12,
    color: COLOR.GRAY,
    transition: 'color 0.3s',
  },
  labelFocused: {
    color: COLOR.ORANGE,
    fontFamily: FONT.SUMANA.BOLD,
  },

  input: {
    paddingTop: 4,
    paddingBottom: 8,
    paddingHorizontal: 4,
    backgroundColor: COLOR.TRANSPARENT,
    color: COLOR.DARK_GRAY,
    fontFamily: FONT.SUMANA.REGULAR,
    fontSize: 20,
    lineHeight: 30,
    border: 0,
    transition: 'border 0.3s',
    outlineStyle: 'none',
  },
  inputInvalid: {
    backgroundColor: COLOR.RED,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical : 'top',
  },
  error: {
    marginTop: 8,
    fontSize: 12,
    color: COLOR.RED,
  },
});
