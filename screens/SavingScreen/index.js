import { useState, useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Modal from '../../components/Modal';
import Input, { INPUT_TYPE } from '../../components/Input';
import Dropdown from '../../components/Dropdown';
import DatePicker from '../../components/DatePicker';
import { addSavingAction, addInvestmentAction } from '../../redux/reducers/savings';
import { dateToDateString } from '../../services/date';

const TYPE = {
  SAVING: 'saving',
  INVESTMENT: 'investment',
};
const TYPES = [
  { value: TYPE.SAVING, label: 'Saving', description: 'Saving accounts, cash, etc.' },
  { value: TYPE.INVESTMENT, label: 'Investment', description: 'Stocks, ETFs, bonds, etc.' },
];

const DATE_OPTION = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  CHOOSE_DATE: 'choose',
};
const DATE_OPTIONS = [
  { value: DATE_OPTION.TODAY, label: 'Today' },
  { value: DATE_OPTION.YESTERDAY, label: 'Yesterday' },
  { value: DATE_OPTION.CHOOSE_DATE, label: 'Choose' },
];

export default function SavingScreen () {
  const dispatch = useDispatch();
  const route = useRoute();

  const savingToEdit = route.params?.saving;
  const investmentToEdit = route.params?.investment;

  const [name, setName] = useState(savingToEdit?.name || investmentToEdit?.name || '');
  const [nameError, setNameError] = useState('');

  const [typeSelectOpen, setTypeSelectOpen] = useState(false);
  const [typeId, setTypeId] = useState(investmentToEdit ? TYPE.INVESTMENT : TYPE.SAVING);
  const [types, setTypes] = useState(TYPES);

  const [dateOptionsSelectOpen, setDateOptionsSelectOpen] = useState(false);
  const [dateOptionId, setDateOptionId] = useState((savingToEdit?.dateString || investmentToEdit?.dateString)
    ? DATE_OPTION.CHOOSE_DATE
    : DATE_OPTION.TODAY
  );
  const [dateOptions, setDateOptions] = useState(DATE_OPTIONS);

  const [dateString, setDateString] = useState(savingToEdit?.dateString || investmentToEdit?.dateString || dateToDateString(new Date()));
  const [dateDisabled, setDateDisabled] = useState(false);

  const [ticker, setTicker] = useState(investmentToEdit?.ticker || '');

  const [shares, setShares] = useState(investmentToEdit?.shares ? String(investmentToEdit.shares) : '');
  const [sharesError, setSharesError] = useState('');

  const [pricePerShare, setPricePerShare] = useState(investmentToEdit?.pricePerShare ? String(investmentToEdit.pricePerShare) : '');
  const [pricePerShareError, setPricePerShareError] = useState('');

  const [amount, setAmount] = useState(savingToEdit?.amount ? String(savingToEdit.amount) : '');
  const [amountError, setAmountError] = useState('');

  const todayDate = new Date();
  todayDate.setHours(0);
  todayDate.setMinutes(0);
  todayDate.setSeconds(0);

  useEffect(() => {
    if (dateOptionId === DATE_OPTION.TODAY) {
      setDateString(dateToDateString(todayDate));
      setDateDisabled(true);
    } else if (dateOptionId === DATE_OPTION.YESTERDAY) {
      const yesterdayDate = new Date(todayDate.setDate(todayDate.getDate() - 1));
      setDateString(dateToDateString(yesterdayDate));
      setDateDisabled(true);
    } else {
      setDateString(savingToEdit?.dateString || investmentToEdit?.dateString || dateToDateString(todayDate));
      setDateDisabled(false);
    }
  }, [dateOptionId]);

  function validateName () {
    let valid = true;

    if (!name.trim().length) {
      setNameError('Name can\'t be empty');
      valid = false;
    } else {
      setNameError('');
    }

    return valid;
  }

  function validateAmount () {
    let valid = true;

    if (!amount.trim().length) {
      setAmountError('Can\'t be empty');
      valid = false;
    } else if (isNaN(Number(amount))) {
      setAmountError('Can contain only numeric characters');
      valid = false;
    } else {
      setAmountError('');
    }

    return valid;
  }

  function validateShares () {
    let valid = true;

    if (!shares.trim().length) {
      setSharesError('Can\'t be empty');
      valid = false;
    } else if (isNaN(Number(shares))) {
      setSharesError('Can contain only numeric characters');
      valid = false;
    } else {
      setSharesError('');
    }

    return valid;
  }

  function validatePricePerShare () {
    let valid = true;

    if (!pricePerShare.trim().length) {
      setPricePerShareError('Can\'t be empty');
      valid = false;
    } else if (isNaN(Number(pricePerShare))) {
      setPricePerShareError('Can contain only numeric characters');
      valid = false;
    } else {
      setPricePerShareError('');
    }

    return valid;
  }

  function isValid () {
    const nameValid = validateName();
    const amountValid = validateAmount();
    const sharesValid = validateShares();
    const pricePerShareValid = validatePricePerShare();

    return nameValid
      && (
        (typeId === TYPE.SAVING && amountValid)
        || (typeId === TYPE.INVESTMENT && sharesValid && pricePerShareValid)
      );
  }

  function onSave () {
    if (isValid()) {
      const [year, month, day] = dateString.split('-').map(string => Number(string));

      let week = 1;
      if (day <= 7) {
        week = 1;
      } else if (day > 7 && day <= 14) {
        week = 2;
      } else if (day > 14 && day <= 21) {
        week = 3;
      } else if (day > 21) {
        week = 4;
      }

      if (typeId === TYPE.SAVING) {
        dispatch(addSavingAction({
          year,
          month,
          week,
          saving: {
            id: `${Math.floor(Math.random() * 100000)}`,
            name,
            dateString,
            amount: parseFloat(amount),
          },
        }));
      } else if (typeId === TYPE.INVESTMENT) {
        dispatch(addInvestmentAction({
          year,
          month,
          week,
          investment: {
            id: `${Math.floor(Math.random() * 100000)}`,
            name,
            dateString,
            ticker,
            shares: parseFloat(shares),
            pricePerShare: parseFloat(pricePerShare),
          },
        }));
      }
    }
  }

  const formIsInvalid = !!nameError
    || (typeId === TYPE.SAVING && !!amountError)
    || (typeId === TYPE.INVESTMENT && (!!sharesError || !!pricePerShareError));

  const modalTitle = typeId === TYPE.SAVING
    ? savingToEdit ? 'Edit a saving' : 'Add a saving'
    : investmentToEdit ? 'Edit an investment' : 'Add an investment';

  return (
    <Modal
      contentStyle={styles.savingScreen}
      title={modalTitle}
      disableSave={formIsInvalid}
      onSave={onSave}
    >
      <View style={{ zIndex: 20 }}>
        <Dropdown
          style={styles.formElement}
          label='Type'
          open={typeSelectOpen}
          setOpen={setTypeSelectOpen}
          value={typeId}
          setValue={setTypeId}
          items={types}
          setItems={setTypes}
        />
      </View>

      <View style={styles.formRow}>
        <Input
          style={styles.formElement}
          label='Name'
          placeholder={typeId === TYPE.SAVING
            ? 'American Express Savings'
            : 'S&P500'
          }
          inputType={INPUT_TYPE.DEFAULT}
          value={name}
          errorText={nameError}
          onChange={setName}
          onBlur={validateName}
          autoFocus
        />
      </View>

      <View style={[styles.formRow, { zIndex: 10 }]}>
        <View style={[styles.halfFormElement, { paddingRight: Platform.select({ web: 16, ios: 12 }) }]}>
          <Dropdown
            label='Date'
            open={dateOptionsSelectOpen}
            setOpen={setDateOptionsSelectOpen}
            value={dateOptionId}
            setValue={setDateOptionId}
            items={dateOptions}
            setItems={setDateOptions}
          />
        </View>

        <View style={[styles.halfFormElement, { paddingLeft: Platform.select({ web: 16, ios: 12 }) }]}>
          <DatePicker
            label='Set Date'
            dateString={dateString}
            max={dateToDateString(todayDate)}
            onChange={setDateString}
            disabled={dateDisabled}
          />
        </View>
      </View>

      {typeId === TYPE.INVESTMENT && (
        <>
          <View style={styles.formRow}>
            <View style={styles.tickerContainer}>
              <Input
                style={styles.formElement}
                label='Ticker'
                placeholder='SPY'
                inputType={INPUT_TYPE.DEFAULT}
                value={ticker}
                onChange={(ticker) => setTicker(ticker.toUpperCase())}
              />
            </View>

            <View style={styles.amountContainer}>
              <Input
                style={styles.formElement}
                label='Total Shares'
                placeholder='0'
                inputType={INPUT_TYPE.QUANTITY}
                value={shares}
                errorText={sharesError}
                onChange={setShares}
                onBlur={validateShares}
              />
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.amountContainer}>
              <Input
                style={styles.formElement}
                label='Price per share'
                placeholder='0.01'
                inputType={INPUT_TYPE.CURRENCY}
                value={pricePerShare}
                errorText={pricePerShareError}
                onChange={setPricePerShare}
                onBlur={validatePricePerShare}
              />
            </View>
          </View>
        </>
      )}

      {typeId === TYPE.SAVING && (
        <View style={styles.formRow}>
          <View style={styles.amountContainer}>
            <Input
              label='Amount'
              placeholder='0.01'
              inputType={INPUT_TYPE.CURRENCY}
              value={amount}
              errorText={amountError}
              onChange={setAmount}
              onBlur={validateAmount}
            />
          </View>
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  savingScreen: {
    paddingTop: Platform.select({ web: 48 }),
    paddingBottom: Platform.select({ web: 80 }),
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
  halfFormElement: {
    width: '50%',
  },

  pricePerShareContainer: {
    paddingLeft: Platform.select({ web: 16 }),
  },

  tickerContainer: {
    width: Platform.select({ web: '50%', ios: '100%' }),
    paddingRight: Platform.select({ web: 16 }),
  },

  amountContainer: {
    width: Platform.select({ web: '50%', ios: '100%' }),
    paddingLeft: Platform.select({ web: 16 }),
  },
});
