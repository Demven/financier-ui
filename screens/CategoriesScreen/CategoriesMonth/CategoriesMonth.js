import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import MonthChart from './MonthChart';
import MonthStats from './MonthStats';
import TitleLink from '../../../components/TitleLink';
import FoldedContainer from '../../../components/FoldedContainer';
import { MONTH_NAME } from '../../../services/date';
import { getMonthChartPointsByWeek } from '../../../services/dataItems';
import { FONT } from '../../../styles/fonts';
import { MEDIA } from '../../../styles/media';

CategoriesMonth.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  monthNumber: PropTypes.number.isRequired,
  monthIncome: PropTypes.number,
  monthExpenses: PropTypes.object, // weeks -> expenses { [1]: [], [2]: [] }
  monthExpensesTotal: PropTypes.object, // weeks -> expensesTotal { total: ?, [1]: ?, [2]: ? }
  previousMonthTotalExpenses: PropTypes.number,
  previousMonthName: PropTypes.string,
};

export default function CategoriesMonth (props) {
  const {
    style,
    year,
    monthNumber,
    monthIncome = 0,
    monthExpenses = {},
    monthExpensesTotal = {},
    previousMonthTotalExpenses = 0,
    previousMonthName = '',
  } = props;

  const [selectedWeekIndex, setSelectedWeekIndex] = useState();

  const navigation = useNavigation();

  const windowWidth = useSelector(state => state.ui.windowWidth);

  const expensesByWeeks = getMonthChartPointsByWeek(monthExpenses);
  const totalExpenses = monthExpensesTotal?.total || 0;

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

  const isEmptyMonth = !totalExpenses;

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
            onPress={() => navigation.navigate('CategoriesWeeks', { monthNumber })}
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
            style={{
              width: columnWidth,
              marginTop: 40,
            }}
            monthNumber={monthNumber}
            monthIncome={monthIncome}
            expensesByWeeks={expensesByWeeks}
            totalExpenses={totalExpenses}
            previousMonthTotalExpenses={previousMonthTotalExpenses}
            previousMonthName={previousMonthName}
            selectedWeekIndex={selectedWeekIndex}
            showSecondaryComparisons
          />

          <MonthChart
            style={{
              width: chartWidth,
              marginLeft: windowWidth < MEDIA.DESKTOP ? 0 : 40,
            }}
            year={Number(year)}
            monthNumber={monthNumber}
            expensesByWeeks={expensesByWeeks}
            selectedWeekIndex={selectedWeekIndex}
            onWeekSelected={setSelectedWeekIndex}
          />
        </View>
      </FoldedContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  categoriesMonth: {
    flexGrow: 1,
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
