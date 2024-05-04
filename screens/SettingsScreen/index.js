import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Input, { INPUT_TYPE } from '../../components/Input';
import Dropdown from '../../components/Dropdown';
import Button, { BUTTON_LOOK } from '../../components/Button';
import { TOAST_TYPE } from '../../components/Toast';
import { setAccountAction } from '../../redux/reducers/account';
import { showToastAction } from '../../redux/reducers/ui';
import { updateAccount } from '../../services/api/account';
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

export default function SettingsScreen () {
  const dispatch = useDispatch();

  const windowWidth = useSelector(state => state.ui.windowWidth);

  const account = useSelector(state => state.account);
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

  async function onSave () {
    const isValid = validate();

    const accountToSave = {
      ...account,
      firstName,
      lastName,
      language: languageId,
      currencyType: currencyId,
      currencySymbol: CURRENCY_SYMBOL[currencyId],
    };

    if (isValid) {
      const success = await updateAccount(accountToSave);

      if (success) {
        dispatch(setAccountAction(accountToSave));
        dispatch(showToastAction({
          message: 'Saved',
          type: TOAST_TYPE.INFO,
        }));
      } else {
        dispatch(showToastAction({
          message: 'Failed to save',
          type: TOAST_TYPE.ERROR,
        }));
      }
    }
  }

  return (
    <View
      style={[styles.settingsScreen, {
        width: windowWidth >= MEDIA.TABLET ? 600 : '100%',
        marginTop:  windowWidth >= MEDIA.TABLET ? 100 : 16,
      }]}
    >
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

      <View
        style={[styles.buttons, {
          marginTop: windowWidth >= MEDIA.TABLET ? 120 : 80,
        }]}
      >
        <Button
          style={[styles.saveButton, {
            alignSelf: windowWidth >= MEDIA.TABLET ? 'flex-end' : 'center',
          }]}
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
  },
  saveButton: {
    width: 150,
  },
});
