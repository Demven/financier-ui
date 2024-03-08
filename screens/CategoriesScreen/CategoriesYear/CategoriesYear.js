import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import YearChart from './YearChart';
import YearStats from './YearStats';
import TitleLink from '../../../components/TitleLink';
import FoldedContainer from '../../../components/FoldedContainer';
import { MONTHS_IN_YEAR } from '../../../services/date';
import { getTotalAmountsByMonths } from '../../../services/amount';
import { FONT } from '../../../styles/fonts';
import { MEDIA } from '../../../styles/media';

CategoriesYear.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  yearExpenses: PropTypes.object, // weeks -> expenses { [1]: [], [2]: [] }
  yearTotalExpenses: PropTypes.object, // weeks -> expensesTotal { total: ?, [1]: ?, [2]: ? }
  yearIncome: PropTypes.number.isRequired,
  previousYear: PropTypes.number.isRequired,
  previousYearTotalExpenses: PropTypes.number.isRequired,
};

export default function CategoriesYear (props) {
  const {
    style,
    year,
    yearExpenses = {},
    yearTotalExpenses = {},
    yearIncome,
    previousYear,
    previousYearTotalExpenses,
  } = props;

  const navigation = useNavigation();

  const [selectedMonthIndex, setSelectedMonthIndex] = useState();

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const allTimeYearAverage = useSelector(state => state.expenses.yearAverage);

  function groupByMonth (yearItems) {
    const groupedByMonth = new Array(MONTHS_IN_YEAR).fill([]);

    Object.keys(yearItems).forEach(monthNumber => {
      groupedByMonth[monthNumber - 1] = [
        ...(yearItems[monthNumber][1] || []),
        ...(yearItems[monthNumber][2] || []),
        ...(yearItems[monthNumber][3] || []),
        ...(yearItems[monthNumber][4] || []),
      ];
    });

    return groupedByMonth;
  }

  const expensesGroupedByMonth = groupByMonth(yearExpenses);
  const totalAmountsByMonths = getTotalAmountsByMonths(expensesGroupedByMonth);

  const totalExpenses = yearTotalExpenses?.total || 0;

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

  const isEmptyYear = !totalExpenses;

  if (isEmptyYear) {
    return null;
  }

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
            style={{
              width: columnWidth,
              marginTop: 40,
            }}
            year={year}
            expensesByMonths={totalAmountsByMonths}
            selectedMonthIndex={selectedMonthIndex}
            totalExpenses={totalExpenses}
            yearIncome={yearIncome}
            previousYearTotalExpenses={previousYearTotalExpenses}
            previousYear={previousYear}
            allTimeYearAverage={allTimeYearAverage}
            showSecondaryComparisons
          />

          <YearChart
            style={{
              width: chartWidth,
              marginLeft: windowWidth < MEDIA.DESKTOP ? 0 : 40,
            }}
            expensesByMonths={totalAmountsByMonths}
            selectedMonthIndex={selectedMonthIndex}
            onMonthSelected={setSelectedMonthIndex}
            totalExpenses={totalExpenses}
            yearIncome={yearIncome}
            previousYearTotalExpenses={previousYearTotalExpenses}
            previousYear={previousYear}
            allTimeYearAverage={allTimeYearAverage}
            showSecondaryComparisons
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

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    position: 'relative',
    zIndex: 1,
  },

  subtitleLink: {
    alignSelf: 'flex-start',
  },
  subtitleLinkText: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
  },

  content: {
    width: '100%',
    justifyContent: 'space-between',
  },
});
