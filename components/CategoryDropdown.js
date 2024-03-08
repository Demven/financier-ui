import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Dropdown from './Dropdown';

export const SHOW_ALL_CATEGORY_ID = 'all';
export const PRESELECTED_CATEGORY = {
  FIRST: 'first',
  LAST: 'first',
};

CategoryDropdown.propTypes = {
  style: PropTypes.any,
  categoryId: PropTypes.string,
  preselectedCategory: PropTypes.oneOf([
    PRESELECTED_CATEGORY.FIRST,
    PRESELECTED_CATEGORY.LAST,
  ]),
  placeholderStyle: PropTypes.any,
  includeCategoryIds: PropTypes.arrayOf(PropTypes.string),
  showAll: PropTypes.bool,
  onSelect: PropTypes.func,
};

export default function CategoryDropdown (props) {
  const {
    style,
    categoryId,
    preselectedCategory,
    placeholderStyle,
    includeCategoryIds,
    showAll,
    onSelect = () => {},
  } = props;

  const categoriesList = storedCategoryToDropdownItems([
    showAll ? {
      id: SHOW_ALL_CATEGORY_ID,
      name: 'Show All',
      description: '',
    } : undefined,
    ...useSelector(state => state.categories)
      .filter(category => !!includeCategoryIds?.length
        ? includeCategoryIds.includes(category.id)
        : true
      ),
  ].filter(Boolean));

  const [categorySelectOpen, setCategorySelectOpen] = useState(false);
  const [categories, setCategories] = useState(categoriesList);

  useEffect(() => {
    if (preselectedCategory === PRESELECTED_CATEGORY.FIRST && categoriesList.length > 0) {
      onSelect(categories?.[0]?.value);
    } else if (preselectedCategory === PRESELECTED_CATEGORY.LAST && categoriesList.length > 0) {
      onSelect(categories?.[categoriesList.length - 1]?.value);
    }
  }, [categories]);

  function storedCategoryToDropdownItems (categoriesList) {
    return categoriesList.map(category => ({
      value: category.id,
      label: category.name,
      description: category.description,
    }));
  }

  return (
    <Dropdown
      style={[styles.categoryDropdown, style]}
      label='Category'
      placeholder='Select a category'
      placeholderStyle={placeholderStyle}
      open={categorySelectOpen}
      setOpen={setCategorySelectOpen}
      value={categoryId}
      setValue={selectedCategoryId => onSelect(selectedCategoryId)}
      items={categories}
      setItems={setCategories}
    />
  );
}

const styles = StyleSheet.create({
  categoryDropdown: {
    width: 300,
    zIndex: 10,
  },
});
