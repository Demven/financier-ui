import {
  StyleSheet,
  View,
  Image,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import PropTypes from 'prop-types';

Logo.propTypes = {
  containerStyle: PropTypes.object,
  navigateTo: PropTypes.string,
};

export default function Logo (props) {
  const {
    containerStyle,
    navigateTo = 'overview'
  } = props;

  const router = useRouter();

  return (
    <Pressable
      style={({ pressed }) => [styles.logo, pressed && styles.logoPressed]}
      onPress={() => router.push(navigateTo)}
    >
      <View style={[styles.logoContainer, containerStyle]}>
        <Image
          style={styles.logoImage}
          source={require('../assets/images/logo1x.png')}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  logo: {},
  logoPressed: {
    opacity: 0.8,
  },
  logoContainer: {
    width: 96,
    height: 17,
  },
  logoImage: {
    flexGrow: 1,
    width: 96,
    height: 17,
  },
});
