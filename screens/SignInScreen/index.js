import { useState } from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AppleButton from '../../components/AppleButton';
import Input, { INPUT_TYPE } from '../../components/Input';
import Button, { BUTTON_LOOK } from '../../components/Button';
import { TOAST_TYPE } from '../../components/Toast';
import { STORAGE_KEY, saveToStorage } from '../../services/storage';
import { showToastAction } from '../../redux/reducers/ui';
import { signIn } from '../../services/api/auth';
import { FONT } from '../../styles/fonts';
import { MEDIA } from '../../styles/media';
import { COLOR } from '../../styles/colors';

export default function SignInScreen () {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const windowWidth = useSelector(state => state.ui.windowWidth);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  function validateEmail () {
    let valid = true;

    if (!email.trim().length) {
      setEmailError('Email can\'t be empty');
      valid = false;
    } else if (!email.includes('@')) {
      setEmailError('Doesn\'t look like an email address');
      valid = false;
    } else {
      setEmailError('');
    }

    return valid;
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

  async function onSignIn () {
    const isValid = validateEmail() && validatePassword();

    if (isValid) {
      const token = await signIn(email, password);

      if (token) {
        await onSuccess(token);
      } else {
        dispatch(showToastAction({
          message: 'Failed to sign in. Please try again.',
          type: TOAST_TYPE.ERROR,
        }));
      }
    }
  }

  async function onSuccess (token) {
    await saveToStorage(STORAGE_KEY.TOKEN, token);

    return navigation.navigate('Overview', { screen: 'OverviewMonths' });
  }

  const disableSignIn = !!emailError || !!passwordError;

  return (
    <View
      style={styles.signInScreen}
    >
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

      <View style={styles.form}>
        <Input
          style={styles.formElement}
          label='Email'
          inputType={INPUT_TYPE.EMAIL}
          value={email}
          errorText={emailError}
          onChange={setEmail}
          onBlur={validateEmail}
          autoFocus
        />

        <Input
          style={styles.formElement}
          label='Password'
          inputType={INPUT_TYPE.DEFAULT}
          value={password}
          errorText={passwordError}
          onChange={setPassword}
          onBlur={validatePassword}
          secure
        />

        <Button
          style={styles.signInButton}
          buttonContainerStyle={styles.signInButtonContainer}
          look={BUTTON_LOOK.PRIMARY}
          text='Sign In'
          disabled={disableSignIn}
          onPress={onSignIn}
        />

        <View style={styles.appleButtonContainer}>
          <AppleButton onSignIn={() => onSuccess('apple-id-token')} />
        </View>
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

  form: {
    width: '100%',
    maxWidth: 286,
    position: 'absolute',
    bottom: '14%',
  },

  formElement: {
    marginTop: 24,
    paddingTop: 4,
    paddingHorizontal: 4,
    backgroundColor: COLOR.WHITE,
  },

  signInButton: {
    marginTop: 40,
  },
  signInButtonContainer: {
    height: 46,
  },

  appleButtonContainer: {
    marginTop: 24,
  },
});
