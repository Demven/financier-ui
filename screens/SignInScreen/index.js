import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Dimensions,
  Image,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FONT } from '../../styles/fonts';
import { MEDIA } from '../../styles/media';
import AppleButton from '../../components/AppleButton';

export default function SignInScreen () {
  const [imageWidth, setImageWidth] = useState(getWindowWidth());

  const navigation = useNavigation();

  useEffect(() => {
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  function onResize () {
    setImageWidth(getWindowWidth());
  }

  function getWindowWidth () {
    return Dimensions.get('window').width;
  }

  return (
    <View style={styles.signInScreen}>
      <Image
        style={{
          width: imageWidth,
          height: '100%',
        }}
        source={require('../../assets/images/backgrounds/sign-in.jpg')}
        resizeMode='cover'
        onLayout={() => setImageWidth(getWindowWidth())}
      />

      <Text
        style={[styles.title, {
          top: getWindowWidth() < MEDIA.TABLET ? '15%' : '10%',
          fontSize: getWindowWidth() < MEDIA.TABLET ? 68 : 128,
        }]}
      >
        Financier
      </Text>

      <View style={styles.appleButtonContainer}>
        <AppleButton onSignIn={() => navigation.navigate('Overview')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  signInScreen: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  title: {
    width: '100%',
    position: 'absolute',
    fontFamily: FONT.TIRO_GURMUKHI.REGULAR,
    color: '#504643',
    textAlign: 'center',
  },

  appleButtonContainer: {
    position: 'absolute',
    bottom: '14%',
  },
});
