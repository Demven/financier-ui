import { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Input, { INPUT_TYPE } from '../../components/Input';
import Dropdown from '../../components/Dropdown';
import Button, { BUTTON_LOOK } from '../../components/Button';
import { MEDIA } from "../../styles/media";

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

const deviceWidth = Dimensions.get('window').width;

export default function SettingsScreen () {
  const [firstName, setFirstName] = useState('Dmitry');
  const [lastName, setLastName] = useState('Salnikov');
  const [email, setEmail] = useState('dmitry_salnikov@protonmail.com');

  const [languageSelectOpen, setLanguageSelectOpen] = useState(false);
  const [languageId, setLanguageId] = useState(LANGUAGE.ENGLISH);
  const [languages, setLanguages] = useState(LANGUAGES);

  const [currencySelectOpen, setCurrencySelectOpen] = useState(false);
  const [currencyId, setCurrencyId] = useState(CURRENCY.US_DOLLAR);
  const [currencies, setCurrencies] = useState(CURRENCIES);

  return (
    <View style={styles.settingsScreen}>
      <Input
        style={styles.formElement}
        label='First Name'
        inputType={INPUT_TYPE.DEFAULT}
        value={firstName}
        onChange={setFirstName}
      />

      <View style={styles.formRow}>
        <Input
          style={styles.formElement}
          label='Last Name'
          inputType={INPUT_TYPE.DEFAULT}
          value={lastName}
          onChange={setLastName}
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
          onPress={() => {}}
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
