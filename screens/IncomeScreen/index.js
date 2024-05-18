import { useState, useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Modal from '../../components/Modal';
import Input, { INPUT_TYPE } from '../../components/Input';
import Dropdown from '../../components/Dropdown';
import DatePicker from '../../components/DatePicker';
import { TOAST_TYPE } from '../../components/Toast';
import {
  addIncomeAction,
  deleteIncomeAction,
  setIncomesTotalsAction,
  updateIncomeAction,
} from '../../redux/reducers/incomes';
import { showToastAction } from '../../redux/reducers/ui';
import { dateToDateString, getWeekNumberByDayNumber } from '../../services/date';
import { addIncome, updateIncome, deleteIncome } from '../../services/api/income';

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

export default function IncomeScreen () {
  const dispatch = useDispatch();
  const route = useRoute();

  const incomeToEdit = route.params?.income;

  const [name, setName] = useState(incomeToEdit?.name || '');
  const [nameError, setNameError] = useState('');

  const [dateOptionsSelectOpen, setDateOptionsSelectOpen] = useState(false);
  const [dateOptionId, setDateOptionId] = useState(incomeToEdit?.dateString ? DATE_OPTION.CHOOSE_DATE : DATE_OPTION.TODAY);
  const [dateOptions, setDateOptions] = useState(DATE_OPTIONS);

  const [dateString, setDateString] = useState(incomeToEdit?.dateString || dateToDateString(new Date()));
  const [dateDisabled, setDateDisabled] = useState(false);

  const [amount, setAmount] = useState(incomeToEdit?.amount ? String(incomeToEdit.amount) : '');
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
      setDateString(incomeToEdit?.dateString || dateToDateString(todayDate));
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
      setAmountError('Amount can\'t be empty');
      valid = false;
    } else if (isNaN(Number(amount))) {
      setAmountError('Amount can contain only numeric characters');
      valid = false;
    } else {
      setAmountError('');
    }

    return valid;
  }

  function isValid () {
    const nameValid = validateName();
    const amountValid = validateAmount();

    return nameValid && amountValid;
  }

  function onSave () {
    if (isValid()) {
      if (incomeToEdit) {
        // update
        const [oldYear, oldMonth, oldDay] = incomeToEdit.dateString.split('-').map(string => Number(string));
        const oldWeek = getWeekNumberByDayNumber(oldDay);

        const [year, month, day] = dateString.split('-').map(string => Number(string));
        const week = getWeekNumberByDayNumber(day);

        const incomeToUpdate = {
          id: incomeToEdit.id,
          name,
          dateString, // new date
          year,
          month,
          week,
          amount: parseFloat(amount),
        };

        onUpdate(oldYear, oldMonth, oldWeek, incomeToUpdate);
      } else {
        // create
        const [year, month, day] = dateString.split('-').map(string => Number(string));
        const week = getWeekNumberByDayNumber(day);

        const incomeToSave = {
          name,
          dateString,
          year,
          month,
          week,
          amount: parseFloat(amount),
        };

        onCreate(incomeToSave);
      }
    }
  }

  async function onCreate (income) {
    const {
      success,
      income: savedIncome,
      totals,
    } = await addIncome(income);

    if (success && savedIncome && totals) {
      dispatch(addIncomeAction({
        year: savedIncome.year,
        month: savedIncome.month,
        week: savedIncome.week,
        income: savedIncome,
      }));

      dispatch(setIncomesTotalsAction(totals));

      dispatch(showToastAction({
        message: 'Saved',
        type: TOAST_TYPE.INFO,
      }));
    } else {
      dispatch(showToastAction({
        message: 'Failed to add an income. Please try again.',
        type: TOAST_TYPE.ERROR,
      }));
    }
  }

  async function onUpdate (oldYear, oldMonth, oldWeek, income) {
    const {
      success,
      totals,
    } = await updateIncome(income);

    if (success && totals) {
      dispatch(updateIncomeAction({
        year: oldYear,
        month: oldMonth,
        week: oldWeek,
        income,
      }));

      const needToDeleteOldIncome = (
        oldYear !== income.year
        || oldMonth !== income.month
        || oldWeek !== income.week
      );

      if (needToDeleteOldIncome) {
        // the income has been moved to a new date, so we should delete the old object
        dispatch(deleteIncomeAction({
          year: oldYear,
          month: oldMonth,
          week: oldWeek,
          income,
        }));
      }

      dispatch(setIncomesTotalsAction(totals));

      dispatch(showToastAction({
        message: 'Updated',
        type: TOAST_TYPE.INFO,
      }));
    } else {
      dispatch(showToastAction({
        message: 'Failed to update the income. Please try again.',
        type: TOAST_TYPE.ERROR,
      }));
    }
  }

  async function onDelete () {
    const {
      success,
      totals,
    } = await deleteIncome(incomeToEdit);

    if (success && totals) {
      dispatch(deleteIncomeAction({
        year: incomeToEdit.year,
        month: incomeToEdit.month,
        week: incomeToEdit.week,
        income: incomeToEdit,
      }));

      dispatch(setIncomesTotalsAction(totals));

      dispatch(showToastAction({
        message: 'Deleted',
        type: TOAST_TYPE.INFO,
      }));
    } else {
      dispatch(showToastAction({
        message: 'Failed to delete the income. Please try again.',
        type: TOAST_TYPE.ERROR,
      }));
    }
  }

  const formIsInvalid = (!!nameError || !name.length) || (!!amountError || !amount.length);

  return (
    <Modal
      contentStyle={styles.incomeScreen}
      title={incomeToEdit ? 'Edit an income' : 'Add an income' }
      disableSave={formIsInvalid}
      onSave={onSave}
      onDelete={incomeToEdit ? onDelete : undefined}
    >
      <Input
        style={styles.formElement}
        label='Name'
        placeholder='Paycheck'
        inputType={INPUT_TYPE.DEFAULT}
        value={name}
        errorText={nameError}
        onChange={setName}
        onBlur={validateName}
      />

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
    </Modal>
  );
}

const styles = StyleSheet.create({
  incomeScreen: {
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

  amountContainer: {
    width: Platform.select({ web: '50%', ios: '100%' }),
    paddingLeft: Platform.select({ web: 16 }),
  },
});
