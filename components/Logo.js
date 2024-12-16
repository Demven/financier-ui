import {
  StyleSheet,
  View,
  Image, Platform,
} from 'react-native';
import { Link } from 'expo-router';
import PropTypes from 'prop-types';

Logo.propTypes = {
  containerStyle: PropTypes.object,
  navigateTo: PropTypes.string,
};

export default function Logo (props) {
  const {
    containerStyle,
    navigateTo = '/overview'
  } = props;

  return (
    <Link
      style={styles.logo}
      href={navigateTo}
    >
      <View style={[styles.logoContainer, containerStyle]}>
        <Image
          style={styles.logoImage}
          source={require('../assets/images/logo1x.png')}
        />
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  logo: {
    marginLeft: Platform.OS === 'ios' ? 8 : 0,
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
