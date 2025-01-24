import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useNavigation } from 'expo-router';
// import AppleButton from '../../components/AppleButton';
import Input, { INPUT_TYPE } from '../../components/Input';
import Button, { BUTTON_LOOK } from '../../components/Button';
import Dropdown from '../../components/Dropdown';
import { STORAGE_KEY, saveToStorage, clearStorage } from '../../services/storage';
import { CURRENCIES, CURRENCY } from '../../services/currency';
import { reinitializeAction, showToastAction, TOAST_TYPE } from '../../redux/reducers/ui';
import { signIn, register, resetPassword } from '../../services/api/auth';
import { FONT } from '../../styles/fonts';
import { MEDIA } from '../../styles/media';
import { COLOR } from '../../styles/colors';
import { resetStore } from '../../redux/store';

export default function SignInScreen () {
  const router = useRouter();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const windowWidth = useSelector(state => state.ui.windowWidth);

  const [createAccountFlow, setCreateAccountFlow] = useState(false);
  const [forgotPasswordFlow, setForgotPasswordFlow] = useState(false);

  const [showRegistrationSuccessView, setShowRegistrationSuccessView] = useState(false);
  const [showPasswordResetSuccessView, setShowPasswordResetSuccessView] = useState(false);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');

  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState('');

  const [currencySelectOpen, setCurrencySelectOpen] = useState(false);
  const [currencyType, setCurrencyType] = useState(CURRENCY.US_DOLLAR);
  const [currencies, setCurrencies] = useState(CURRENCIES);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  function validateEmail () {
    let valid = true;

    const isValid = email?.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    if (!email.trim().length) {
      setEmailError('Email can\'t be empty');
      valid = false;
    } else if (!isValid) {
      setEmailError('Doesn\'t look like an e-mail address');
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

  function validateFirstName () {
    let valid = true;

    if (!firstName.trim().length) {
      setFirstNameError('Enter your first name');
      valid = false;
    } else {
      setFirstNameError('');
    }

    return valid;
  }

  function validateLastName () {
    let valid = true;

    if (!lastName.trim().length) {
      setLastNameError('Enter your last name');
      valid = false;
    } else {
      setLastNameError('');
    }

    return valid;
  }

  async function onSuccess (token) {
    await saveToStorage(STORAGE_KEY.TOKEN, token);

    clearForm();

    dispatch(reinitializeAction(true));

    return router.push('/overview');
  }

  async function onSignIn () {
    const isValid = validateEmail() && validatePassword();

    if (isValid) {
      const token = await signIn(email, password);

      if (token) {
        resetStore(dispatch);
        await clearStorage();
        await onSuccess(token);
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
  }

  async function onCreateAccount () {
    if (!createAccountFlow) {
      const isValid = validateEmail() && validatePassword();

      if (isValid) {
        setCreateAccountFlow(true);
      }
    } else {
      const accountToRegister = {
        email,
        password,
        firstName,
        lastName,
        currencyType,
      };

      const {
        success,
        error,
      } = await register(accountToRegister);

      if (success && !error) {
        setShowRegistrationSuccessView(true);
      } else {
        dispatch(showToastAction({
          message: error,
          type: TOAST_TYPE.ERROR,
        }));
      }
    }
  }

  function onForgotPassword () {
    setForgotPasswordFlow(true);
  }

  async function onResetPassword () {
    const isValid = validateEmail();

    if (!isValid) {
      return dispatch(showToastAction({
        message: 'Invalid email',
        type: TOAST_TYPE.ERROR,
      }));
    }

    const {
      success,
      error,
    } = await resetPassword(email);

    if (success && !error) {
      setShowPasswordResetSuccessView(true);
    } else {
      dispatch(showToastAction({
        message: error,
        type: TOAST_TYPE.ERROR,
      }));
    }
  }

  function clearForm () {
    setFirstName('');
    setFirstNameError('');
    setLastName('');
    setLastNameError('');
    setCurrencyType(CURRENCY.US_DOLLAR);
    setCreateAccountFlow(false);
    setForgotPasswordFlow(false);
    setShowRegistrationSuccessView(false);
    setShowPasswordResetSuccessView(false);
  }

  function onKeyPress (event) {
    if (event.nativeEvent.key === 'Enter'){
      onSignIn();
    }
  }

  const disableSignIn = !!emailError || !!passwordError;
  const disableCreateAccount = disableSignIn || !!firstNameError || !!lastNameError;

  const messageIsVisible = showRegistrationSuccessView || showPasswordResetSuccessView;

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

      <View style={[styles.form, {
        maxWidth: messageIsVisible
          ? windowWidth < MEDIA.WIDE_MOBILE ? 320 : 400
          : 286,
        bottom: (createAccountFlow || messageIsVisible) ? '25%' : '14%',
      }]}>
        {!createAccountFlow && !messageIsVisible && (
          <>
            <Input
              style={styles.formElement}
              label='Email'
              inputType={INPUT_TYPE.EMAIL}
              value={email}
              errorText={emailError}
              onChange={setEmail}
              onBlur={validateEmail}
              onKeyPress={onKeyPress}
              autoFocus
            />

            {!forgotPasswordFlow && (
              <>
                <Input
                  style={styles.formElement}
                  label='Password'
                  inputType={INPUT_TYPE.DEFAULT}
                  value={password}
                  errorText={passwordError}
                  onChange={setPassword}
                  onBlur={validatePassword}
                  onKeyPress={onKeyPress}
                  secure
                />

                <Button
                  style={styles.signInButton}
                  buttonContainerStyle={styles.buttonContainer}
                  look={BUTTON_LOOK.PRIMARY}
                  text='Sign In'
                  disabled={disableSignIn}
                  onPress={onSignIn}
                />
              </>
            )}
          </>
        )}

        {createAccountFlow && !showRegistrationSuccessView && (
          <>
            <Input
              style={styles.formElement}
              label='First Name'
              inputType={INPUT_TYPE.DEFAULT}
              value={firstName}
              errorText={firstNameError}
              onChange={setFirstName}
              onBlur={() => validateFirstName(firstName)}
              onKeyPress={onKeyPress}
              autoFocus
            />

            <Input
              style={styles.formElement}
              label='Last Name'
              inputType={INPUT_TYPE.DEFAULT}
              value={lastName}
              errorText={lastNameError}
              onChange={setLastName}
              onBlur={() => validateLastName(lastName)}
              onKeyPress={onKeyPress}
            />

            <View style={{ zIndex: 10 }}>
              <Dropdown
                style={styles.formElement}
                label='Currency'
                open={currencySelectOpen}
                setOpen={setCurrencySelectOpen}
                value={currencyType}
                setValue={setCurrencyType}
                items={currencies}
                setItems={setCurrencies}
                maxVisibleItems={4}
              />
            </View>
          </>
        )}

        {(!showRegistrationSuccessView && !forgotPasswordFlow) && (
          <>
            <Button
              style={[styles.createAccountButton, {
                marginTop: createAccountFlow ? 52 : 20,
              }]}
              buttonContainerStyle={styles.buttonContainer}
              look={createAccountFlow ? BUTTON_LOOK.PRIMARY : BUTTON_LOOK.SECONDARY}
              text='Create Account'
              disabled={disableCreateAccount}
              onPress={onCreateAccount}
            />

            <Button
              style={styles.forgotPasswordButton}
              buttonContainerStyle={styles.buttonContainer}
              look={BUTTON_LOOK.TERTIARY}
              text='Forgot password?'
              onPress={onForgotPassword}
            />
          </>
        )}

        {(forgotPasswordFlow && !showPasswordResetSuccessView) && (
          <Button
            style={styles.resetPasswordButton}
            buttonContainerStyle={styles.buttonContainer}
            look={BUTTON_LOOK.PRIMARY}
            text='Reset Password'
            disabled={!!emailError}
            onPress={onResetPassword}
          />
        )}

        {/*<View style={styles.appleButtonContainer}>*/}
        {/*  <AppleButton*/}
        {/*    onSignIn={() => onSuccess('apple-id-token')}*/}
        {/*  />*/}
        {/*</View>*/}

        {(showRegistrationSuccessView || showPasswordResetSuccessView) && (
          <View style={styles.successContainer}>
            {showRegistrationSuccessView && (
              <>
                <Text style={styles.successMessage}>
                  Dear {firstName},
                </Text>

                <Text style={[styles.successMessage, { marginTop: 24 }]}>
                  Please check your email inbox and follow the instructions to confirm your email address <Text style={{ fontWeight: 'bold', color: COLOR.ORANGE }}>{email}</Text>.
                </Text>
              </>
            )}

            {showPasswordResetSuccessView && (
              <Text style={[styles.successMessage, { marginTop: 24 }]}>
                We have successfully reset your password. Please check your email, and follow the instructions to set up your new password.
              </Text>
            )}

            <Text style={[styles.successMessage, { marginTop: 24 }]}>
              It should take you just a second to keep tracking all your finances in our beautiful app.
            </Text>

            <Text style={[styles.successMessage, { marginTop: 24 }]}>
              Your Financier
            </Text>
          </View>
        )}

        {(createAccountFlow || forgotPasswordFlow) && (
          <Button
            style={styles.backToSignInButton}
            buttonContainerStyle={styles.buttonContainer}
            look={BUTTON_LOOK.TERTIARY}
            text='Back to Sign-In'
            onPress={clearForm}
          />
        )}
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

  signInButton: {
    marginTop: 52,
  },

  createAccountButton: {},

  resetPasswordButton: {
    marginTop: 24,
  },

  forgotPasswordButton: {
    marginTop: 16,
  },

  backToSignInButton: {
    marginTop: 24,
  },

  appleButtonContainer: {
    marginTop: 52,
  },

  successContainer: {
    padding: 24,
    backgroundColor: COLOR.WHITE,
    borderWidth: 2,
    borderColor: COLOR.ORANGE,
  },
  successMessage: {
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 18,
    lineHeight: 24,
  },
});
