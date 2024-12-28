import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import PropTypes from 'prop-types';
import CloseButton from './CloseButton';
import Icon, { ICON_COLLECTION } from './Icon';
import { hideToastAction, TOAST_TYPE } from '../redux/reducers/ui';
import { FONT } from '../styles/fonts';
import { COLOR } from '../styles/colors';

const TOAST_ICON = {
  [TOAST_TYPE.INFO]: {
    name: 'information-circle',
    collection: ICON_COLLECTION.IONICONS,
  },
  [TOAST_TYPE.WARNING]: {
    name: 'warning',
    collection: ICON_COLLECTION.IONICONS,
  },
  [TOAST_TYPE.ERROR]: {
    name: 'error',
    collection: ICON_COLLECTION.MATERIAL,
  },
};

Toast.propTypes = {
  style: PropTypes.object,
  type: PropTypes.oneOf([TOAST_TYPE.INFO, TOAST_TYPE.WARNING, TOAST_TYPE.ERROR]).isRequired,
  message: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  timeout: PropTypes.oneOf([Number, null]),
};

const TOAST_TIMEOUT = 5000;

const DEFAULT_OPACITY = 0;
const DEFAULT_TRANSLATE_Y = 140;

export default function Toast (props) {
  const {
    style,
    type,
    message,
    visible,
    timeout = TOAST_TIMEOUT,
  } = props;

  const dispatch = useDispatch();

  const opacity = useSharedValue(DEFAULT_OPACITY);
  const translateY = useSharedValue(DEFAULT_TRANSLATE_Y);

  const [timeoutId, setTimeoutId] = useState();

  useEffect(() => {
    if (message && visible) {
      show();

      if (timeout) {
        setTimeoutId(setTimeout(onClose, timeout));
      }
    } else {
      onClose();
    }
  }, [message, visible]);

  function show () {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(undefined);
    }

    opacity.value = DEFAULT_OPACITY;
    translateY.value = DEFAULT_TRANSLATE_Y;

    setTimeout(() => {
      opacity.value = withTiming(1, {
        duration: 200,
        easing: Easing.cubic,
        reduceMotion: 'system',
      });
      translateY.value = withTiming(32, {
        duration: 300,
        easing: Easing.cubic,
        reduceMotion: 'system',
      });
    }, 0);
  }

  function onClose () {
    opacity.value = withTiming(DEFAULT_OPACITY, {
      duration: 200,
      easing: Easing.cubic,
      reduceMotion: 'system',
    });
    translateY.value = withTiming(DEFAULT_TRANSLATE_Y, {
      duration: 300,
      easing: Easing.cubic,
      reduceMotion: 'system',
    });

    dispatch(hideToastAction());
  }

  const animatedTranslateYStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  const animatedOpacityStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const color = type === TOAST_TYPE.INFO
    ? COLOR.GREEN
    : type === TOAST_TYPE.WARNING
      ? COLOR.ORANGE
      : COLOR.RED;

  return (
    <Animated.View
      style={[
        styles.toast,
        animatedTranslateYStyle,
        animatedOpacityStyle,
      ]}
    >
      <View style={[
        styles.content,
        style,
      ]}>
        <Icon
          style={styles.icon}
          {...TOAST_ICON[type]}
          size={24}
          color={color}
        />

        <View style={styles.messageContainer}>
          {typeof message === 'string'
            ? <Text style={[styles.message, { color }]}>
                {message}
              </Text>
            : message
          }
        </View>

        <CloseButton
          style={styles.closeButton}
          size={16}
          onPress={onClose}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 64,
    left: 0,
    opacity: 0,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLOR.WHITE,
    borderRadius: 8,
    shadowColor: COLOR.BLACK,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    zIndex: 1000,
  },
  contentInfo: {
    backgroundColor: COLOR.GREEN,
  },
  contentWarning: {
    backgroundColor: COLOR.LIGHT_ORANGE,
  },
  contentError: {
    backgroundColor: COLOR.RED,
  },

  icon: {},

  messageContainer: {
    marginLeft: 16,
  },
  message: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
    fontSize: 14,
    lineHeight: 16,
    color: COLOR.DARK_GRAY,
  },

  closeButton: {
    marginLeft: 20,
  },
});
