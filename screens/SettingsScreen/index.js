import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Input, { INPUT_TYPE } from '../../components/Input';
import Dropdown from '../../components/Dropdown';
import Button, { BUTTON_LOOK } from '../../components/Button';
import { setSettingsAction } from '../../redux/reducers/account';
import { saveToStorage, STORAGE_KEY } from '../../services/storage';
import { MEDIA } from '../../styles/media';

const LANGUAGE = {
  ENGLISH: 'en',
};
const LANGUAGES = [
  { value: LANGUAGE.ENGLISH, label: 'English' },
];

const CURRENCY = {
  US_DOLLAR: 'USD',
  EURO: 'EUR',
  JAPANESE_YEN: 'JPU',
  POUND_STERLING: 'GPB',
  AUSTRALIAN_DOLLAR: 'AUD',
  CANADIAN_DOLLAR: 'CAD',
  SWISS_FRANC: 'CHF',
};
const CURRENCIES = [
  { value: CURRENCY.US_DOLLAR, label: 'US Dollar ($)' },
  { value: CURRENCY.EURO, label: 'Euro (€)' },
  { value: CURRENCY.JAPANESE_YEN, label: 'Japanese Yen (¥)' },
  { value: CURRENCY.POUND_STERLING, label: 'Pound Sterling (£)' },
  { value: CURRENCY.AUSTRALIAN_DOLLAR, label: 'Australian Dollar ($)' },
  { value: CURRENCY.CANADIAN_DOLLAR, label: 'Canadian Dollar ($)' },
  { value: CURRENCY.SWISS_FRANC, label: 'Swiss Franc' },
];
const CURRENCY_SYMBOL = {
  [CURRENCY.US_DOLLAR]: '$',
  [CURRENCY.EURO]: '€',
  [CURRENCY.JAPANESE_YEN]: '¥',
  [CURRENCY.POUND_STERLING]: '£',
  [CURRENCY.AUSTRALIAN_DOLLAR]: '$',
  [CURRENCY.CANADIAN_DOLLAR]: '$',
  [CURRENCY.SWISS_FRANC]: '',
};

const deviceWidth = Dimensions.get('window').width;

export default function SettingsScreen () {
  const dispatch = useDispatch();

  const initialFirstName = useSelector(state => state.account.firstName);
  const initialLastName = useSelector(state => state.account.lastName);
  const initialEmail = useSelector(state => state.account.email);
  const initialLanguage = useSelector(state => state.account.language);
  const initialCurrency = useSelector(state => state.account.currencyType);

  const [firstName, setFirstName] = useState(initialFirstName);
  const [firstNameError, setFirstNameError] = useState('');

  const [lastName, setLastName] = useState(initialLastName);
  const [lastNameError, setLastNameError] = useState('');

  const [email, setEmail] = useState(initialEmail);

  const [languageSelectOpen, setLanguageSelectOpen] = useState(false);
  const [languageId, setLanguageId] = useState(initialLanguage || LANGUAGE.ENGLISH);
  const [languages, setLanguages] = useState(LANGUAGES);

  const [currencySelectOpen, setCurrencySelectOpen] = useState(false);
  const [currencyId, setCurrencyId] = useState(initialCurrency || CURRENCY.US_DOLLAR);
  const [currencies, setCurrencies] = useState(CURRENCIES);

  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    const valid = !firstNameError && !lastNameError;

    if (valid !== formIsValid) {
      setFormIsValid(valid);
    }
  }, [firstNameError, lastNameError]);

  function validate () {
    let hasError = false;

    if (!firstName.trim().length) {
      setFirstNameError('Please fill in your first name');
      hasError = true;
    } else {
      setFirstNameError('')
    }

    if (!lastName.trim().length) {
      setLastNameError('Please fill in your last name');
      hasError = true;
    } else {
      setLastNameError('');
    }

    return !hasError;
  }

  function onSave () {
    const isValid = validate();

    const settingsToSave = {
      firstName,
      lastName,
      email,
      language: languageId,
      currencyType: currencyId,
      currencySymbol: CURRENCY_SYMBOL[currencyId],
    };

    if (isValid) {
      dispatch(setSettingsAction(settingsToSave));

      saveToStorage(STORAGE_KEY.SETTINGS, settingsToSave);
    }
  }

  return (
    <View style={styles.settingsScreen}>
      <Input
        style={styles.formElement}
        label='First Name'
        inputType={INPUT_TYPE.DEFAULT}
        value={firstName}
        errorText={firstNameError}
        onChange={setFirstName}
        onBlur={validate}
      />

      <View style={styles.formRow}>
        <Input
          style={styles.formElement}
          label='Last Name'
          inputType={INPUT_TYPE.DEFAULT}
          value={lastName}
          errorText={lastNameError}
          onChange={setLastName}
          onBlur={validate}
        />
      </View>

      <View style={styles.formRow}>
        <Input
          style={styles.formElement}
          label='Email'
          inputType={INPUT_TYPE.DEFAULT}
          value={email}
          onChange={setEmail}
          disabled
        />
      </View>

      <View style={[styles.formRow, { zIndex: 20 }]}>
        <Dropdown
          style={styles.formElement}
          label='Language'
          open={languageSelectOpen}
          setOpen={setLanguageSelectOpen}
          value={languageId}
          setValue={setLanguageId}
          items={languages}
          setItems={setLanguages}
        />
      </View>

      <View style={[styles.formRow, { zIndex: 10 }]}>
        <Dropdown
          style={styles.formElement}
          label='Currency'
          open={currencySelectOpen}
          setOpen={setCurrencySelectOpen}
          value={currencyId}
          setValue={setCurrencyId}
          items={currencies}
          setItems={setCurrencies}
        />
      </View>

      <View style={styles.buttons}>
        <Button
          style={styles.saveButton}
          look={BUTTON_LOOK.PRIMARY}
          text='Save'
          disabled={!formIsValid}
          onPress={onSave}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  settingsScreen: {
    width: deviceWidth >= MEDIA.TABLET ? 600 : '100%',
    marginTop:  deviceWidth >= MEDIA.TABLET ? 100 : 16,
    padding: 32,
    alignSelf: 'center',
    boxSizing: 'border-box',
  },

  formRow: {
    flexDirection: 'row',
    flexGrow: 1,
    marginTop: 32,
    justifyContent: 'flex-end',
  },

  formElement: {
    flexShrink: 1,
  },

  buttons: {
    flexGrow: 1,
    marginTop: deviceWidth >= MEDIA.TABLET ? 120 : 80,
  },
  saveButton: {
    width: 150,
    alignSelf: deviceWidth >= MEDIA.TABLET ? 'flex-end' : 'center',
  },
});
