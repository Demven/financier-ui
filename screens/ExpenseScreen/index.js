import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
// import { DatePickerModal } from 'react-native-paper-dates';
import Modal from '../../components/Modal';
import Input, { INPUT_TYPE } from '../../components/Input';
// import Button, { BUTTON_LOOK } from '../../components/Button';
import Dropdown from '../../components/Dropdown';

const CATEGORIES = [
  { id: '123', name: 'Primary Expenses', description: 'Food, clothes, transport, medicine, taxes, mobile, internet, etc.' },
  { id: '234', name: 'Secondary Expenses', description: 'Home goods, furniture, renovation, car, hobbies, etc.' },
  { id: '345', name: 'Housing', description: 'Mortgage, rent, insurance' },
  { id: '456', name: 'Entertainment', description: 'Dining, bars, night clubs, concerts, casual trips, etc.' },
  { id: '567', name: 'Gifts & Charity', description: 'Donations, presents, street musicians, etc.' },
];

const SUBCATEGORIES = [
  { id: '123', name: 'Lunch' },
  { id: '234', name: 'Dining' },
  { id: '345', name: 'Taxi' },
  { id: '456', name: 'Gas' },
];

export default function ExpenseScreen () {
  const [name, setName] = useState('');

  const [categorySelectOpen, setCategorySelectOpen] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [categories, setCategories] = useState(CATEGORIES.map(category => ({
    label: category.name,
    value: category.id,
  })));

  const [subcategorySelectOpen, setSubcategorySelectOpen] = useState(false);
  const [subcategoryId, setSubcategoryId] = useState(null);
  const [subcategories, setSubcategories] = useState(SUBCATEGORIES.map(subcategory => ({
    label: subcategory.name,
    value: subcategory.id,
  })));

  const [amount, setAmount] = useState('');

  // const [datePickerOpen, setDatePickerOpen] = useState(false);
  // const [date, setDate] = useState(new Date());
  //
  // function onPickDate ({ date }) {
  //   setDate(date);
  //   setDatePickerOpen(false);
  // }

  return (
    <Modal
      style={styles.expenseScreen}
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

      <View style={[styles.formRow, { zIndex: 20 }]}>
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
      </View>

      <View style={[styles.formRow, { zIndex: 10 }]}>
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
  expenseScreen: {},

  formRow: {
    flexGrow: 1,
    marginTop: 32,
    alignItems: 'flex-end',
  },

  formElement: {
    width: '100%',
  },

  amountInput: {
    width: Platform.select({ web: '50%', ios: '100%' }),
  },
});
