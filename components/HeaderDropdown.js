import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon, { ICON_COLLECTION } from './Icon';
import { COLOR } from '../styles/colors';
import { FONT } from '../styles/fonts';

HeaderDropdown.propTypes = {
  style: PropTypes.any,
  selectedValue: PropTypes.any.isRequired,
  values: PropTypes.arrayOf(PropTypes.any).isRequired,
  onSelect: PropTypes.func.isRequired,
  onLayout: PropTypes.func,
};

export default function HeaderDropdown (props) {
  const {
    style,
    selectedValue,
    values,
    onSelect,
    onLayout,
  } = props;

  const [opened, setOpened] = useState(false);
  const [highlightedItemIndex, setHighlightedItemIndex] = useState(undefined);

  function toggleDropDown () {
    setOpened(!opened);
  }

  const listValues = values.filter(value => value !== selectedValue);
  const disabled = !listValues?.length;

  return (
    <View
      style={[styles.headerDropdown, style]}
      onMouseEnter={!disabled ? () => setOpened(true) : undefined}
      onMouseLeave={!disabled > 0 ? () => setOpened(false) : undefined}
      onLayout={onLayout}
    >
      <Pressable
        style={({ pressed }) => [
          styles.selectedItem,
          pressed && styles.selectedItemPressed,
          disabled && styles.selectedItemDisabled,
        ]}
        onPress={toggleDropDown}
      >
        <View style={styles.selectedItemContainer}>
          <Text style={[styles.selectedItemValue, disabled && styles.selectedItemValueDisabled]}>
            {selectedValue}
          </Text>

          {!disabled && (
            <Icon
              style={[styles.arrowIcon, {
                marginTop: Platform.OS === 'ios' ? -4 : 5,
              }]}
              name={opened ? 'caret-up' : 'caret-down'}
              collection={ICON_COLLECTION.IONICONS}
              size={20}
              color={COLOR.BLACK}
            />
          )}
        </View>
      </Pressable>

      {(opened && !disabled) && (
        <View style={[styles.list, {
          top: Platform.OS === 'ios' ? -12 : 0,
          paddingTop: Platform.OS === 'ios' ? 72 : 60,
        }]}>
          {listValues.map((value, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [pressed && styles.listItemPressed]}
              onPress={() => {
                onSelect(value);
                setOpened(false);
              }}
            >
              <View style={[styles.listItem, highlightedItemIndex === index && styles.listItemHighlighted]}>
                <Text
                  style={styles.listItemText}
                  onMouseEnter={() => setHighlightedItemIndex(index)}
                  onMouseLeave={() => setHighlightedItemIndex(undefined)}
                >
                  {value}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerDropdown: {
    width: 160,
    position: 'relative',
  },

  selectedItem: {
    zIndex: 1,
  },
  selectedItemPressed: {
    opacity: 0.7,
  },
  selectedItemDisabled: {
    cursor: 'default',
  },

  selectedItemContainer: {
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedItemValue: {
    marginLeft: 28,
    fontFamily: FONT.NOTO_SERIF.BOLD,
    fontSize: 22,
    lineHeight: 22,
  },
  selectedItemValueDisabled: {
    marginLeft: 'auto',
  },

  arrowIcon: {
    marginLeft: 8,
  },

  list: {
    width: '100%',
    position: 'absolute',
    paddingBottom: 16,
    backgroundColor: COLOR.WHITE,
    alignItems: 'center',
    borderRadius: 12,
    shadowColor: COLOR.BLACK,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 12,
    shadowOpacity: 0.1,
  },
  listItem: {
    width: '100%',
    marginVertical: 8,
    paddingVertical: 6,
    borderStyle: 'dashed',
    borderBottomWidth: 1,
    borderBottomColor: COLOR.TRANSPARENT,
  },
  listItemHighlighted: {
    borderBottomColor: COLOR.BLACK,
  },
  listItemPressed: {
    opacity: 0.7,
  },
  listItemText: {
    width: '100%',
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 20,
  },
});
