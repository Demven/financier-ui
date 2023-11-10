import { useState, useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Modal from '../../components/Modal';
import Input, { INPUT_TYPE } from '../../components/Input';
import Dropdown from '../../components/Dropdown';
import { ICON_COLLECTION } from '../../components/Icon';
import IconButton from '../../components/IconButton';
import DatePicker, { dateToDateString } from '../../components/DatePicker';
import { COLOR } from '../../styles/colors';

const CATEGORIES = [
  { value: '123', label: 'Primary Expenses', description: 'Food, clothes, transport, medicine, taxes, mobile, internet, etc.' },
  { value: '234', label: 'Secondary Expenses', description: 'Home goods, furniture, renovation, car, hobbies, etc.' },
  { value: '345', label: 'Housing', description: 'Mortgage, rent, insurance' },
  { value: '456', label: 'Entertainment', description: 'Dining, bars, night clubs, concerts, casual trips, etc.' },
  { value: '567', label: 'Gifts & Charity', description: 'Donations, presents, street musicians, etc.' },
];

const SUBCATEGORIES = [
  { value: '123', label: 'Lunch' },
  { value: '234', label: 'Dining' },
  { value: '345', label: 'Taxi' },
  { value: '456', label: 'Gas' },
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

export default function ExpenseScreen () {
  const [name, setName] = useState('');
  const navigation = useNavigation();

  const [categorySelectOpen, setCategorySelectOpen] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [categories, setCategories] = useState(CATEGORIES);

  const [subcategorySelectOpen, setSubcategorySelectOpen] = useState(false);
  const [subcategoryId, setSubcategoryId] = useState(null);
  const [subcategories, setSubcategories] = useState(SUBCATEGORIES);

  const [dateOptionsSelectOpen, setDateOptionsSelectOpen] = useState(false);
  const [dateOptionId, setDateOptionId] = useState(DATE_OPTION.TODAY);
  const [dateOptions, setDateOptions] = useState(DATE_OPTIONS);

  const [dateString, setDateString] = useState(dateToDateString(new Date()));
  const [dateDisabled, setDateDisabled] = useState(false);

  const [amount, setAmount] = useState('');

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
      setDateString(dateToDateString(todayDate));
      setDateDisabled(false);
    }
  }, [dateOptionId]);

  function onAddCategory () {
    navigation.navigate('Category');
  }

  function onAddSubcategory () {
    navigation.navigate('Subcategory');
  }

  function onDateChange (date) {
    setDateString(date);
    setDateError('');
  }

  return (
    <Modal
      contentStyle={styles.expenseScreen}
      title='Add an Expense'
    >
      <Input
        style={styles.formElement}
        label='Name'
        placeholder='Latte'
        inputType={INPUT_TYPE.DEFAULT}
        value={name}
        onChange={setName}
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

      <View style={[styles.formRow, { zIndex: 20 }]}>
        <Dropdown
          style={styles.formElement}
          label='Subcategory'
          placeholder='Group expenses as'
          open={subcategorySelectOpen}
          setOpen={setSubcategorySelectOpen}
          value={subcategoryId}
          setValue={setSubcategoryId}
          items={subcategories}
          setItems={setSubcategories}
        />

        <IconButton
          style={styles.addButton}
          iconName='add-circle-outline'
          iconCollection={ICON_COLLECTION.IONICONS}
          size={32}
          color={COLOR.BLACK}
          onPress={onAddSubcategory}
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
            onChange={onDateChange}
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
            onChange={setAmount}
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
