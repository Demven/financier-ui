import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import MonthChart from './MonthChart';
import MonthStats from './MonthStats';
import TitleLink from '../../../components/TitleLink';
import { MONTH_NAME } from '../../../services/date';
import { getMonthChartPointsByWeek } from '../../../services/dataItems';
import { FONT } from '../../../styles/fonts';
import { MEDIA } from '../../../styles/media';

IncomesMonth.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  monthNumber: PropTypes.number.isRequired,
  monthIncome: PropTypes.number,
  monthExpenses: PropTypes.object, // weeks -> expenses { [1]: [], [2]: [] }
  monthExpensesTotal: PropTypes.object, // weeks -> expensesTotal { total: ?, [1]: ?, [2]: ? }
  previousMonthTotalExpenses: PropTypes.number,
  previousMonthName: PropTypes.string,
};

export default function IncomesMonth (props) {
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

  const statsMarginTop = windowWidth < MEDIA.MEDIUM_DESKTOP
    ? windowWidth < MEDIA.DESKTOP
      ? 40 // tablet/mobile
      : -24 // desktop
    : -20; // large desktop

  const isEmptyMonth = !totalExpenses;

  if (isEmptyMonth) {
    return null;
  }

  return (
    <View style={[styles.incomesMonth, style]}>
      <View style={[styles.titleContainer, { width: columnWidth }]}>
        <TitleLink
          style={styles.subtitleLink}
          textStyle={[styles.subtitleLinkText, {
            fontSize: subtitleFontSize,
            lineHeight: subtitleLineHeight,
          }]}
          alwaysHighlighted
          onPress={() => navigation.navigate('ExpensesWeeks', { monthNumber })}
        >
          {MONTH_NAME[monthNumber]}
        </TitleLink>
      </View>

      <View
        style={[styles.content, {
          flexDirection: windowWidth < MEDIA.DESKTOP ? 'column' : 'row',
          alignItems: windowWidth < MEDIA.DESKTOP ? 'center' : 'flex-start',
        }]}
      >
        <MonthChart
          style={{ width: chartWidth }}
          year={Number(year)}
          monthNumber={monthNumber}
          expensesByWeeks={expensesByWeeks}
          selectedWeekIndex={selectedWeekIndex}
          onWeekSelected={setSelectedWeekIndex}
        />

        <MonthStats
          style={{
            width: columnWidth,
            marginTop: statsMarginTop,
            paddingLeft: windowWidth < MEDIA.DESKTOP ? 0 : 40,
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  incomesMonth: {
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
    justifyContent: 'space-between',
  },
});
