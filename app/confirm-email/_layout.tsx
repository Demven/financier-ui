import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRouter } from 'expo-router';
import Button, { BUTTON_LOOK } from '../../components/Button';
import Loader from '../../components/Loader';
import { TOAST_TYPE } from '../../components/Toast';
import { showToastAction } from '../../redux/reducers/ui';
import { confirmEmail } from '../../services/api/auth';
import { getQueryParam } from '../../services/location';
import { FONT } from '../../styles/fonts';
import { MEDIA } from '../../styles/media';
import { COLOR } from '../../styles/colors';

const NAVIGATION_DELAY = 3000;

export default function ConfirmEmailScreen () {
  const navigation = useNavigation();
  const router = useRouter();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const windowWidth = useSelector(state => state.ui.windowWidth);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const token = getQueryParam('token');

    if (token) {
      onConfirmEmail(token);
    }
  }, []);

  async function onConfirmEmail (token) {
    const { success, payload, error } = await confirmEmail(token);

    if (success && payload) {
      const { firstName } = payload;

      setMessage(`${firstName}, your email address is confirmed.`);

      dispatch(showToastAction({
        message: 'Redirecting you back...',
        type: TOAST_TYPE.INFO,
      }));

      setTimeout(onBackToSignIn, NAVIGATION_DELAY);
    } else if (error) {
      dispatch(showToastAction({
        message: error,
        type: TOAST_TYPE.ERROR,
      }));
    }

    setLoading(false);
  }

  function onBackToSignIn () {
    router.push('/sign-in');
  }

  return (
    <View style={styles.confirmEmailScreen}>
      <Image
        style={{
          width: windowWidth,
          height: '100%',
        }}
        source={require('../../assets/images/backgrounds/sign-in.jpg')}
        resizeMode='cover'
      />

      <Text
        style={[styles.title, {
          top: windowWidth < MEDIA.TABLET ? '15%' : '10%',
          fontSize: windowWidth < MEDIA.TABLET ? 68 : 128,
        }]}
      >
        Financier
      </Text>

      <View
        style={[styles.form, {
          maxWidth: windowWidth < MEDIA.WIDE_MOBILE ? 320 : 400,
          bottom: '14%',
        }]}
      >
        <Loader
          loading={loading}
          setLoading={setLoading}
        />

        <View style={styles.messageContainer}>
          {message && (
            <Text style={styles.message}>
              {message}
            </Text>
          )}

          <Button
            style={styles.backToSignInButton}
            buttonContainerStyle={styles.backToSignInButtonContainer}
            look={BUTTON_LOOK.TERTIARY}
            text='Back to Sign-In'
            onPress={onBackToSignIn}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  confirmEmailScreen: {
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

  form: {
    width: '100%',
    minHeight: 192,
    position: 'absolute',
  },

  backToSignInButton: {},
  backToSignInButtonContainer: {
    height: 46,
  },

  messageContainer: {
    padding: 24,
    backgroundColor: COLOR.WHITE,
    borderWidth: 2,
    borderColor: COLOR.ORANGE,
    borderRadius: 8,
  },
  message: {
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 18,
    lineHeight: 24,
  },
});
