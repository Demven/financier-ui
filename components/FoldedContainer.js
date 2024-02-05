import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Text,
} from 'react-native';
import { useSelector } from 'react-redux';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import PropTypes from 'prop-types';
import Icon, { ICON_COLLECTION } from './Icon';
import { FONT } from '../styles/fonts';
import { MEDIA } from '../styles/media';
import { COLOR } from '../styles/colors';

FoldedContainer.propTypes = {
  style: PropTypes.any,
  titleStyle: PropTypes.any,
  title: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
  disable: PropTypes.bool,
};

export default function FoldedContainer (props) {
  const {
    style,
    titleStyle,
    title,
    children,
    disable,
  } = props;

  const [folded, setFolded] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [childrenHeight, setChildrenHeight] = useState(0);

  const windowWidth = useSelector(state => state.ui.windowWidth);

  const height = useSharedValue(0);

  const active = !disable;

  useEffect(() => {
    if (!height.value) {
      animateOpen();
    } else if (!!height.value) {
      animateClose();
    }
  }, [folded]);

  useEffect(() => {
    if (!folded && !initialized && childrenHeight) {
      setInitialized(true);
      animateOpen();
    }
  }, [childrenHeight]);

  function animateOpen () {
    height.value = withTiming(childrenHeight, {
      duration: 300,
      easing: Easing.inOut(Easing.cubic),
      reduceMotion: 'system',
    });
  }

  function animateClose () {
    height.value = withTiming(0, {
      duration: 300,
      easing: Easing.inOut(Easing.cubic),
      reduceMotion: 'system',
    });
  }

  function onChildrenLayout (event) {
    const { height } = event.nativeEvent.layout;

    setChildrenHeight(height);
  }

  const animatedHeightStyles = useAnimatedStyle(() => ({
    height: height.value,
  }));

  const titleFontSize = windowWidth < MEDIA.MEDIUM_DESKTOP
    ? windowWidth < MEDIA.DESKTOP
      ? windowWidth < MEDIA.WIDE_MOBILE
        ? 18 // mobile
        : 21 // tablet
      : 24 // desktop
    : 26; // large desktop

  return (
    <View style={[styles.foldedContainer, style]}>
      <Pressable
        style={active
          ? ({ pressed }) => [styles.button, pressed && styles.buttonPressed]
          : styles.buttonDisabled}
        onPress={active ? () => setFolded(!folded) : undefined}
      >
        <View style={styles.titleContainer}>
          <Text
            style={[styles.title, {
              fontSize: titleFontSize,
              lineHeight: titleFontSize,
            }, titleStyle]}
          >
            {title}
          </Text>

          {active && (
            <Icon
              style={styles.arrowIcon}
              collection={ICON_COLLECTION.IONICONS}
              name={folded ? 'caret-up' : 'caret-down'}
              size={titleFontSize}
            />
          )}
        </View>
      </Pressable>

      <Animated.View style={[styles.animatedContainer, active && animatedHeightStyles]}>
        <View onLayout={onChildrenLayout}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  foldedContainer: {},

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  button: {
    padding: 2,
    alignSelf: 'flex-start',
    outlineColor: COLOR.ORANGE,
  },
  buttonPressed: {
    transition: 'opacity 0.2s',
    opacity: 0.6,
  },
  buttonDisabled: {
    cursor: 'default',
    outlineStyle: 'none',
  },

  title: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
    opacity: 1,
  },

  arrowIcon: {
    marginLeft: 8,
    transform: [{ translateY: 2 }],
  },

  animatedContainer: {
    height: 'auto',
    overflow: 'hidden',
  },
});
