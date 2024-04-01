import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import CloseButton from './CloseButton';
import Button, { BUTTON_LOOK } from './Button';
import { FONT } from '../styles/fonts';
import { COLOR } from '../styles/colors';
import { MEDIA } from '../styles/media';

Modal.propTypes = {
  style: PropTypes.object,
  contentStyle: PropTypes.object,
  title: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
  maxWidth: PropTypes.number,
  onSave: PropTypes.func,
  onCloseRequest: PropTypes.func,
  disableSave: PropTypes.bool,
};

export default function Modal (props) {
  const {
    style,
    contentStyle,
    title,
    children,
    maxWidth = 680,
    onSave = () => {},
    onCloseRequest = undefined,
    disableSave,
  } = props;

  const navigation = useNavigation();

  const windowWidth = useSelector(state => state.ui.windowWidth);

  function onPressClose () {
    if (typeof onCloseRequest === 'function') {
      onCloseRequest();
    } else {
      navigation.goBack();
    }
  }

  return (
    <View style={[styles.modal, style]}>
      <Pressable
        style={[styles.overlay, StyleSheet.absoluteFill]}
        onPress={onPressClose}
      />

      <View
        style={[styles.container, {
          width: Platform.OS === 'ios'
            ? '100%'
            : windowWidth - 64,
          maxWidth: Platform.OS === 'ios'
            ? '100%'
            : maxWidth,
        }]}
      >
        {Platform.OS === 'web' && (
          <View style={styles.header}>
            <Text
              style={[styles.title, {
                fontSize: windowWidth < MEDIA.WIDE_MOBILE ? 26 : 30,
                lineHeight: windowWidth < MEDIA.WIDE_MOBILE ? 34 : 38,
              }]}
            >
              {title}
            </Text>
          </View>
        )}

        {Platform.OS === 'web' && (
          <CloseButton
            style={styles.closeButton}
            size={46}
            onPress={onPressClose}
          />
        )}

        <View style={[styles.content, contentStyle]}>
          {children}
        </View>

        <View
          style={[styles.footer, { justifyContent: windowWidth < MEDIA.TABLET ? 'center' : 'flex-end' }]}
        >
          <Button
            style={[styles.cancelButton, {
              width: windowWidth < MEDIA.MOBILE ? 120 : 150,
            }]}
            look={BUTTON_LOOK.SECONDARY}
            text='Cancel'
            onPress={onPressClose}
          />

          <Button
            style={[styles.saveButton, {
              width: windowWidth < MEDIA.MOBILE ? 120 : 150,
            }]}
            look={BUTTON_LOOK.PRIMARY}
            text='Save'
            disabled={disableSave}
            onPress={() => {
              onSave();
              onPressClose();
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flexGrow: Platform.select({ ios: 1 }),
    position: 'relative',
    padding: Platform.select({ ios: 32, web: 24 }),
    borderRadius: Platform.select({ web: 8 }),
    backgroundColor: COLOR.WHITE,
    shadowColor: COLOR.BLACK,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: Platform.select({ web: 8 }),
    shadowOpacity: 0.1,
  },

  header: {
    marginRight: Platform.select({ web: 52 }),
    paddingBottom: Platform.select({ web: 24 }),
    flexDirection: 'row',
    borderBottomWidth: Platform.select({ web: 1 }),
    borderBottomColor: COLOR.LIGHTER_GRAY,
  },
  title: {
    height: 34,
    paddingLeft: 20,
    fontFamily: FONT.NOTO_SERIF.BOLD,
    color: COLOR.DARK_GRAY,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },

  content: {
    padding: Platform.select({ ios: 0, web: 32 }),
    paddingRight: Platform.select({ ios: 0, web: 52 }),
    zIndex: 1,
  },

  footer: {
    marginTop: Platform.select({ ios: 'auto' }),
    marginBottom: Platform.select({ ios: 0 }),
    paddingTop: Platform.select({ ios: 24, web: 24 }),
    flexDirection: 'row',
    borderTopWidth: Platform.select({ web: 1 }),
    borderTopColor: COLOR.LIGHTER_GRAY,
    zIndex: 10,
    backgroundColor: COLOR.WHITE,
  },

  cancelButton: {
    marginRight: 24,
  },
  saveButton: {},
});
