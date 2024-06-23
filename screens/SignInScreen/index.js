import { useState } from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
// import AppleButton from '../../components/AppleButton';
import Input, { INPUT_TYPE } from '../../components/Input';
import Button, { BUTTON_LOOK } from '../../components/Button';
import { TOAST_TYPE } from '../../components/Toast';
import Dropdown from '../../components/Dropdown';
import { STORAGE_KEY, saveToStorage, clearStorage } from '../../services/storage';
import { CURRENCIES, CURRENCY } from '../../services/currency';
import { reinitializeAction, showToastAction } from '../../redux/reducers/ui';
import { signIn, register } from '../../services/api/auth';
import { FONT } from '../../styles/fonts';
import { MEDIA } from '../../styles/media';
import { COLOR } from '../../styles/colors';
import { resetStore } from '../../redux/store';

export default function SignInScreen () {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const windowWidth = useSelector(state => state.ui.windowWidth);

  const [createAccountFlow, setCreateAccountFlow] = useState(false);
  const [showSuccessView, setShowSuccessView] = useState(false);

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

    onBackToSignIn();

    dispatch(reinitializeAction(true));

    return navigation.navigate('Drawer');
  }

  async function onSignIn () {
    const isValid = validateEmail(email) && validatePassword(password);

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
      const isValid = validateEmail(email) && validatePassword(password);

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
        setShowSuccessView(true);
      } else {
        dispatch(showToastAction({
          message: error,
          type: TOAST_TYPE.ERROR,
        }));
      }
    }
  }

  function onBackToSignIn () {
    setFirstName('');
    setFirstNameError('');
    setLastName('');
    setLastNameError('');
    setCurrencyType(CURRENCY.US_DOLLAR);
    setCreateAccountFlow(false);
    setShowSuccessView(false);
  }

  function onKeyPress (event) {
    if (event.nativeEvent.key === 'Enter'){
      onSignIn();
    }
  }

  const disableSignIn = !!emailError || !!passwordError;
  const disableCreateAccount = disableSignIn || !!firstNameError || !!lastNameError;

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
        maxWidth: showSuccessView
          ? windowWidth < MEDIA.WIDE_MOBILE ? 320 : 400
          : 286,
        bottom: (createAccountFlow || showSuccessView) ? '25%' : '14%',
      }]}>
        {!createAccountFlow && !showSuccessView && (
          <>
            <Input
              style={styles.formElement}
              label='Email'
              inputType={INPUT_TYPE.EMAIL}
              value={email}
              errorText={emailError}
              onChange={setEmail}
              onBlur={() => validateEmail(email)}
              onKeyPress={onKeyPress}
              autoFocus
            />

            <Input
              style={styles.formElement}
              label='Password'
              inputType={INPUT_TYPE.DEFAULT}
              value={password}
              errorText={passwordError}
              onChange={setPassword}
              onBlur={() => validatePassword(password)}
              onKeyPress={onKeyPress}
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
          </>
        )}

        {createAccountFlow && !showSuccessView && (
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

        {!showSuccessView && (
          <Button
            style={[styles.createAccountButton, {
              marginTop: createAccountFlow ? 52 : 20,
            }]}
            buttonContainerStyle={styles.createAccountButtonContainer}
            look={createAccountFlow ? BUTTON_LOOK.PRIMARY : BUTTON_LOOK.SECONDARY}
            text='Create Account'
            disabled={disableCreateAccount}
            onPress={onCreateAccount}
          />
        )}

        {/*<View style={styles.appleButtonContainer}>*/}
        {/*  <AppleButton*/}
        {/*    onSignIn={() => onSuccess('apple-id-token')}*/}
        {/*  />*/}
        {/*</View>*/}

        {showSuccessView && (
          <View style={styles.successContainer}>
            <Text style={styles.successMessage}>
              Dear {firstName},
            </Text>

            <Text style={[styles.successMessage, { marginTop: 24 }]}>
              Please check your email inbox and follow the instructions to confirm your email address <Text style={{ fontWeight: 'bold', color: COLOR.ORANGE }}>{email}</Text>.
            </Text>

            <Text style={[styles.successMessage, { marginTop: 24 }]}>
              It should take you just a second to start tracking all your finances in our beautiful app.
            </Text>

            <Text style={[styles.successMessage, { marginTop: 24 }]}>
              Financier
            </Text>
          </View>
        )}

        {createAccountFlow && (
          <Button
            style={styles.backToSignInButton}
            buttonContainerStyle={styles.backToSignInButtonContainer}
            look={BUTTON_LOOK.TERTIARY}
            text='Back to Sign-In'
            onPress={onBackToSignIn}
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

  signInButton: {
    marginTop: 52,
  },
  signInButtonContainer: {
    height: 46,
  },

  createAccountButton: {},
  createAccountButtonContainer: {
    height: 46,
  },

  backToSignInButton: {
    marginTop: 24,
  },
  backToSignInButtonContainer: {
    height: 46,
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
