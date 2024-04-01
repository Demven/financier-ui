import { useState } from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import PropTypes from 'prop-types';
import { COLOR } from '../styles/colors';

CloseButton.propTypes = {
  style: PropTypes.object,
  iconStyle: PropTypes.object,
  iconStyleHover: PropTypes.object,
  size: PropTypes.number.isRequired,
  onPress: PropTypes.func,
};

export default function CloseButton (props) {
  const {
    style,
    iconStyle,
    iconStyleHover,
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
        <View
          style={[
            styles.iconLeft,
            iconStyle,
            hover && styles.iconLeftHover,
            hover && iconStyleHover,
          ]}
        />

        <View
          style={[
            styles.iconRight,
            iconStyle,
            hover && styles.iconRightHover,
            hover && iconStyleHover,
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  closeButton: { zIndex: 10000000 },
  closeButtonPressed: {
    opacity: 0.7,
  },
  iconContainer: {
    position: 'relative',
    zIndex: 10000000,
  },

  iconLeft: {
    width: 2,
    height: '100%',
    backgroundColor: COLOR.LIGHT_GRAY,
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    left: '50%',
    transition: 'transform 0.3s, width 0.3s, backgroundColor 0.3s',
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
    transition: 'transform 0.3s, width 0.3s, color 0.3s',
  },
  iconRightHover: {
    width: 3,
    transform: [{ scale: 1.1 }, { rotate: '-45deg' }],
    backgroundColor: COLOR.DARK_GRAY,
  },
});
