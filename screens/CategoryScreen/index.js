import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Modal from '../../components/Modal';
import Input, { INPUT_TYPE } from '../../components/Input';
import { addCategoryAction } from '../../redux/reducers/categories';

export default function CategoryScreen () {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  const [description, setDescription] = useState('');

  const dispatch = useDispatch();
  const navigation = useNavigation();

  function validate () {
    let valid = true;

    if (!name.trim().length) {
      setNameError('Name can\'t be empty');
      valid = false;
    } else {
      setNameError('');
    }

    return valid;
  }

  function onSave () {
    const isValid = validate();

    if (isValid) {
      dispatch(addCategoryAction({
        id: `${Math.floor(Math.random() * 100000)}`,
        name,
        description,
      }));
    }
  }

  function onClose () {
    navigation.navigate('Expense', { preselectedCategory: 'last' });
  }

  return (
    <Modal
      contentStyle={styles.categoryScreen}
      title='New category'
      maxWidth={568}
      onSave={onSave}
      onCloseRequest={onClose}
      disableSave={!!nameError}
    >
      <Input
        style={styles.formElement}
        label='Name'
        placeholder='Food'
        inputType={INPUT_TYPE.DEFAULT}
        value={name}
        onChange={setName}
        onBlur={validate}
        autoFocus
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
