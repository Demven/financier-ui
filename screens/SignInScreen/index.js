import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Dimensions,
  Image,
  Text,
  View,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppleButton from '../../components/AppleButton';
import { STORAGE_KEY, saveToStorage } from '../../services/storage';
import { FONT } from '../../styles/fonts';
import { MEDIA } from '../../styles/media';
import { COLOR } from '../../styles/colors';

export default function SignInScreen () {
  const [imageWidth, setImageWidth] = useState(getWindowWidth());

  const navigation = useNavigation();

  useEffect(() => {
    if (Platform.OS === 'web') {
      window.addEventListener('resize', onResize);
    }

    return () => {
      if (Platform.OS === 'web') {
        window.removeEventListener('resize', onResize);
      }
    };
  }, []);

  function onResize () {
    setImageWidth(getWindowWidth());
  }

  function getWindowWidth () {
    return Dimensions.get('window').width;
  }

  async function onSignIn () {
    await saveToStorage(STORAGE_KEY.TOKEN, '1234');

    navigation.navigate('Overview');
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
        <AppleButton onSignIn={onSignIn} />
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
    color: COLOR.BROWN,
    textAlign: 'center',
  },

  appleButtonContainer: {
    position: 'absolute',
    bottom: '14%',
  },
});
