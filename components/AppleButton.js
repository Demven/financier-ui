import {
  StyleSheet,
  View,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { MEDIA } from '../styles/media';

AppleButton.propTypes = {
  style: PropTypes.object,
  onSignIn: PropTypes.func,
};

export default function AppleButton (props) {
  const {
    style,
    onSignIn,
  } = props;

  return (
    <Pressable
      style={({ pressed }) => [styles.appleButton, pressed && styles.appleButtonPressed]}
      onPress={onSignIn}
    >
      <View style={[styles.imageContainer, style]}>
        <Image
          style={styles.buttonImage}
          source={require('../assets/images/apple-button.png')}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  appleButton: {},
  appleButtonPressed: {
    opacity: 0.7,
  },
  imageContainer: {
    width: 286,
    height: 48,
  },
  buttonImage: {
    width: '100%',
    height: '100%',
  },
});
