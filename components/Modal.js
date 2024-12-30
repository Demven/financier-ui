import { useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useNavigation, useRouter } from 'expo-router';
import CloseButton from './CloseButton';
import DeleteIconButton from './DeleteIconButton';
import Button, { BUTTON_LOOK } from './Button';
import { FONT } from '../styles/fonts';
import { COLOR } from '../styles/colors';
import { MEDIA } from '../styles/media';

Modal.propTypes = {
  style: PropTypes.any,
  contentStyle: PropTypes.any,
  title: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
  maxWidth: PropTypes.number,
  onSave: PropTypes.func,
  onConfirm: PropTypes.func,
  onDelete: PropTypes.func,
  onCloseRequest: PropTypes.func,
  disableSave: PropTypes.bool,
};

export function useModal (onDeleteItem) {
  const navigation = useNavigation();

  const title = useSelector(state => state.ui.title);

  const navigationOptions = {
    presentation: Platform.OS === 'web' ? 'transparentModal' : 'modal',
    headerShown: Platform.OS !== 'web',
    contentStyle: { backgroundColor: Platform.select({ web: 'transparent' }) },
    headerTitleStyle: styles.modalTitle,
  };

  if (title) {
    navigationOptions.title = title;
  }

  if (typeof onDeleteItem === 'function') {
    navigationOptions.headerRight = () => (
      <DeleteIconButton onPress={onDeleteItem} />
    );
  }

  useEffect(() => {
    navigation.setOptions(navigationOptions);
  }, [navigation, title]);
}

export default function Modal (props) {
  const {
    style,
    contentStyle,
    title,
    children,
    maxWidth = 680,
    onSave,
    onConfirm,
    onDelete,
    onCloseRequest = undefined,
    disableSave,
  } = props;

  const router = useRouter();

  const windowWidth = useSelector(state => state.ui.windowWidth);

  function onPressClose () {
    if (typeof onCloseRequest === 'function') {
      onCloseRequest();
    } else {
      router.back();
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
            : windowWidth - 32,
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
                paddingLeft: windowWidth < MEDIA.WIDE_MOBILE ? 8 : 20,
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

        <ScrollView
          style={[styles.content, {
            paddingHorizontal: Platform.select({ ios: 0, web: windowWidth < MEDIA.WIDE_MOBILE ? 0 : 32 }),
            paddingRight: Platform.select({ ios: 0, web: windowWidth >= MEDIA.WIDE_MOBILE ? 48 : 0 }),
            paddingVertical: Platform.select({ ios: 0, web: 32 }),
          }, contentStyle]}
        >
          {children}
        </ScrollView>

        <View style={[styles.footer, {
          justifyContent: windowWidth < MEDIA.TABLET ? 'center' : 'flex-end',
        }]}>
          {(typeof onDelete === 'function') && (
            <>
              {windowWidth <= MEDIA.WIDE_MOBILE && Platform.OS === 'web' && (
                <DeleteIconButton
                  style={styles.deleteIconButton}
                  onPress={onDelete}
                />
              )}

              {windowWidth > MEDIA.WIDE_MOBILE && Platform.OS === 'web' &&  (
                <Button
                  style={[styles.deleteButton, {
                    width: windowWidth < MEDIA.MOBILE ? 120 : 150,
                  }]}
                  look={BUTTON_LOOK.TERTIARY}
                  text='Delete'
                  destructive
                  onPress={onDelete}
                />
              )}
            </>
          )}

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
            text={onConfirm ? 'Confirm' : 'Save'}
            disabled={disableSave}
            onPress={() => {
              if (typeof onConfirm === 'function') {
                onConfirm();
              } else if (typeof onSave === 'function') {
                onSave();
              }

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

  modalTitle: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
    fontSize: 18,
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
    alignItems: Platform.select({ ios: 'flex-end' }),
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
    fontFamily: FONT.NOTO_SERIF.BOLD,
    color: COLOR.DARK_GRAY,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },

  content: {
    paddingRight: Platform.select({ ios: 0, web: 52 }),
    zIndex: 1,
    flexGrow: Platform.select({ ios: 0 }),
  },

  footer: {
    height: Platform.select({ ios: 200 }),
    flexGrow: Platform.select({ ios: 0 }),
    flexShrink: Platform.select({ ios: 0 }),
    marginTop: Platform.select({ ios: 'auto' }),
    marginBottom: Platform.select({ ios: 0 }),
    paddingTop: 24,
    flexDirection: 'row',
    borderTopWidth: Platform.select({ web: 1 }),
    borderTopColor: COLOR.LIGHTER_GRAY,
    zIndex: 10,
    backgroundColor: COLOR.WHITE,
    alignItems: 'center',
  },

  deleteIconButton: {
    marginRight: 'auto',
  },
  deleteButton: {
    marginRight: 'auto',
  },

  cancelButton: {
    marginRight: 24,
  },

  saveButton: {},
});
