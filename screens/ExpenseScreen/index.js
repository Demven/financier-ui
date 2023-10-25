import { useState } from 'react';
import { StyleSheet } from 'react-native';
import Modal from '../../components/Modal';
import Input, { KEYBOARD_TYPE } from '../../components/Input';
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

  return (
    <Modal
      style={styles.expenseScreen}
      title='Add an Expense'
    >
      <Input
        label='Name'
        placeholder='Latte'
        keyboardType={KEYBOARD_TYPE.DEFAULT}
        value={name}
        onChange={setName}
      />

      <Dropdown
        style={styles.dropdown}
        label='Category'
        placeholder='Select a category'
        open={categorySelectOpen}
        setOpen={setCategorySelectOpen}
        value={categoryId}
        setValue={setCategoryId}
        items={categories}
        setItems={setCategories}
      />

      <Dropdown
        style={styles.dropdown}
        label='Subcategory'
        placeholder='Group expenses by subcategory'
        open={subcategorySelectOpen}
        setOpen={setSubcategorySelectOpen}
        value={subcategoryId}
        setValue={setSubcategoryId}
        items={subcategories}
        setItems={setSubcategories}
      />

      <Input
        style={styles.input}
        label='Amount'
        placeholder='0.01'
        keyboardType={KEYBOARD_TYPE.NUMBER}
        value={amount}
        onChange={setAmount}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  expenseScreen: {},

  dropdown: {
    marginTop: 32,
  },

  input: {
    marginTop: 32,
  },
});
