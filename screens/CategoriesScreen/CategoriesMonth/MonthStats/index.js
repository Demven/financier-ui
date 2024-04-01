import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import CategoryCompareStats from '../../CategoryCompareStats/CategoryCompareStats';
import { COLOR } from '../../../../styles/colors';
import { FONT } from '../../../../styles/fonts';

MonthStats.propTypes = {
  style: PropTypes.any,
  categories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })).isRequired,
  expensesTotalsGroupedByCategoryId: PropTypes.object.isRequired,
  previousMonthExpensesTotalsGroupedByCategoryId: PropTypes.object.isRequired,
  monthIncome: PropTypes.number.isRequired,
  previousMonthName: PropTypes.string,
  selectedCategoryId: PropTypes.number,
  onSelectCategoryId: PropTypes.func,
};

export default function MonthStats (props) {
  const {
    style,
    categories,
    expensesTotalsGroupedByCategoryId,
    previousMonthExpensesTotalsGroupedByCategoryId,
    monthIncome,
    previousMonthName,
    selectedCategoryId,
    onSelectCategoryId,
  } = props;

  const allTimeMonthAverage = useSelector(state => state.expenses.monthAverage);

  return (
    <View style={[styles.monthStats, style]}>
      {categories.map((category, index) => {
        const totalExpenses = expensesTotalsGroupedByCategoryId[category.id] || 0;
        const previousMonthTotalExpenses = previousMonthExpensesTotalsGroupedByCategoryId[category.id] || 0;

        return (
          <CategoryCompareStats
            key={category.id}
            style={[styles.compareStats, index === 0 && { marginTop: 0 }]}
            category={category}
            compareWhat={-totalExpenses}
            compareTo={monthIncome}
            previousResult={-previousMonthTotalExpenses}
            previousResultName={previousMonthName}
            allTimeAverage={-allTimeMonthAverage}
            selected={selectedCategoryId === category.id}
            onPress={() => onSelectCategoryId(category.id)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  monthStats: {
    width: '100%',
    paddingLeft: 40,
  },

  stats: {
    width: '100%',
  },

  statRow: {
    marginTop: 16,
    flexDirection: 'row',
  },

  statName: {
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 20,
    lineHeight: 24,
    color: COLOR.DARK_GRAY,
  },
  statNameBold: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
  },
  statNameSmaller: {
    fontSize: 18,
    lineHeight: 23,
  },

  statValue: {
    marginLeft: 'auto',
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 20,
    lineHeight: 24,
    color: COLOR.DARK_GRAY,
    userSelect: 'text',
  },
  statValueBold: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
  },
  statValueSmaller: {
    fontSize: 18,
    lineHeight: 23,
  },

  compareStats: {
    marginTop: 40,
  },
});
