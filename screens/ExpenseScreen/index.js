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

const DATE_OPTIONS = [
  { id: '123', name: 'Today' },
  { id: '234', name: 'Yesterday' },
  { id: '345', name: 'Choose a Date' },
];

export default function ExpenseScreen () {
  const [name, setName] = useState('');
  const navigation = useNavigation();

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

  const [dateOptionsSelectOpen, setDateOptionsSelectOpen] = useState(false);
  const [dateOptions, setDateOptions] = useState(DATE_OPTIONS.map(dateOption => ({
    label: dateOption.name,
    value: dateOption.id,
  })));
  const [dateOptionId, setDateOptionId] = useState(dateOptions[0].value);

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
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },

  formElement: {
    flexShrink: 1,
  },

  addButton: {
    width: 46,
    height: 46,
    marginLeft: 16,
  },

  amountInput: {
    width: Platform.select({ web: '50%', ios: '100%' }),
    flexGrow: 0,
  },
});
