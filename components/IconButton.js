import { StyleSheet, Pressable } from 'react-native';
import PropTypes from 'prop-types';
import Icon, { ICON_COLLECTION } from './Icon';

IconButton.propTypes = {
  style: PropTypes.object,
  iconName: PropTypes.string.isRequired,
  iconCollection: PropTypes.oneOf([
    ICON_COLLECTION.IONICONS,
    ICON_COLLECTION.FONT_AWESOME_5,
    ICON_COLLECTION.MATERIAL,
    ICON_COLLECTION.MATERIAL_COMMUNITY,
  ]).isRequired,
  size: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default function IconButton (props) {
  const {
    style,
    iconName,
    iconCollection,
    size,
    color,
    onPress,
  } = props;

  return (
    <Pressable
      style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed, style]}
      onPress={onPress}
    >
      <Icon
        style={styles.icon}
        name={iconName}
        collection={iconCollection}
        size={size}
        color={color}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonPressed: {
    opacity: 0.7,
  },
  icon: {
    borderRadius: 24,
    padding: 0,
    margin: 0,
  },
});
