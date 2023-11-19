import { useState, useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/Modal';
import Input, { INPUT_TYPE } from '../../components/Input';
import Dropdown from '../../components/Dropdown';
import { ICON_COLLECTION } from '../../components/Icon';
import IconButton from '../../components/IconButton';
import DatePicker, { dateToDateString } from '../../components/DatePicker';
import { addExpenseAction } from '../../redux/reducers/expenses';
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
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const categoriesList = useSelector(state => state.categories);

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  const [categorySelectOpen, setCategorySelectOpen] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [categories, setCategories] = useState(storedCategoryToDropdownItems(categoriesList));

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

  const route = useRoute();
  const preselectedCategory = route.params?.preselectedCategory || ''; // 'first' or 'last'

  useEffect(() => {
    setCategories(storedCategoryToDropdownItems(categoriesList));

    if (preselectedCategory === 'first' && categoriesList.length > 0) {
      setCategoryId(categoriesList?.[0]?.id);
    } else if (preselectedCategory === 'last' && categoriesList.length > 0) {
      setCategoryId(categoriesList?.[categoriesList.length - 1]?.id);
    }
  }, [categoriesList]);

  useEffect(() => {
    if (dateOptionId === DATE_OPTION.TODAY) {
      setDateString(dateToDateString(todayDate));
      setDateDisabled(true);
    } else if (dateOptionId === DATE_OPTION.YESTERDAY) {
      const yesterdayDate = new Date(todayDate.setDate(todayDate.getDate() - 1));
      setDateString(dateToDateString(yesterdayDate));
      setDateDisabled(true);
    } else {
      setDateString(dateToDateString(todayDate));
      setDateDisabled(false);
    }
  }, [dateOptionId]);

  function onAddCategory () {
    navigation.navigate('Category');
  }

  function storedCategoryToDropdownItems (categoriesList) {
    return categoriesList.map(category => ({
      value: category.id,
      label: category.name,
      description: category.description,
    }));
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

      dispatch(addExpenseAction({
        year,
        month,
        week,
        expense: {
          id: `${Math.floor(Math.random() * 100000)}`,
          name,
          categoryId,
          dateString,
          amount: parseFloat(amount),
        },
      }));
    }
  }

  const formIsInvalid = (!!nameError || !name.length) || (!!amountError || !amount.length);

  return (
    <Modal
      contentStyle={styles.expenseScreen}
      title='Add an Expense'
      disableSave={formIsInvalid}
      onSave={onSave}
    >
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
        <Dropdown
          style={styles.formElement}
          label='Category'
          placeholder='Select a category'
          open={categorySelectOpen}
          setOpen={setCategorySelectOpen}
          value={categoryId}
          setValue={setCategoryId}
          items={categories}
          setItems={setCategories}
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
