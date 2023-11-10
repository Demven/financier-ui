import { useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import Modal from '../../components/Modal';
import Input, { INPUT_TYPE } from '../../components/Input';

export default function SubcategoryScreen () {
  const [name, setName] = useState('');

  return (
    <Modal
      contentStyle={styles.subcategoryScreen}
      title='Create an Expense group'
      maxWidth={568}
    >
      <Input
        label='Name'
        placeholder='Lunch'
        inputType={INPUT_TYPE.DEFAULT}
        value={name}
        onChange={setName}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  subcategoryScreen: {
    paddingTop: Platform.select({ web: 48 }),
    paddingBottom: Platform.select({ web: 80 }),
  },
});
