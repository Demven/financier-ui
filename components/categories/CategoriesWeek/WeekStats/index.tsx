import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import CategoryCompareStats from '../../CategoryCompareStats/CategoryCompareStats';

WeekStats.propTypes = {
  style: PropTypes.any,
  categories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    colorId: PropTypes.number.isRequired,
  })).isRequired,
  monthIncome: PropTypes.number.isRequired,
  expensesTotalsGroupedByCategoryId: PropTypes.object.isRequired,
  previousWeekExpensesTotalsGroupedByCategoryId: PropTypes.object.isRequired,
  previousMonthName: PropTypes.string,
  selectedCategoryId: PropTypes.number,
  onSelectCategoryId: PropTypes.func,
};

export default function WeekStats (props) {
  const {
    style,
    categories,
    expensesTotalsGroupedByCategoryId,
    previousWeekExpensesTotalsGroupedByCategoryId,
    monthIncome,
    previousMonthName,
    selectedCategoryId,
    onSelectCategoryId,
  } = props;

  const allTimeWeekAverage = useSelector(state => state.expenses.expensesTotals.weekAverage);

  return (
    <View style={[styles.weekStats, style]}>
      {categories.map((category, index) => {
        const totalExpenses = expensesTotalsGroupedByCategoryId[category.id] || 0;
        const previousWeekTotalExpenses = previousWeekExpensesTotalsGroupedByCategoryId[category.id] || 0;

        if (totalExpenses === 0) {
          return null;
        }

        return (
          <CategoryCompareStats
            key={category.id}
            style={[styles.compareStats, index === 0 && { marginTop: 0 }]}
            category={category}
            compareWhat={-totalExpenses}
            compareTo={monthIncome}
            previousResult={-previousWeekTotalExpenses}
            previousResultName={previousMonthName}
            allTimeAverage={-allTimeWeekAverage}
            selected={selectedCategoryId === category.id}
            onPress={() => onSelectCategoryId(category.id)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  weekStats: {
    width: '100%',
    paddingLeft: 40,
  },

  compareStats: {
    marginTop: 40,
  },
});
