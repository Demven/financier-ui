import { useState, useEffect } from 'react';
import {
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {
  useNavigation,
  useRouter,
  useGlobalSearchParams,
} from 'expo-router';
import { useDispatch } from 'react-redux';
import Modal from '../../components/Modal';
import Input, { INPUT_TYPE } from '../../components/Input';
import Dropdown from '../../components/Dropdown';
import { ICON_COLLECTION } from '../../components/Icon';
import IconButton from '../../components/IconButton';
import DatePicker from '../../components/DatePicker';
import CategoryDropdown, { PRESELECTED_CATEGORY } from '../../components/CategoryDropdown';
import Loader from '../../components/Loader';
import {
  addExpenseAction,
  updateExpenseAction,
  setExpensesTotalsAction,
  deleteExpenseAction,
} from '../../redux/reducers/expenses';
import { showToastAction, TOAST_TYPE } from '../../redux/reducers/ui';
import { dateToDateString, getWeekNumberByDayNumber } from '../../services/date';
import {
  fetchExpenseById,
  addExpense,
  updateExpense,
  deleteExpense,
} from '../../services/api/expense';
import { COLOR } from '../../styles/colors';

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

export default function ExpenseScreen () {
  const params = useGlobalSearchParams();
  const expenseId = params?.id ? parseInt(params.id, 10) : undefined;
  const preselectedCategory = params?.preselectedCategory || PRESELECTED_CATEGORY.FIRST;

  const router = useRouter();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const canGoBack = router.canGoBack();

  const [loading, setLoading] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState();

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  const [categoryId, setCategoryId] = useState(null);

  const [dateOptionsSelectOpen, setDateOptionsSelectOpen] = useState(false);
  const [dateOptionId, setDateOptionId] = useState(DATE_OPTION.TODAY);
  const [dateOptions, setDateOptions] = useState(DATE_OPTIONS);

  const [dateString, setDateString] = useState(dateToDateString(new Date()));
  const [dateDisabled, setDateDisabled] = useState(false);

  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');

  const todayDate = new Date();
  todayDate.setHours(0);
  todayDate.setMinutes(0);
  todayDate.setSeconds(0);

  const title = expenseToEdit ? 'Edit an expense' : 'Add an expense';

  useEffect(() => {
    navigation.setOptions({
      title,
    });
  }, [navigation, title]);

  useEffect(() => {
    if (expenseId && !expenseToEdit) {
      fetchExpense(expenseId);
    }
  }, [expenseId]);

  useEffect(() => {
    if (expenseToEdit && expenseId === expenseToEdit?.id) {
      setName(expenseToEdit?.name || '');
      setCategoryId(expenseToEdit?.categoryId || null);
      setDateOptionId(expenseToEdit?.dateString ? DATE_OPTION.CHOOSE_DATE : DATE_OPTION.TODAY);
      setDateString(expenseToEdit?.dateString || dateToDateString(new Date()));
      setAmount(expenseToEdit?.amount ? String(expenseToEdit.amount) : '');
    }
  }, [expenseToEdit]);

  useEffect(() => {
    if (dateOptionId === DATE_OPTION.TODAY) {
      setDateString(dateToDateString(todayDate));
      setDateDisabled(true);
    } else if (dateOptionId === DATE_OPTION.YESTERDAY) {
      const yesterdayDate = new Date(todayDate.setDate(todayDate.getDate() - 1));
      setDateString(dateToDateString(yesterdayDate));
      setDateDisabled(true);
    } else {
      setDateString(expenseToEdit?.dateString || dateToDateString(todayDate));
      setDateDisabled(false);
    }
  }, [dateOptionId]);

  async function fetchExpense (id) {
    setLoading(true);
    const expenseToEdit = await fetchExpenseById(id);

    setExpenseToEdit(expenseToEdit);

    setLoading(false);
  }

  function onAddCategory () {
    router.push('/category');
  }

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
      if (expenseToEdit) {
        // update
        const [oldYear, oldMonth, oldDay] = expenseToEdit.dateString.split('-').map(string => Number(string));
        const oldWeek = getWeekNumberByDayNumber(oldDay);

        const [year, month, day] = dateString.split('-').map(string => Number(string));
        const week = getWeekNumberByDayNumber(day);

        const expenseToUpdate = {
          id: expenseToEdit.id,
          name,
          categoryId,
          dateString, // new date
          year,
          month,
          week,
          amount: parseFloat(amount),
        };

        onUpdate(oldYear, oldMonth, oldWeek, expenseToUpdate);
      } else {
        // create
        const [year, month, day] = dateString.split('-').map(string => Number(string));
        const week = getWeekNumberByDayNumber(day);

        const expenseToSave = {
          name,
          categoryId,
          dateString,
          year,
          month,
          week,
          amount: parseFloat(amount),
        };

        onCreate(expenseToSave);
      }
    }
  }

  async function onCreate (expense) {
    const {
      success,
      expense: savedExpense,
      totals,
    } = await addExpense(expense);

    if (success && savedExpense && totals) {
      dispatch(addExpenseAction({
        year: savedExpense.year,
        month: savedExpense.month,
        week: savedExpense.week,
        expense: savedExpense,
      }));

      dispatch(setExpensesTotalsAction(totals));

      dispatch(showToastAction({
        message: 'Saved',
        type: TOAST_TYPE.INFO,
      }));
    } else {
      dispatch(showToastAction({
        message: 'Failed to add an expense. Please try again.',
        type: TOAST_TYPE.ERROR,
      }));
    }
  }

  async function onUpdate (oldYear, oldMonth, oldWeek, expense) {
    const {
      success,
      totals,
    } = await updateExpense(expense);

    if (success && totals) {
      dispatch(updateExpenseAction({
        year: oldYear,
        month: oldMonth,
        week: oldWeek,
        expense,
      }));

      const needToDeleteOldExpense = (
        oldYear !== expense.year
        || oldMonth !== expense.month
        || oldWeek !== expense.week
      );

      if (needToDeleteOldExpense) {
        // the expense has been moved to a new date, so we should delete the old object
        dispatch(deleteExpenseAction({
          year: oldYear,
          month: oldMonth,
          week: oldWeek,
          expense,
        }));
      }

      dispatch(setExpensesTotalsAction(totals));

      dispatch(showToastAction({
        message: 'Updated',
        type: TOAST_TYPE.INFO,
      }));
    } else {
      dispatch(showToastAction({
        message: 'Failed to update the expense. Please try again.',
        type: TOAST_TYPE.ERROR,
      }));
    }
  }

  async function onDelete () {
    const {
      success,
      totals,
    } = await deleteExpense(expenseToEdit);

    if (success && totals) {
      dispatch(deleteExpenseAction({
        year: expenseToEdit.year,
        month: expenseToEdit.month,
        week: expenseToEdit.week,
        expense: expenseToEdit,
      }));

      dispatch(setExpensesTotalsAction(totals));

      dispatch(showToastAction({
        message: 'Deleted',
        type: TOAST_TYPE.INFO,
      }));
    } else {
      dispatch(showToastAction({
        message: 'Failed to delete the expense. Please try again.',
        type: TOAST_TYPE.ERROR,
      }));
    }
  }

  function onClose () {
    if (canGoBack) {
      router.back();
    } else {
      router.push('/');
    }
  }

  const formIsInvalid = (!!nameError || !name.length) || (!!amountError || !amount.length);

  return (
    <Modal
      contentStyle={styles.expenseScreen}
      title={expenseToEdit ? 'Edit an expense' : 'Add an expense' }
      disableSave={formIsInvalid}
      onSave={onSave}
      onDelete={expenseToEdit ? onDelete : undefined}
      onCloseRequest={onClose}
    >
      <Loader loading={loading} />

      <Input
        style={styles.formElement}
        label='Name'
        placeholder='Latte'
        inputType={INPUT_TYPE.DEFAULT}
        value={name}
        errorText={nameError}
        onChange={setName}
        onBlur={validateName}
        autoFocus
      />

      <View style={[styles.formRow, { zIndex: 30 }]}>
        <CategoryDropdown
          style={styles.formElement}
          categoryId={categoryId}
          preselectedCategory={expenseToEdit ? undefined : preselectedCategory}
          onSelect={setCategoryId}
        />

        <IconButton
          style={styles.addButton}
          iconName='add-circle-outline'
          iconCollection={ICON_COLLECTION.IONICONS}
          size={32}
          color={COLOR.BLACK}
          onPress={onAddCategory}
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
  expenseScreen: {
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

  addButton: {
    width: 46,
    height: 46,
    marginLeft: 16,
    marginTop: 28,
  },

  amountContainer: {
    width: Platform.select({ web: '50%', ios: '100%' }),
    paddingLeft: Platform.select({ web: 16 }),
  },
});
