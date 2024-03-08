import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  Platform,
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
  title: PropTypes.any.isRequired,
  children: PropTypes.any.isRequired,
  arrowIconSize: PropTypes.number,
  disable: PropTypes.bool,
  initiallyFolded: PropTypes.bool,
  onFold: PropTypes.func,
  onUnfold: PropTypes.func,
};

export default function FoldedContainer (props) {
  const {
    style,
    titleStyle,
    title,
    children,
    arrowIconSize,
    disable,
    initiallyFolded = false,
    onFold = () => {},
    onUnfold = () => {},
  } = props;

  const [folded, setFolded] = useState(initiallyFolded);
  const [initialized, setInitialized] = useState(false);
  const [childrenHeight, setChildrenHeight] = useState(0);

  const windowWidth = useSelector(state => state.ui.windowWidth);

  const height = useSharedValue(0);

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

  function onPress () {
    const isFolded = !folded;

    setFolded(isFolded);

    if (isFolded) {
      onFold();
    } else {
      onUnfold();
    }
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

  const active = !disable;

  return (
    <View style={[styles.foldedContainer, style]}>
      <Pressable
        style={active
          ? ({ pressed }) => [styles.button, pressed && styles.buttonPressed]
          : styles.buttonDisabled}
        onPress={active ? onPress : undefined}
      >
        <View style={styles.titleContainer}>
          {typeof title === 'string' && (
            <Text
              style={[styles.title, {
                fontSize: titleFontSize,
                lineHeight: titleFontSize,
              }, titleStyle]}
            >
              {title}
            </Text>
          )}
          {typeof title !== 'string' && title}

          {active && (
            <Icon
              style={styles.arrowIcon}
              collection={ICON_COLLECTION.IONICONS}
              name={folded ? 'caret-down' : 'caret-up'}
              size={arrowIconSize || titleFontSize}
            />
          )}
        </View>
      </Pressable>

      <Animated.View
        style={[
          styles.animatedContainer,
          active && animatedHeightStyles,
          !active && { height: 'auto' },
        ]}
      >
        <View
          style={[styles.content, active && styles.contentActive]}
          onLayout={onChildrenLayout}
        >
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
    marginTop: Platform.OS === 'ios' ? -6 : 0,
    marginLeft: 8,
    transform: [{ translateY: 2 }],
  },

  animatedContainer: {
    overflow: 'hidden',
  },

  content: {
    width: '100%',
    flexGrow: 1,
    alignItems: 'flex-start',
  },
  contentActive: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
