import { useLayoutEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import YearChart from './YearChart';
import YearStats from './YearStats';
import TitleLink from '../../../components/TitleLink';
import FoldedContainer from '../../../components/FoldedContainer';
import { groupExpensesTotalsByCategoryId } from '../../../services/dataItems';
import { FONT } from '../../../styles/fonts';
import { MEDIA } from '../../../styles/media';

CategoriesYear.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  previousYear: PropTypes.number.isRequired,
  yearIncome: PropTypes.number.isRequired,
  yearExpenses: PropTypes.object.isRequired, // weeks -> expenses { [1]: [], [2]: [] }
  yearTotalExpenses: PropTypes.object.isRequired, // weeks -> expensesTotal { total: ?, [1]: ?, [2]: ? }
  previousYearExpenses: PropTypes.object.isRequired,
};

export default function CategoriesYear (props) {
  const {
    style,
    year,
    previousYear,
    yearIncome,
    yearExpenses = {},
    yearTotalExpenses = {},
    previousYearExpenses = {},
  } = props;

  const navigation = useNavigation();

  const [selectedCategoryId, setSelectedCategoryId] = useState();

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const categories = useSelector(state => state.categories);

  useLayoutEffect(() => {
    if (!selectedCategoryId && categories?.[0]?.id) {
      setTimeout(() => {
        setSelectedCategoryId(categories[0].id);
      }, 1000);
    }
  }, [categories]);

  const totalExpenses = yearTotalExpenses?.total || 0;

  const isEmptyYear = !totalExpenses;

  if (isEmptyYear) {
    return null;
  }

  function getAllMonthExpenses (expenses, monthNumber) {
    return [
      ...(expenses?.[monthNumber]?.[1] || []),
      ...(expenses?.[monthNumber]?.[2] || []),
      ...(expenses?.[monthNumber]?.[3] || []),
      ...(expenses?.[monthNumber]?.[4] || []),
    ];
  }

  const expensesGroupedByMonths = useMemo(() => ({
    [1]: getAllMonthExpenses(yearExpenses, 1),
    [2]: getAllMonthExpenses(yearExpenses, 2),
    [3]: getAllMonthExpenses(yearExpenses, 3),
    [4]: getAllMonthExpenses(yearExpenses, 4),
    [5]: getAllMonthExpenses(yearExpenses, 5),
    [6]: getAllMonthExpenses(yearExpenses, 6),
    [7]: getAllMonthExpenses(yearExpenses, 7),
    [8]: getAllMonthExpenses(yearExpenses, 8),
    [9]: getAllMonthExpenses(yearExpenses, 9),
    [10]: getAllMonthExpenses(yearExpenses, 10),
    [11]: getAllMonthExpenses(yearExpenses, 11),
    [12]: getAllMonthExpenses(yearExpenses, 12),
  }), [yearExpenses]);

  const monthExpensesTotalsGroupedByCategoryId = useMemo(() => ({
    [1]: groupExpensesTotalsByCategoryId(expensesGroupedByMonths[1]),
    [2]: groupExpensesTotalsByCategoryId(expensesGroupedByMonths[2]),
    [3]: groupExpensesTotalsByCategoryId(expensesGroupedByMonths[3]),
    [4]: groupExpensesTotalsByCategoryId(expensesGroupedByMonths[4]),
    [5]: groupExpensesTotalsByCategoryId(expensesGroupedByMonths[5]),
    [6]: groupExpensesTotalsByCategoryId(expensesGroupedByMonths[6]),
    [7]: groupExpensesTotalsByCategoryId(expensesGroupedByMonths[7]),
    [8]: groupExpensesTotalsByCategoryId(expensesGroupedByMonths[8]),
    [9]: groupExpensesTotalsByCategoryId(expensesGroupedByMonths[9]),
    [10]: groupExpensesTotalsByCategoryId(expensesGroupedByMonths[10]),
    [11]: groupExpensesTotalsByCategoryId(expensesGroupedByMonths[11]),
    [12]: groupExpensesTotalsByCategoryId(expensesGroupedByMonths[12]),
  }), [expensesGroupedByMonths]);

  const expensesTotalsGroupedByCategoryId = useMemo(() => groupExpensesTotalsByCategoryId([
    ...expensesGroupedByMonths[1],
    ...expensesGroupedByMonths[2],
    ...expensesGroupedByMonths[3],
    ...expensesGroupedByMonths[4],
    ...expensesGroupedByMonths[5],
    ...expensesGroupedByMonths[6],
    ...expensesGroupedByMonths[7],
    ...expensesGroupedByMonths[8],
    ...expensesGroupedByMonths[9],
    ...expensesGroupedByMonths[10],
    ...expensesGroupedByMonths[11],
    ...expensesGroupedByMonths[12],
  ]),[expensesGroupedByMonths]);

  const previousYearExpensesTotalsGroupedByCategoryId = useMemo(() => groupExpensesTotalsByCategoryId([
    ...getAllMonthExpenses(previousYearExpenses, 1),
    ...getAllMonthExpenses(previousYearExpenses, 2),
    ...getAllMonthExpenses(previousYearExpenses, 3),
    ...getAllMonthExpenses(previousYearExpenses, 4),
    ...getAllMonthExpenses(previousYearExpenses, 5),
    ...getAllMonthExpenses(previousYearExpenses, 6),
    ...getAllMonthExpenses(previousYearExpenses, 7),
    ...getAllMonthExpenses(previousYearExpenses, 8),
    ...getAllMonthExpenses(previousYearExpenses, 9),
    ...getAllMonthExpenses(previousYearExpenses, 10),
    ...getAllMonthExpenses(previousYearExpenses, 11),
    ...getAllMonthExpenses(previousYearExpenses, 12),
  ]),[previousYearExpenses]);

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
    : 44; // desktop

  return (
    <View style={[styles.categoriesYear, style]}>
      <FoldedContainer
        title={(
          <TitleLink
            style={styles.subtitleLink}
            textStyle={[styles.subtitleLinkText, {
              fontSize: subtitleFontSize,
              lineHeight: subtitleLineHeight,
            }]}
            alwaysHighlighted
            onPress={() => navigation.navigate('CategoriesMonths', { year })}
          >
            {year}
          </TitleLink>
        )}
      >
        <View
          style={[styles.content, {
            flexDirection: windowWidth < MEDIA.DESKTOP ? 'column' : 'row',
            alignItems: windowWidth < MEDIA.DESKTOP ? 'center' : 'flex-start',
          }]}
        >
          <YearStats
            style={[styles.yearStats, {
              width: columnWidth,
            }]}
            previousYear={previousYear}
            categories={categories}
            yearIncome={yearIncome}
            expensesTotalsGroupedByCategoryId={expensesTotalsGroupedByCategoryId}
            previousYearExpensesTotalsGroupedByCategoryId={previousYearExpensesTotalsGroupedByCategoryId}
            selectedCategoryId={selectedCategoryId}
            onSelectCategoryId={setSelectedCategoryId}
          />

          <YearChart
            style={[styles.yearChart, {
              width: chartWidth,
              maxWidth: windowWidth < MEDIA.DESKTOP ? 600 : '100%',
              paddingLeft: windowWidth < MEDIA.DESKTOP ? 0 : 80,
            }]}
            categories={categories}
            monthExpensesTotalsGroupedByCategoryId={monthExpensesTotalsGroupedByCategoryId}
            expensesTotalsGroupedByCategoryId={expensesTotalsGroupedByCategoryId}
            yearTotal={totalExpenses}
            selectedCategoryId={selectedCategoryId}
            onSelectCategoryId={setSelectedCategoryId}
          />
        </View>
      </FoldedContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  categoriesYear: {
    flexGrow: 1,
  },

  subtitleLink: {
    alignSelf: 'flex-start',
  },
  subtitleLinkText: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
  },

  yearStats: {
    marginTop: 40,
  },

  yearChart: {
    marginTop: 24,
  },

  content: {
    width: '100%',
    justifyContent: 'space-between',
  },
});
