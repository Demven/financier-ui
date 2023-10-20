import { useState } from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import PropTypes from 'prop-types';
import { COLOR } from "../styles/colors";

CloseButton.propTypes = {
  style: PropTypes.object,
  size: PropTypes.number.isRequired,
  onPress: PropTypes.func,
};

export default function CloseButton (props) {
  const {
    style,
    size,
    onPress,
  } = props;

  const [hover, setHover] = useState(false);

  return (
    <Pressable
      style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed, style]}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { width: size, height: size }]}>
        <View style={[styles.iconLeft, hover && styles.iconLeftHover]} />
        <View style={[styles.iconRight, hover && styles.iconRightHover]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  closeButton: {},
  closeButtonPressed: {
    opacity: 0.7,
  },
  iconContainer: {
    position: 'relative',
  },

  iconLeft: {
    width: 2,
    height: '100%',
    color: COLOR.LIGHT_GRAY,
    backgroundColor: 'currentColor',
    transform: 'rotate(45deg)',
    position: 'absolute',
    left: '50%',
    transition: 'transform 0.3s, width 0.3s, color 0.3s',
  },
  iconLeftHover: {
    width: 3,
    transform: 'scale(1.1) rotate(45deg)',
    color: COLOR.DARK_GRAY,
  },

  iconRight: {
    width: 2,
    height: '100%',
    color: COLOR.LIGHT_GRAY,
    backgroundColor: 'currentColor',
    transform: 'rotate(-45deg)',
    position: 'absolute',
    left: '50%',
    transition: 'transform 0.3s, width 0.3s, color 0.3s',
  },
  iconRightHover: {
    width: 3,
    transform: 'scale(1.1) rotate(-45deg)',
    color: COLOR.DARK_GRAY,
  },
});
