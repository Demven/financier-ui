import { useState } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Icon, { ICON_COLLECTION } from './Icon';
import PropTypes from 'prop-types';
import { COLOR } from '../styles/colors';

DeleteIconButton.propTypes = {
  style: PropTypes.object,
  onPress: PropTypes.func.isRequired,
};

export default function DeleteIconButton (props) {
  const {
    style,
    onPress,
  } = props;

  const [hover, setHover] = useState(false);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.deleteIconButton,
        pressed && styles.deleteIconButtonPressed,
        hover && styles.deleteIconButtonHover,
        style,
      ]}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onPress={onPress}
    >
      <Icon
        collection={ICON_COLLECTION.IONICONS}
        name='trash-outline'
        size={24}
        color={COLOR.RED}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  deleteIconButton: { zIndex: 10000000 },
  deleteIconButtonPressed: {
    opacity: 0.7,
  },
  deleteIconButtonHover: {
    opacity: 0.85,
  },

  iconLeft: {
    width: 2,
    height: '100%',
    backgroundColor: COLOR.LIGHT_GRAY,
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    left: '50%',
  },
  iconLeftHover: {
    width: 3,
    transform: [{ scale: 1.1 }, { rotate: '45deg' }],
    backgroundColor: COLOR.DARK_GRAY,
  },

  iconRight: {
    width: 2,
    height: '100%',
    backgroundColor: COLOR.LIGHT_GRAY,
    transform: [{ rotate: '-45deg' }],
    position: 'absolute',
    left: '50%',
  },
  iconRightHover: {
    width: 3,
    transform: [{ scale: 1.1 }, { rotate: '-45deg' }],
    backgroundColor: COLOR.DARK_GRAY,
  },
});
