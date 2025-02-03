import { useEffect, useState } from 'react';
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
    headerShown: false,
    contentStyle: { backgroundColor: Platform.select({ web: 'transparent' }) },
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
  const windowHeight = useSelector(state => state.ui.windowHeight);

  const [containerHeight, setContainerHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);

  const isIphone = Platform.OS === 'ios' && windowWidth <= MEDIA.WIDE_MOBILE;

  useEffect(() => {
    if (Platform.OS === 'web') {
      preventPageScroll();
    }
  }, []);

  useEffect(() => {
    if (containerHeight && headerHeight && footerHeight) {
      setContentHeight((isIphone ? windowHeight - 160 : containerHeight) - headerHeight - footerHeight);
    }
  }, [containerHeight, headerHeight, footerHeight]);

  function preventPageScroll () {
    document.body.style.overflowY = 'hidden';
  }

  function enablePageScroll () {
    document.body.style.overflowY = 'auto';
  }

  function onPressClose () {
    if (Platform.OS === 'web') {
      enablePageScroll();
    }

    if (typeof onCloseRequest === 'function') {
      onCloseRequest();
    } else {
      router.back();
    }
  }

  function onContainerLayout (event) {
    setContainerHeight(event.nativeEvent.layout.height);
  }

  function onHeaderLayout (event) {
    setHeaderHeight(event.nativeEvent.layout.height);
  }

  function onFooterLayout (event) {
    setFooterHeight(event.nativeEvent.layout.height);
  }

  return (
    <View style={[styles.modal, style]}>
      {Platform.OS === 'web' && (
        <Pressable
          style={[styles.overlay, StyleSheet.absoluteFill]}
          onPress={onPressClose}
        />
      )}

      <View
        style={[styles.container, {
          width: Platform.OS === 'ios'
            ? '100%'
            : windowWidth - 32,
          maxWidth: Platform.OS === 'ios'
            ? '100%'
            : maxWidth,
        }]}
        onLayout={onContainerLayout}
      >
        <View
          style={[styles.header, {
            maxWidth: Platform.select({ ios: maxWidth }),
          }]}
          onLayout={onHeaderLayout}
        >
          <View style={styles.headerTitle}>
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

          <CloseButton
            style={styles.closeButton}
            size={46}
            onPress={onPressClose}
          />
        </View>

        <ScrollView
          style={[styles.content, {
            paddingHorizontal: Platform.select({ ios: 0, web: windowWidth < MEDIA.WIDE_MOBILE ? 0 : 32 }),
            paddingRight: Platform.select({ ios: 0, web: windowWidth >= MEDIA.WIDE_MOBILE ? 48 : 0 }),
            paddingVertical: 32,
            height: contentHeight,
            maxHeight: Platform.select({ ios: contentHeight }),
          }, contentStyle]}
        >
          {children}
        </ScrollView>

        <View
          style={[styles.footer, {
            justifyContent: windowWidth < MEDIA.TABLET ? 'center' : 'flex-end',
          }]}
          onLayout={onFooterLayout}
        >
          {(typeof onDelete === 'function') && (
            <>
              {windowWidth <= MEDIA.WIDE_MOBILE && (
                <DeleteIconButton
                  style={styles.deleteIconButton}
                  onPress={onDelete}
                />
              )}

              {windowWidth > MEDIA.WIDE_MOBILE && (
                <Button
                  style={styles.deleteButton}
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
              width: windowWidth < MEDIA.WIDE_MOBILE ? 120 : 150,
            }]}
            paddingHorizontal={isIphone ? 8 : 0}
            look={BUTTON_LOOK.SECONDARY}
            text='Cancel'
            onPress={onPressClose}
          />

          <Button
            style={[styles.saveButton, {
              width: windowWidth < MEDIA.WIDE_MOBILE ? 120 : 150,
            }]}
            paddingHorizontal={isIphone ? 8 : 0}
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

  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexGrow: 1,
  },
  container: {
    width: '100%',
    height: '100%',
    maxHeight: Platform.select({ web: 680 }),
    position: 'relative',
    padding: Platform.select({ ios: 32, web: 24 }),
    alignItems: Platform.select({ ios: 'flex-start' }),
    boxShadow: Platform.select({ web: 'rgba(0, 0, 0, 0.1) 0 0 12px 12px' }),
    backgroundColor: COLOR.WHITE,
    borderRadius: 8,
  },

  header: {
    width: '100%',
    flexDirection: 'row',
    position: 'relative',
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.LIGHTER_GRAY,
  },
  headerTitle: {
    marginRight: 52,
  },
  title: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
    color: COLOR.DARK_GRAY,
  },

  closeButton: {
    position: 'absolute',
    top: -8,
    right: 0,
  },

  content: {
    width: '100%',
    flexGrow: 1,
    paddingRight: Platform.select({ ios: 0, web: 52 }),
    flexShrink: 1,
    zIndex: 100,
  },

  footer: {
    width: '100%',
    paddingTop: 24,
    marginBottom: Platform.select({ ios: 0 }),
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: Platform.select({ web: 1 }),
    borderTopColor: COLOR.LIGHTER_GRAY,
    zIndex: 1,
    position: 'relative',
  },

  deleteIconButton: {
    marginRight: 'auto',
  },
  deleteButton: {
    width: 150,
    marginRight: 'auto',
  },

  cancelButton: {
    marginRight: 24,
  },

  saveButton: {},
});
