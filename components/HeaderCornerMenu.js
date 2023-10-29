import { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import Icon, { ICON_COLLECTION } from './Icon';
import { COLOR } from '../styles/colors';
import { FONT } from '../styles/fonts';

const MENU_ITEMS = [
  {
    title: 'Income',
    navigateTo: 'Income',
    color: COLOR.ORANGE,
    iconName: 'money-check-alt',
    iconCollection: ICON_COLLECTION.FONT_AWESOME_5,
    iconSize: 16,
    iconOffsetTop: 4,
    iconOffsetRight: 10,
  },
  {
    title: 'Saving',
    navigateTo: 'Saving',
    color: COLOR.GREEN,
    iconName: 'bank',
    iconCollection: ICON_COLLECTION.MATERIAL_COMMUNITY,
    iconSize: 20,
    iconOffsetTop: 2,
    iconOffsetRight: 8,
  },
  {
    title: 'Expense',
    navigateTo: 'Expense',
    color: COLOR.BLACK,
    iconName: 'money-off',
    iconCollection: ICON_COLLECTION.MATERIAL,
    iconSize: 24,
    iconOffsetTop: 0,
    iconOffsetRight: 6,
  },
];

HeaderCornerMenu.propTypes = {
  style: PropTypes.object,
};

export default function HeaderCornerMenu ({ style }) {
  const [opened, setOpened] = useState(false);
  const [highlightedItemIndex, setHighlightedItemIndex] = useState(undefined);

  const navigation = useNavigation();

  function toggleDropDown () {
    setOpened(!opened);
  }

  function onNavigate (navigateTo) {
    return () => {
      setOpened(false);
      navigation.navigate(navigateTo);
    };
  }

  return (
    <View
      style={[styles.headerCornerMenu, style]}
      onMouseEnter={() => setOpened(true)}
      onMouseLeave={() => setOpened(false)}
    >
      <Pressable
        style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
        onPress={toggleDropDown}
      >
        <View style={styles.iconContainer}>
          {opened && (
            <Text style={styles.addText}>Add New</Text>
          )}

          <Icon
            style={[styles.icon, opened && styles.iconRotate45Degrees]}
            name='add-circle-outline'
            collection={ICON_COLLECTION.IONICONS}
            size={32}
            color={opened ? COLOR.GRAY : COLOR.BLACK}
          />
        </View>
      </Pressable>

      {opened && (
        <View style={styles.list}>
          {MENU_ITEMS
            .map((menuItem, index) => (
              <Pressable
                key={index}
                style={({ pressed }) => [styles.listItemPressable, pressed && styles.listItemPressed]}
                onPress={onNavigate(menuItem.navigateTo)}
              >
                <View
                  style={[
                    styles.listItem,
                    highlightedItemIndex === index && { borderBottomColor: menuItem.color }
                  ]}
                >
                  <Icon
                    style={{ marginTop: menuItem.iconOffsetTop, marginRight: menuItem.iconOffsetRight }}
                    name={menuItem.iconName}
                    collection={menuItem.iconCollection}
                    size={menuItem.iconSize}
                    color={menuItem.color}
                  />

                  <Text
                    style={[styles.listItemText, { color: menuItem.color }]}
                    onMouseEnter={() => setHighlightedItemIndex(index)}
                    onMouseLeave={() => setHighlightedItemIndex(undefined)}
                  >
                    {menuItem.title}
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
  headerCornerMenu: {
    width: 148,
    position: 'relative',
  },

  iconButton: {
    zIndex: 1,
  },
  iconButtonPressed: {
    opacity: 0.7,
  },

  iconContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
    transition: Platform.select({ web: 'transform 0.2s' }),
  },
  iconRotate45Degrees: {
    transform: 'translateY(1px) rotate(45deg)',
  },

  addText: {
    marginTop: 2,
    marginRight: 12,
    fontFamily: FONT.NOTO_SERIF.BOLD,
    fontSize: 15,
    lineHeight: 15,
    color: COLOR.GRAY,
  },

  list: {
    width: '100%',
    position: 'absolute',
    top: -6,
    paddingTop: 60,
    paddingBottom: Platform.OS === 'ios' ? 0 : 20,
    paddingRight: 16,
    backgroundColor: COLOR.WHITE,
    alignItems: 'flex-end',
    borderRadius: 12,
    shadowColor: COLOR.BLACK,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 12,
    shadowOpacity: 0.1,
  },

  listItem: {
    width: '100%',
    flexDirection: 'row',
    marginVertical: 12,
    paddingVertical: 6,
    borderStyle: Platform.select({ web: 'dashed' }),
    borderBottomWidth: 1,
    borderBottomColor: COLOR.TRANSPARENT,
  },
  listItemPressed: {
    opacity: 0.7,
  },
  listItemText: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
    fontSize: 20,
    lineHeight: 23,
  },
});
