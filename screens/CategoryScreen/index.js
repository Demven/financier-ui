import { useState } from 'react';
import {
  Platform,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Modal from '../../components/Modal';
import Input, { INPUT_TYPE } from '../../components/Input';
import ColorPicker from '../../components/ColorPicker';
import { addCategoryAction } from '../../redux/reducers/categories';
import { MEDIA } from '../../styles/media';

export default function CategoryScreen () {
  const windowWidth = useSelector(state => state.ui.windowWidth);

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  const [description, setDescription] = useState('');
  const [color, setColor] = useState();

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
      contentStyle={[styles.categoryScreen, {
        paddingTop: Platform.select({ web: windowWidth <= MEDIA.WIDE_MOBILE ? 0 : 48 }),
        paddingBottom: Platform.select({ web: windowWidth <= MEDIA.WIDE_MOBILE ? 32 : 48 }),
        paddingRight: windowWidth <= MEDIA.TABLET ? 0 : 52,
      }]}
      title='New category'
      maxWidth={568}
      onSave={onSave}
      onCloseRequest={onClose}
      disableSave={!!nameError || !name.length}
    >
      <ScrollView>
        <View style={{ flexGrow: 1, paddingBottom: 100 }}>
          <View style={styles.formRow}>
            <Input
              style={styles.formElement}
              label='Name'
              placeholder='Food'
              inputType={INPUT_TYPE.DEFAULT}
              value={name}
              onChange={setName}
              onBlur={validate}
              errorText={nameError}
              autoFocus
            />
          </View>

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

          <View style={styles.formRow}>
            <ColorPicker
              style={styles.formElement}
              label='Color'
              color={color}
              onChange={setColor}
            />
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  categoryScreen: {
    paddingRight: 0,
    paddingLeft: 16,
    alignItems: 'flex-start',
  },

  formRow: {
    width: '100%',
    flexDirection: 'row',
    flexGrow: 1,
    marginTop: 32,
    justifyContent: 'flex-end',
  },

  formElement: {
    flexShrink: 1,
  },
});
