import {
  StyleSheet,
  View,
  Modal,
  Text, Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import Button, { BUTTON_LOOK } from './Button';
import { COLOR } from '../styles/colors';
import { FONT } from '../styles/fonts';

ConfirmationDialog.propTypes = {
  style: PropTypes.object,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  onDelete: PropTypes.func,
};

export default function ConfirmationDialog (props) {
  const {
    style,
    title,
    message,
    onCancel,
    onConfirm,
    onDelete,
  } = props;

  return (
    <Modal
      visible
      transparent
      animationType='fade'
    >
      <View style={styles.overlay}>
        <View style={[styles.dialog, style]}>
          <Text style={styles.title}>
            {title}
          </Text>

          <Text style={styles.message}>
            {message}
          </Text>

          <View style={styles.buttons}>
            <Button
              style={styles.cancelButton}
              look={BUTTON_LOOK.SECONDARY}
              text='Cancel'
              onPress={onCancel}
            />

            {onDelete && (
              <Button
                style={styles.deleteButton}
                buttonContainerStyle={styles.deleteButtonContainer}
                textStyle={styles.deleteButtonText}
                look={BUTTON_LOOK.PRIMARY}
                text='Delete'
                onPress={onDelete}
              />
            )}

            {onConfirm && (
              <Button
                style={styles.confirmButton}
                look={BUTTON_LOOK.PRIMARY}
                text='Confirm'
                onPress={onConfirm}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dialog: {
    maxWidth: Platform.select({ web: 320}),
    backgroundColor: COLOR.WHITE,
    padding: 24,
    borderRadius: 10,
  },

  title: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
    fontSize: 20,
    lineHeight: 24,
  },

  message: {
    marginTop: 24,
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 16,
    lineHeight: 21,
  },

  buttons: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  cancelButton: {
    marginRight: 12,
  },

  confirmButton: {
    marginLeft: 12,
  },
  deleteButton: {
    marginLeft: 12,
  },

  deleteButtonContainer: {
    backgroundColor: COLOR.RED,
  },
  deleteButtonText: {
    color: COLOR.WHITE,
  },
});
