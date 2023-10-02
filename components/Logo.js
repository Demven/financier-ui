import { StyleSheet, View, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';

Logo.propTypes = {
  containerStyle: PropTypes.object,
  navigateTo: PropTypes.string,
};

export default function Logo (props) {
  const {
    containerStyle,
    navigateTo = 'Overview'
  } = props;

  const navigation = useNavigation();

  return (
    <Pressable
      style={({ pressed }) => [styles.logo, pressed && styles.logoPressed]}
      onPress={() => navigation.navigate(navigateTo)}
    >
      <View style={[styles.logoContainer, containerStyle]}>
        <Image
          style={styles.logoImage}
          source={{ uri: require('../assets/images/logo1x.png') }}
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
    width: 102,
    height: 18,
  },
  logoImage: {
    flexGrow: 1,
  },
});
