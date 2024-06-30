import { createElement, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  Pressable,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import PropTypes from 'prop-types';
import { dateToDateString, formatDateString } from '../services/date';
import { COLOR } from '../styles/colors';
import { FONT } from '../styles/fonts';

DatePicker.propTypes = {
  style: PropTypes.object,
  label: PropTypes.string,
  dateString: PropTypes.string.isRequired, // '1991-12-04'
  max: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default function DatePicker (props) {
  const {
    style,
    label,
    dateString,
    onChange,
    disabled,
    errorText,
    max,
  } = props;

  const [focused, setFocused] = useState(false);
  const [pickerModalOpened, setPickerModalOpened] = useState(false);

  return (
    <View
      style={[
        styles.datePicker,
        focused && styles.datePickerFocused,
        style,
      ]}
    >
      {label && (
        <Text style={[styles.label, focused && styles.labelFocused]}>
          {label}
        </Text>
      )}

      {Platform.OS === 'web' && createElement('input', {
        style: {
          ...styles.input,
          ...(disabled ? styles.inputDisabled : {}),
        },
        type: 'date',
        value: dateString,
        max,
        pattern: '\d{4}-\d{2}-\d{2}',
        onChange: (event) => {
          onChange(event.target.value);
        },
        onFocus: () => setFocused(true),
        onBlur: () => setFocused(false),
        disabled,
      })}

      {Platform.OS !== 'web' && (
        <>
          <Pressable onPress={disabled
            ? undefined
            : () => setPickerModalOpened(true)}
          >
            <Text style={[styles.chosenDateText, disabled && styles.chosenDateTextDisabled]}>
              {formatDateString(dateString)}
            </Text>
          </Pressable>

          <DateTimePickerModal
            isVisible={pickerModalOpened}
            mode='date'
            date={new Date(dateString)}
            maximumDate={max ? new Date(max) : undefined}
            onConfirm={(date) => {
              setPickerModalOpened(false);

              try {
                onChange(dateToDateString(date));
              } catch (error) {}
            }}
            onCancel={() => setPickerModalOpened(false)}
          />
        </>
      )}

      {errorText && (
        <Text style={styles.error}>{errorText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  datePicker: {
    flexGrow: 1,
    borderBottomWidth: 2,
    borderBottomColor: COLOR.LIGHTER_GRAY,
    borderStyle: 'solid',
  },
  datePickerFocused: {
    borderBottomWidth: 3,
    borderBottomColor: COLOR.BRIGHT_ORANGE,
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

  input: {
    height: 52,
    paddingTop: 8,
    paddingRight: 8,
    paddingBottom: 4,
    paddingHorizontal: 4,
    backgroundColor: COLOR.TRANSPARENT,
    color: COLOR.DARK_GRAY,
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 20,
    lineHeight: '34px',
    borderWidth: 0,
    transition: 'border 0.3s',
    outlineStyle: 'none',
    boxSizing: 'border-box'
  },
  inputDisabled: {
    color: COLOR.LIGHT_GRAY,
    cursor: 'not-allowed',
  },

  chosenDateText: {
    height: 46,
    paddingTop: 8,
    flexGrow: 1,
    color: COLOR.DARK_GRAY,
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 22,
    lineHeight: 46,
    textAlign: 'center',
    boxSizing: 'border-box'
  },
  chosenDateTextDisabled: {
    color: COLOR.LIGHT_GRAY,
  },
});
