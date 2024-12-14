import { useMemo, useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import MonthChart from './MonthChart';
import MonthStats from './MonthStats';
import TitleLink from '../../TitleLink';
import FoldedContainer from '../../FoldedContainer';
import { MONTH_NAME } from '../../../services/date';
import { groupExpensesTotalsByCategoryId } from '../../../services/dataItems';
import { FONT } from '../../../styles/fonts';
import { MEDIA } from '../../../styles/media';

CategoriesMonth.propTypes = {
  style: PropTypes.any,
  daysNumber: PropTypes.number.isRequired,
  monthNumber: PropTypes.number.isRequired,
  monthIncome: PropTypes.number,
  monthExpenses: PropTypes.object, // weeks -> expenses { [1]: [], [2]: [] }
  monthExpensesTotal: PropTypes.number,
  previousMonthExpenses: PropTypes.object, // weeks -> expenses { [1]: [], [2]: [] }
  previousMonthName: PropTypes.string,
};

export default function CategoriesMonth (props) {
  const {
    style,
    daysNumber,
    monthNumber,
    monthIncome = 0,
    monthExpenses = {},
    monthExpensesTotal = 0,
    previousMonthExpenses = {},
    previousMonthName = '',
  } = props;

  const [selectedCategoryId, setSelectedCategoryId] = useState();

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const categories = useSelector(state => state.categories);

  const weekExpensesTotalsGroupedByCategoryId = useMemo(() => ({
    [1]: groupExpensesTotalsByCategoryId(monthExpenses[1] || []),
    [2]: groupExpensesTotalsByCategoryId(monthExpenses[2] || []),
    [3]: groupExpensesTotalsByCategoryId(monthExpenses[3] || []),
    [4]: groupExpensesTotalsByCategoryId(monthExpenses[4] || []),
  }), [monthExpenses]);

  const expensesTotalsGroupedByCategoryId = useMemo(() => groupExpensesTotalsByCategoryId([
    ...(monthExpenses[1] || []),
    ...(monthExpenses[2] || []),
    ...(monthExpenses[3] || []),
    ...(monthExpenses[4] || []),
  ]),[monthExpenses]);

  const previousMonthExpensesTotalsGroupedByCategoryId = useMemo(() => groupExpensesTotalsByCategoryId([
    ...(previousMonthExpenses[1] || []),
    ...(previousMonthExpenses[2] || []),
    ...(previousMonthExpenses[3] || []),
    ...(previousMonthExpenses[4] || []),
  ]),[previousMonthExpenses]);

  useEffect(() => {
    const findFirstCategoryWithPositiveValue = categories.find(category => expensesTotalsGroupedByCategoryId[category.id] > 0);

    if (!selectedCategoryId && findFirstCategoryWithPositiveValue?.id) {
      setTimeout(() => {
        setSelectedCategoryId(findFirstCategoryWithPositiveValue.id);
      }, 1000);
    }
  }, [categories, expensesTotalsGroupedByCategoryId]);

  const columnWidth = windowWidth < MEDIA.DESKTOP
    ? '100%'
    : '50%';
  const chartWidth = windowWidth < MEDIA.DESKTOP
    ? '100%' // mobile/tablet
    : columnWidth; // desktop

  const subtitleFontSize = windowWidth < MEDIA.DESKTOP
    ? windowWidth < MEDIA.TABLET
      ? 28 // mobile
      : 36 // tablet
    : 40; // desktop
  const subtitleLineHeight = windowWidth < MEDIA.DESKTOP
    ? windowWidth < MEDIA.TABLET
      ? 32 // mobile
      : 40 // tablet
    : 50; // desktop

  const isEmptyMonth = !monthExpensesTotal;

  if (isEmptyMonth) {
    return null;
  }

  return (
    <View style={[styles.categoriesMonth, style]}>
      <FoldedContainer
        title={(
          <TitleLink
            style={styles.subtitleLink}
            textStyle={[styles.subtitleLinkText, {
              fontSize: subtitleFontSize,
              lineHeight: subtitleLineHeight,
            }]}
            alwaysHighlighted
            navigateTo={{
              pathname: '/categories/weeks',
              params: { monthNumber },
            }}
          >
            {MONTH_NAME[monthNumber]}
          </TitleLink>
        )}
      >
        <View
          style={[styles.content, {
            flexDirection: windowWidth < MEDIA.DESKTOP ? 'column' : 'row',
            alignItems: windowWidth < MEDIA.DESKTOP ? 'center' : 'flex-start',
          }]}
        >
          <MonthStats
            style={[styles.monthStats, {
              width: columnWidth,
            }]}
            categories={categories}
            expensesTotalsGroupedByCategoryId={expensesTotalsGroupedByCategoryId}
            previousMonthExpensesTotalsGroupedByCategoryId={previousMonthExpensesTotalsGroupedByCategoryId}
            monthIncome={monthIncome}
            previousMonthName={previousMonthName}
            selectedCategoryId={selectedCategoryId}
            onSelectCategoryId={setSelectedCategoryId}
          />

          <MonthChart
            style={[styles.monthChart, {
              width: chartWidth,
              maxWidth: windowWidth < MEDIA.DESKTOP ? 600 : '100%',
              paddingLeft: windowWidth < MEDIA.DESKTOP ? 0 : 80,
            }]}
            categories={categories}
            daysNumber={daysNumber}
            monthTotal={monthExpensesTotal}
            weekExpensesTotalsGroupedByCategoryId={weekExpensesTotalsGroupedByCategoryId}
            expensesTotalsGroupedByCategoryId={expensesTotalsGroupedByCategoryId}
            selectedCategoryId={selectedCategoryId}
            onSelectCategoryId={setSelectedCategoryId}
          />
        </View>
      </FoldedContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  categoriesMonth: {},

  subtitleLink: {
    alignSelf: 'flex-start',
  },
  subtitleLinkText: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
  },

  monthStats: {
    marginTop: 40,
  },

  monthChart: {},

  content: {
    width: '100%',
    justifyContent: 'space-between',
  },
});
