import {
  Text,
  View,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon, { ICON_COLLECTION } from './Icon';
import { COLOR } from '../styles/colors';
import { FONT } from '../styles/fonts';

Dropdown.propTypes = {
  style: PropTypes.object,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  setItems: PropTypes.func.isRequired,
};

const ITEM_HEIGHT = 40;

export default function Dropdown (props) {
  const {
    style,
    label = '',
    placeholder = '',
    open = false,
    setOpen = () => {},
    value = '',
    setValue = () => {},
    items = [],
    setItems = () => {},
  } = props;

  return (
    <View style={[styles.dropdown, style]}>
      <Text style={[styles.label, open && styles.labelOpen]}>
        {label}
      </Text>

      <DropDownPicker
        containerStyle={[styles.pickerContainer, open && styles.pickerContainerOpen]}
        style={[styles.picker]}
        textStyle={styles.pickerText}
        dropDownContainerStyle={[styles.pickerList, {
          height: `${Math.ceil(ITEM_HEIGHT * items.length)}px`,
          maxHeight: `${Math.ceil(ITEM_HEIGHT * 6)}px`,
        }]}
        listItemContainerStyle={styles.pickerListItem}
        listItemLabelStyle={styles.pickerListItemText}
        selectedItemLabelStyle={styles.pickerListItemTextSelected}
        placeholderStyle={styles.pickerPlaceholder}
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
            size={24}
            color={COLOR.ORANGE}
          />
        )}
      />
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
    fontFamily: FONT.SUMANA.REGULAR,
    fontSize: 12,
    lineHeight: 12,
    color: COLOR.GRAY,
    transition: 'color 0.3s',
  },
  labelOpen: {
    color: COLOR.ORANGE,
    fontFamily: FONT.SUMANA.BOLD,
  },

  pickerContainer: {
    borderBottomWidth: 2,
    borderBottomColor: COLOR.LIGHTER_GRAY,
    borderStyle: 'solid',
    transition: 'border 0.3s',
  },
  pickerContainerOpen: {
    borderBottomColor: COLOR.BRIGHT_ORANGE,
    borderBottomWidth: 3,
  },

  picker: {
    border: 0,
  },
  pickerList: {
    top: 55,
    borderRadius: 0,
    borderColor: COLOR.LIGHTER_GRAY,
  },
  pickerListItem: {
    height: 'auto',
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  pickerListItemText: {
    fontFamily: FONT.SUMANA.REGULAR,
    fontSize: 18,
    lineHeight: 34,
    color: COLOR.DARK_GRAY,
  },
  pickerListItemTextSelected: {
    fontFamily: FONT.SUMANA.BOLD,
  },
  pickerPlaceholder: {
    left: -6,
    fontFamily: FONT.SUMANA.REGULAR,
    fontSize: 20,
    lineHeight: 36,
    color: COLOR.LIGHT_GRAY,
  },
  pickerText: {
    left: -6,
    fontFamily: FONT.SUMANA.REGULAR,
    fontSize: 20,
    lineHeight: 36,
    color: COLOR.DARK_GRAY,
  },
});
