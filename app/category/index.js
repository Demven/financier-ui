import { useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGlobalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router';
import Modal from '../../components/Modal';
import Input, { INPUT_TYPE } from '../../components/Input';
import ColorPicker from '../../components/ColorPicker';
import Loader from '../../components/Loader';
import { PRESELECTED_CATEGORY } from '../../components/CategoryDropdown';
import { addCategoryAction, updateCategoryAction } from '../../redux/reducers/categories';
import { addColorAction, deleteColorAction } from '../../redux/reducers/colors';
import { showToastAction, TOAST_TYPE } from '../../redux/reducers/ui';
import { addColor, deleteColor } from '../../services/api/color';
import {
  fetchCategoryById,
  addCategory,
  updateCategory,
} from '../../services/api/category';
import { MEDIA } from '../../styles/media';

export default function CategoryScreen () {
  const params = useGlobalSearchParams();
  const categoryId = params.id ? Number(params.id) : undefined;

  const router = useRouter();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const canGoBack = router.canGoBack();

  const [loading, setLoading] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState();

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const colors = useSelector(state => state.colors);

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  const [description, setDescription] = useState('');

  const [color, setColor] = useState();
  const [colorError, setColorError] = useState('');

  const title = categoryToEdit ? 'Edit a category' : 'Create a category';

  useEffect(() => {
    navigation.setOptions({
      title,
    });
  }, [navigation, title]);

  useEffect(() => {
    if (categoryId && !categoryToEdit) {
      fetchCategory(categoryId);
    }
  }, [categoryId]);

  useEffect(() => {
    if (categoryToEdit && categoryId === categoryToEdit?.id) {
      setName(categoryToEdit?.name || '');
      setDescription(categoryToEdit?.description || '');
      setColor(categoryToEdit?.colorId ? getColorById(categoryToEdit.colorId) : undefined);
    }
  }, [categoryToEdit]);

  async function fetchCategory (id) {
    setLoading(true);
    const categoryToEdit = await fetchCategoryById(id);

    setCategoryToEdit(categoryToEdit);

    setLoading(false);
  }

  function getColorById (id) {
    return colors.find(color => color.id === id);
  }

  function validate () {
    let valid = true;

    if (!name.trim().length) {
      setNameError('Name can\'t be empty');
      valid = false;
    } else if (!color) {
      setColorError('Select a color');
      valid = false;
    } else {
      setNameError('');
    }

    return valid;
  }

  async function onSave () {
    const isValid = validate();

    if (isValid) {
      if (categoryToEdit) {
        const categoryToUpdate = {
          ...categoryToEdit,
          name,
          description,
          colorId: color.id,
        };

        const { success } = await updateCategory(categoryToUpdate);

        if (success) {
          dispatch(updateCategoryAction(categoryToUpdate));
        } else {
          dispatch(showToastAction({
            message: 'Failed to update the category. Please try again.',
            type: TOAST_TYPE.ERROR,
          }));
        }
      } else {
        const categoryToSave = {
          name,
          description,
          colorId: color.id,
        };

        const { success, category: savedCategory } = await addCategory(categoryToSave);

        if (success) {
          dispatch(addCategoryAction(savedCategory));
        } else {
          dispatch(showToastAction({
            message: 'Failed to save the category. Please try again.',
            type: TOAST_TYPE.ERROR,
          }));
        }
      }
    }
  }

  async function onAddCustomColor (colorToSave) {
    const { success, color } = await addColor(colorToSave);

    if (success) {
      dispatch(addColorAction(color));
    } else {
      dispatch(showToastAction({
        message: 'Failed to save the new color. Please try again.',
        type: TOAST_TYPE.ERROR,
      }));
    }
  }

  async function onDeleteCustomColor (colorToDelete) {
    // can delete the color only after updating the color to the default one for the current category
    if (categoryToEdit) {
      dispatch(updateCategoryAction({
        id: categoryToEdit.id,
        name,
        description,
        colorId: colors[0].id,
      }));
    }

    const { success } = await deleteColor(colorToDelete);

    if (success) {
      dispatch(deleteColorAction(colorToDelete));
    } else {
      dispatch(showToastAction({
        message: 'Failed to delete the color. Please try again.',
        type: TOAST_TYPE.ERROR,
      }));
    }
  }

  function onClose () {
    if (canGoBack) {
      router.back();
    } else {
      router.push({
        pathname: '/expense',
        params: { preselectedCategory: PRESELECTED_CATEGORY.LAST },
      });
    }
  }

  return (
    <Modal
      contentStyle={[styles.categoryScreen, {
        paddingTop: Platform.select({ web: windowWidth <= MEDIA.WIDE_MOBILE ? 0 : 12 }),
        paddingBottom: Platform.select({ web: windowWidth <= MEDIA.WIDE_MOBILE ? 32 : 48 }),
        paddingRight: windowWidth <= MEDIA.TABLET ? 0 : 52,
      }]}
      title={categoryToEdit ? 'Edit category' : 'New category' }
      maxWidth={568}
      onSave={onSave}
      onCloseRequest={onClose}
      disableSave={!!nameError || !name.length || !!colorError}
    >
      <Loader loading={loading} />

      <ScrollView style={styles.scrollView}>
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
              errorText={colorError}
              onChange={setColor}
              onAddCustomColor={onAddCustomColor}
              onDeleteCustomColor={onDeleteCustomColor}
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
  },

  scrollView: {
    width: '100%',
    maxHeight: 500,
  },

  formRow: {
    width: '100%',
    flexDirection: 'row',
    flexGrow: 1,
    marginTop: 32,
    justifyContent: 'flex-end',
  },

  formElement: {
    width: '100%',
    flexShrink: 1,
  },
});
