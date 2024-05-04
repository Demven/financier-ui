import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import CloseButton from './CloseButton';
import Icon, { ICON_COLLECTION } from './Icon';
import { hideToastAction } from '../redux/reducers/ui';
import { FONT } from '../styles/fonts';
import { COLOR } from '../styles/colors';

export const TOAST_TYPE = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
};

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

export default function Toast (props) {
  const {
    style,
    type,
    message,
    visible,
    timeout = TOAST_TIMEOUT,
  } = props;

  const dispatch = useDispatch();

  useEffect(() => {
    if (message && visible) {
      if (timeout) {
        setTimeout(onClose, timeout);
      }
    }
  }, [message, visible]);

  function onClose () {
    dispatch(hideToastAction());
  }

  const color = type === TOAST_TYPE.INFO
    ? COLOR.GREEN
    : type === TOAST_TYPE.WARNING
      ? COLOR.ORANGE
      : COLOR.RED;

  return (
    <View style={[styles.toast, visible && styles.toastVisible]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'fixed',
    bottom: 64,
    left: 0,
    transition: Platform.select({ web: 'transform 0.15s, opacity 0.2s' }),
    transform: [{ translateY: 140 }],
    opacity: 0,
  },
  toastVisible: {
    transform: [{ translateY: 32 }],
    opacity: 1,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Platform.select({ ios: 32, web: 24 }),
    backgroundColor: COLOR.WHITE,
    borderRadius: Platform.select({ web: 8 }),
    shadowColor: COLOR.BLACK,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: Platform.select({ web: 8 }),
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
