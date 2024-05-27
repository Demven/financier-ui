import { useState } from 'react';
import {
  Text,
  View,
  StyleSheet, Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon, { ICON_COLLECTION } from './Icon';
import { COLOR } from '../styles/colors';
import { FONT } from '../styles/fonts';

Dropdown.propTypes = {
  style: PropTypes.any,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  placeholderStyle: PropTypes.any,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  value: PropTypes.string,
  maxVisibleItems: PropTypes.number,
  setValue: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    description: PropTypes.string,
  })).isRequired,
  setItems: PropTypes.func.isRequired,
};

const ITEM_HEIGHT = 60;

export default function Dropdown (props) {
  const {
    style,
    label = '',
    placeholder = '',
    placeholderStyle,
    open = false,
    maxVisibleItems = 5,
    setOpen = () => {},
    value = '',
    setValue = () => {},
    items = [],
    setItems = () => {},
  } = props;

  const [focused, setFocused] = useState(false);

  function onFocus () {
    setFocused(true);
  }

  function onBlur () {
    setFocused(false);
  }

  const description = items.find(item => item.value === value)?.description;

  return (
    <View style={[styles.dropdown, style]}>
      <Text style={[styles.label, (open || focused) && styles.labelActive]}>
        {label}
      </Text>

      <DropDownPicker
        style={[styles.picker]}
        containerStyle={[styles.pickerContainer, (open || focused) && styles.pickerContainerActive]}
        containerProps={{ onFocus, onBlur }}
        textStyle={[styles.pickerText, placeholderStyle]}
        dropDownContainerStyle={[styles.pickerList, {
          height: Math.ceil(ITEM_HEIGHT * items.length),
          maxHeight: Math.ceil(ITEM_HEIGHT * maxVisibleItems),
        }]}
        listItemContainerStyle={styles.pickerListItem}
        listItemLabelStyle={styles.pickerListItemText}
        selectedItemLabelStyle={styles.pickerListItemTextSelected}
        placeholderStyle={[styles.pickerPlaceholder, placeholderStyle]}
        open={open}
        setOpen={setOpen}
        value={value}
        setValue={setValue}
        items={items}
        setItems={setItems}
        disableBorderRadius
        placeholder={placeholder}
        ArrowUpIconComponent={({style}) => (
          <Icon
            style={style}
            collection={ICON_COLLECTION.IONICONS}
            name='caret-up'
            size={22}
          />
        )}
        ArrowDownIconComponent={({style}) => (
          <Icon
            style={style}
            collection={ICON_COLLECTION.IONICONS}
            name='caret-down'
            size={22}
          />
        )}
        TickIconComponent={({style}) => (
          <Icon
            style={style}
            collection={ICON_COLLECTION.IONICONS}
            name='checkmark-sharp'
            size={Platform.select({ web: 24, ios: 16 })}
            color={COLOR.ORANGE}
          />
        )}
      />

      {!!description && (
        <Text style={styles.description}>
          {description}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    flexGrow: 1,
  },

  label: {
    marginBottom: 8,
    marginLeft: 4,
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 12,
    lineHeight: 12,
    color: COLOR.GRAY,
    transition: 'color 0.3s',
  },
  labelFocused: {
    color: COLOR.ORANGE,
    fontFamily: FONT.NOTO_SERIF.BOLD,
  },
  labelActive: {
    color: COLOR.ORANGE,
    fontFamily: FONT.NOTO_SERIF.BOLD,
  },

  pickerContainer: {
    borderBottomWidth: 2,
    borderBottomColor: COLOR.LIGHTER_GRAY,
    borderStyle: 'solid',
    transition: 'border 0.3s',
  },
  pickerContainerActive: {
    borderBottomColor: COLOR.BRIGHT_ORANGE,
    borderBottomWidth: 3,
  },

  picker: {
    borderWidth: 0,
    outlineStyle: 'none',
  },

  pickerList: {
    top: 55,
    borderRadius: 0,
    borderColor: COLOR.LIGHTER_GRAY,
    paddingVertical: 8,
    backgroundColor: COLOR.WHITE,
  },
  pickerListItem: {
    height: 'auto',
    paddingVertical: 16,
    paddingHorizontal: 24,
    paddingLeft: 30,
  },
  pickerListItemText: {
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: Platform.select({ web: 20, ios: 18 }),
    lineHeight: Platform.select({ web: 20, ios: 18 }),
    color: COLOR.DARK_GRAY,
  },
  pickerListItemTextSelected: {
    left: -12,
    fontFamily: FONT.NOTO_SERIF.BOLD,
  },
  pickerPlaceholder: {
    left: -6,
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: Platform.select({ web: 20, ios: 22 }),
    lineHeight: Platform.select({ web: 20, ios: 22 }),
    color: COLOR.LIGHT_GRAY,
  },
  pickerText: {
    left: -6,
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: Platform.select({ web: 20, ios: 22 }),
    lineHeight: Platform.select({ web: 20, ios: 22 }),
    color: COLOR.DARK_GRAY,
  },

  description: {
    width: Platform.select({ web: '80%' }),
    marginTop: 12,
    marginLeft: 4,
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 15,
    lineHeight: 20,
    color: COLOR.DARK_GRAY,
  },
});
