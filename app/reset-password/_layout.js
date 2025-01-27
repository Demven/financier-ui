import { useEffect, useState } from 'react';
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
import Input, { INPUT_TYPE } from '../../components/Input';
import { showToastAction, TOAST_TYPE } from '../../redux/reducers/ui';
import { resetStore } from '../../redux/store';
import { setUpNewPassword } from '../../services/api/auth';
import { getQueryParam } from '../../services/location';
import { clearStorage } from '../../services/storage';
import { FONT } from '../../styles/fonts';
import { MEDIA } from '../../styles/media';
import { COLOR } from '../../styles/colors';

const NAVIGATION_DELAY = 3000;

export default function ResetPasswordScreen () {
  const router = useRouter();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [repeatPassword, setRepeatPassword] = useState('');
  const [repeatPasswordError, setRepeatPasswordError] = useState('');

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const windowWidth = useSelector(state => state.ui.windowWidth);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  function onKeyPress (event) {
    if (event.nativeEvent.key === 'Enter'){
      onSave();
    }
  }

  async function onSave () {
    setLoading(true);

    const isValid = validatePassword() && validateRepeatPassword();

    if (isValid) {
      const token = getQueryParam('token');
      const success = await setUpNewPassword(token, password);

      if (success) {
        resetStore(dispatch);
        await clearStorage();

        setShowSuccessMessage(true);
        setLoading(false);

        dispatch(showToastAction({
          message: 'Redirecting you back to sign in...',
          type: TOAST_TYPE.INFO,
        }));

        setTimeout(onBackToSignIn, NAVIGATION_DELAY);
      } else {
        dispatch(showToastAction({
          message: 'Failed to sign in. Please try again.',
          type: TOAST_TYPE.ERROR,
        }));
      }
    } else {
      dispatch(showToastAction({
        message: 'Invalid email or password',
        type: TOAST_TYPE.ERROR,
      }));
    }

    setLoading(false);
  }

  function validatePassword () {
    let valid = true;

    if (!password.trim().length) {
      setPasswordError('Password can\'t be empty');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('The password is too short');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  }

  function validateRepeatPassword () {
    let valid = true;

    if (!repeatPassword.trim().length) {
      setRepeatPasswordError('Password can\'t be empty');
      valid = false;
    } else if (repeatPassword.length < 6) {
      setRepeatPasswordError('The password is too short');
      valid = false;
    } else if (repeatPassword !== password) {
      setRepeatPasswordError('The passwords do not match');
      valid = false;
    } else {
      setRepeatPasswordError('');
    }

    return valid;
  }

  function onBackToSignIn () {
    router.push('/sign-in');
  }

  return (
    <View style={styles.resetPasswordScreen}>
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

      <View style={[styles.form, {
        maxWidth: showSuccessMessage
          ? windowWidth < MEDIA.WIDE_MOBILE ? 320 : 400
          : 286,
        bottom: showSuccessMessage ? '25%' : '14%',
      }]}>
        {loading && (
          <Loader
            loading={loading}
            setLoading={setLoading}
          />
        )}

        {!showSuccessMessage && (
          <>
            <Input
              inputContainerStyle={styles.formElement}
              label='New Password'
              inputType={INPUT_TYPE.DEFAULT}
              value={password}
              errorText={passwordError}
              onChange={setPassword}
              onBlur={validatePassword}
              onKeyPress={onKeyPress}
              secure
            />

            <Input
              inputContainerStyle={styles.formElement}
              label='Repeat New Password'
              inputType={INPUT_TYPE.DEFAULT}
              value={repeatPassword}
              errorText={repeatPasswordError}
              onChange={setRepeatPassword}
              onBlur={validateRepeatPassword}
              onKeyPress={onKeyPress}
              secure
            />

            <Button
              style={styles.saveButton}
              buttonContainerStyle={styles.buttonContainer}
              look={BUTTON_LOOK.PRIMARY}
              text='Set a new password'
              disabled={!!passwordError || !!repeatPasswordError}
              onPress={onSave}
            />
          </>
        )}

        {showSuccessMessage && (
          <View style={styles.messageContainer}>
            <Text style={styles.message}>
              The new password is saved.
            </Text>
          </View>
        )}

        <Button
          style={styles.backToSignInButton}
          buttonContainerStyle={styles.buttonContainer}
          look={BUTTON_LOOK.TERTIARY}
          text='Back to Sign-In'
          onPress={onBackToSignIn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  resetPasswordScreen: {
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

  formElement: {
    marginTop: 24,
    paddingTop: 4,
    paddingHorizontal: 4,
    backgroundColor: COLOR.WHITE,
  },

  buttonContainer: {
    height: 46,
  },

  saveButton: {
    marginTop: 52,
  },
  backToSignInButton: {
    marginTop: 24,
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
