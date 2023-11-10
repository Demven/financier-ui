import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Modal from '../../components/Modal';
import Input, { INPUT_TYPE } from '../../components/Input';

export default function CategoryScreen () {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <Modal
      contentStyle={styles.categoryScreen}
      title='Create a Category'
      maxWidth={568}
    >
      <Input
        style={styles.formElement}
        label='Name'
        placeholder='Food'
        inputType={INPUT_TYPE.DEFAULT}
        value={name}
        onChange={setName}
      />

      <View style={styles.formRow}>
        <Input
          style={styles.formElement}
          label='Description'
          placeholder='Groceries, cafes, coffee shops, lunches, etc.'
          inputType={INPUT_TYPE.DEFAULT}
          value={description}
          onChange={setDescription}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  categoryScreen: {
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
});
