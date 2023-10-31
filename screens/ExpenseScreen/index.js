import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
// import { DatePickerModal } from 'react-native-paper-dates';
import Modal from '../../components/Modal';
import Input, { INPUT_TYPE } from '../../components/Input';
// import Button, { BUTTON_LOOK } from '../../components/Button';
import Dropdown from '../../components/Dropdown';
import { ICON_COLLECTION } from '../../components/Icon';
import IconButton from '../../components/IconButton';
import { COLOR } from '../../styles/colors';
import { useNavigation } from "@react-navigation/native";

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

const DATE_OPTIONS = [
  { value: '123', label: 'Today' },
  { value: '234', label: 'Yesterday' },
  { value: '345', label: 'Choose a Date' },
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
  const [dateOptionId, setDateOptionId] = useState(DATE_OPTIONS[0].value);
  const [dateOptions, setDateOptions] = useState(DATE_OPTIONS);

  const [amount, setAmount] = useState('');

  // const [datePickerOpen, setDatePickerOpen] = useState(false);
  // const [date, setDate] = useState(new Date());
  //
  // function onPickDate ({ date }) {
  //   setDate(date);
  //   setDatePickerOpen(false);
  // }

  function onAddCategory () {
    navigation.navigate('Categories'); // TODO: open Add Category modal
  }

  function onAddSubcategory () {
    navigation.navigate('Categories'); // TODO: open Add Sub Category modal
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
          placeholder='Group expenses'
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
        <Dropdown
          style={styles.formElement}
          label='Date'
          open={dateOptionsSelectOpen}
          setOpen={setDateOptionsSelectOpen}
          value={dateOptionId}
          setValue={setDateOptionId}
          items={dateOptions}
          setItems={setDateOptions}
        />
      </View>

      <View style={styles.formRow}>
        <Input
          style={styles.amountInput}
          label='Amount'
          placeholder='0.01'
          inputType={INPUT_TYPE.CURRENCY}
          value={amount}
          onChange={setAmount}
        />
      </View>

{/*      <Button
        look={BUTTON_LOOK.SECONDARY}
        text='Choose Date'
        onPress={() => setDatePickerOpen(true)}
      />*/}

      {/*<DatePickerModal*/}
      {/*  visible={datePickerOpen}*/}
      {/*  date={date}*/}
      {/*  locale='en'*/}
      {/*  mode='single'*/}
      {/*  onConfirm={onPickDate}*/}
      {/*  onDismiss={() => setDatePickerOpen(false)}*/}
      {/*  animationType='fade'*/}
      {/*  inputEnabled={false}*/}
      {/*/>*/}
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

  addButton: {
    width: 46,
    height: 46,
    marginLeft: 16,
    marginTop: 28,
  },

  amountInput: {
    width: Platform.select({ web: '50%', ios: '100%' }),
    flexGrow: 0,
  },
});
