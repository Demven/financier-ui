import { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import Input, { INPUT_TYPE } from '../../../components/Input';
import Dropdown from '../../../components/Dropdown';
import Loader from '../../../components/Loader';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import Button, { BUTTON_LOOK } from '../../../components/Button';
import { setAccountAction } from '../../../redux/reducers/account';
import { showToastAction, TOAST_TYPE } from '../../../redux/reducers/ui';
import { updateAccount, deleteAccount } from '../../../services/api/account';
import { clearStorage } from '../../../services/storage';
import {
  CURRENCY,
  CURRENCIES,
  CURRENCY_SYMBOL,
} from '../../../services/currency';
import { MEDIA } from '../../../styles/media';

const LANGUAGE = {
  ENGLISH: 'en',
};
const LANGUAGES = [
  { value: LANGUAGE.ENGLISH, label: 'English' },
];

const DELAY_BEFORE_NAVIGATING_TO_SIGN_IN = 1000;

export default function SettingsScreen () {
  const dispatch = useDispatch();
  const router = useRouter();

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const loading = useSelector(state => state.ui.loading);

  const account = useSelector(state => state.account);

  const [deleteInProgress, setDeleteInProgress] = useState(false);

  const [firstName, setFirstName] = useState(account?.firstName || '');
  const [firstNameError, setFirstNameError] = useState('');

  const [lastName, setLastName] = useState(account?.lastName || '');
  const [lastNameError, setLastNameError] = useState('');

  const [email, setEmail] = useState(account?.email || '');

  const [languageSelectOpen, setLanguageSelectOpen] = useState(false);
  const [languageId, setLanguageId] = useState(account?.language || LANGUAGE.ENGLISH);
  const [languages, setLanguages] = useState(LANGUAGES);

  const [currencySelectOpen, setCurrencySelectOpen] = useState(false);
  const [currencyId, setCurrencyId] = useState(account?.currencyType || CURRENCY.US_DOLLAR);
  const [currencies, setCurrencies] = useState(CURRENCIES);

  const [formIsValid, setFormIsValid] = useState(false);

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  useEffect(() => {
    if (account?.firstName !== firstName) {
      setFirstName(account?.firstName);
    }
    if (account?.lastName !== lastName) {
      setLastName(account?.lastName);
    }
    if (account?.email !== email) {
      setEmail(account?.email);
    }
    if (account?.language !== languageId) {
      setLanguageId(account?.language);
    }
    if (account?.currencyType !== currencyId) {
      setCurrencyId(account?.currencyType);
    }
  }, [account]);

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

  function onDeleteRequest () {
    setDeleteDialogVisible(true);
  }

  async function onDelete () {
    if (!account?.id) {
      return;
    }

    setDeleteInProgress(true);
    setDeleteDialogVisible(false);

    const success = await deleteAccount(account.id);

    if (success) {
      dispatch(showToastAction({
        message: 'Account permanently deleted',
        type: TOAST_TYPE.INFO,
      }));
      setDeleteInProgress(false);

      setTimeout(onLogOut, DELAY_BEFORE_NAVIGATING_TO_SIGN_IN);
    } else {
      dispatch(showToastAction({
        message: 'Failed to delete account',
        type: TOAST_TYPE.ERROR,
      }));
    }
  }

  async function onLogOut () {
    await clearStorage();

    router.push('sign-in');
  }

  return (
    <>
      <ScrollView
        style={[styles.settingsScreen, {
          width: windowWidth >= MEDIA.TABLET ? 600 : '100%',
          paddingVertical:  windowWidth >= MEDIA.TABLET ? 100 : 16,
        }]}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.formRow}>
          <Input
            style={styles.input}
            inputContainerStyle={styles.formElement}
            label='First Name'
            inputType={INPUT_TYPE.DEFAULT}
            value={firstName}
            errorText={firstNameError}
            onChange={setFirstName}
            onBlur={validate}
          />
        </View>

        <View style={styles.formRow}>
          <Input
            style={styles.input}
            inputContainerStyle={styles.formElement}
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
            style={styles.input}
            inputContainerStyle={styles.formElement}
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
            style={styles.button}
            buttonContainerStyle={[
              { paddingLeft: 0 },
              windowWidth <= MEDIA.TABLET && styles.buttonSmall,
            ]}
            look={BUTTON_LOOK.TERTIARY}
            text='Delete Account'
            onPress={onDeleteRequest}
            destructive
          />

          <Button
            style={styles.button}
            buttonContainerStyle={windowWidth <= MEDIA.TABLET && styles.buttonSmall}
            look={BUTTON_LOOK.PRIMARY}
            text='Save'
            disabled={!formIsValid}
            onPress={onSave}
          />
        </View>

        <Loader loading={loading || deleteInProgress} />
      </ScrollView>

      {deleteDialogVisible && (
        <ConfirmationDialog
          title='Delete account'
          message='Are you sure you want to permanently delete your account? All your personal data will be lost and cannot be recovered.'
          onCancel={() => setDeleteDialogVisible(false)}
          onDelete={onDelete}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  settingsScreen: {
    flex: 1,
    paddingHorizontal: 32,
    alignSelf: 'center',
    boxSizing: 'border-box',
  },

  formRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 32,
  },

  formElement: {
    flexShrink: 1,
  },

  buttons: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    minWidth: 148,
  },
  buttonSmall: {
    paddingHorizontal: 8,
  },
});
