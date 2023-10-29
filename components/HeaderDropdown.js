import { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import PropTypes from 'prop-types';
import Icon, { ICON_COLLECTION } from './Icon';
import { COLOR } from '../styles/colors';
import { FONT } from '../styles/fonts';

HeaderDropdown.propTypes = {
  style: PropTypes.object,
  selectedValue: PropTypes.any.isRequired,
  values: PropTypes.arrayOf(PropTypes.any).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default function HeaderDropdown (props) {
  const {
    style,
    selectedValue,
    values,
    onSelect,
  } = props;

  const [opened, setOpened] = useState(false);
  const [highlightedItemIndex, setHighlightedItemIndex] = useState(undefined);

  function toggleDropDown () {
    setOpened(!opened);
  }

  return (
    <View
      style={[styles.headerDropdown, style]}
      onMouseEnter={() => setOpened(true)}
      onMouseLeave={() => setOpened(false)}
    >
      <Pressable
        style={({ pressed }) => [styles.selectedItem, pressed && styles.selectedItemPressed]}
        onPress={toggleDropDown}
      >
        <View style={styles.selectedItemContainer}>
          <Text style={styles.selectedItemValue}>{selectedValue}</Text>

          <Icon
            style={styles.arrowIcon}
            name={opened ? 'caret-up' : 'caret-down'}
            collection={ICON_COLLECTION.IONICONS}
            size={20}
            color={COLOR.BLACK}
          />
        </View>
      </Pressable>

      {opened && (
        <View style={styles.list}>
          {values
            .filter(value => value !== selectedValue)
            .map((value, index) => (
              <Pressable
                key={index}
                style={({ pressed }) => [pressed && styles.listItemPressed]}
                onPress={() => onSelect(value)}
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
            ))
          }
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

  arrowIcon: {
    marginLeft: 8,
    marginTop: 5,
  },

  list: {
    width: '100%',
    position: 'absolute',
    top: 0,
    paddingTop: 60,
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
