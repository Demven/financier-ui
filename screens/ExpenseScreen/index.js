import { useState } from 'react';
import { StyleSheet } from 'react-native';
import Modal from '../../components/Modal';
import Input, { KEYBOARD_TYPE } from '../../components/Input';

export default function ExpenseScreen () {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  return (
    <Modal
      style={styles.expenseScreen}
      title='Add an Expense'
    >
      <Input
        label='Name'
        keyboardType={KEYBOARD_TYPE.DEFAULT}
        value={name}
        placeholder='Latte'
        onChange={setName}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  expenseScreen: {},
});
