import { StyleSheet, Pressable } from 'react-native';
import Icon, { ICON_COLLECTION } from './Icon';

export default function IconButton ({ iconName, size, color, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
      onPress={onPress}
    >
      <Icon
        style={styles.icon}
        name={iconName}
        collection={ICON_COLLECTION.IONICONS}
        size={size}
        color={color}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {},
  iconButtonPressed: {
    opacity: 0.7,
  },
  icon: {
    borderRadius: 24,
    padding: 6,
    marginVertical: 2,
    marginHorizontal: 8,
  },
});
