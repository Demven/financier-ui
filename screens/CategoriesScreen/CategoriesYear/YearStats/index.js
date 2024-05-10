import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import CategoryCompareStats from '../../CategoryCompareStats/CategoryCompareStats';

YearStats.propTypes = {
  style: PropTypes.any,
  categories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })).isRequired,
  expensesTotalsGroupedByCategoryId: PropTypes.object.isRequired,
  previousYearExpensesTotalsGroupedByCategoryId: PropTypes.object.isRequired,
  previousYear: PropTypes.number,
  yearIncome: PropTypes.number.isRequired,
  selectedCategoryId: PropTypes.number,
  onSelectCategoryId: PropTypes.func,
};

export default function YearStats (props) {
  const {
    style,
    categories,
    expensesTotalsGroupedByCategoryId,
    previousYearExpensesTotalsGroupedByCategoryId,
    previousYear,
    yearIncome,
    selectedCategoryId,
    onSelectCategoryId,
  } = props;

  const allTimeYearAverage = useSelector(state => state.expenses.expensesTotals.yearAverage);

  return (
    <View style={[styles.yearStats, style]}>
      {categories.map((category, index) => {
        const totalExpenses = expensesTotalsGroupedByCategoryId[category.id] || 0;
        const previousYearTotalExpenses = previousYearExpensesTotalsGroupedByCategoryId[category.id] || 0;

        return (
          <CategoryCompareStats
            key={category.id}
            style={[styles.compareStats, index === 0 && { marginTop: 0 }]}
            category={category}
            compareWhat={-totalExpenses}
            compareTo={yearIncome}
            previousResult={-previousYearTotalExpenses}
            previousResultName={previousYear}
            allTimeAverage={-allTimeYearAverage}
            selected={selectedCategoryId === category.id}
            onPress={() => onSelectCategoryId(category.id)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  yearStats: {
    width: '100%',
    paddingLeft: 40,
  },

  compareStats: {
    marginTop: 40,
  },
});
