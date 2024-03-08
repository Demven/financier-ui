import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import WeekChart from './WeekChart';
import WeekStats from './WeekStats';
import TitleLink from '../../../components/TitleLink';
import FoldedContainer from '../../../components/FoldedContainer';
import {
  getDaysInMonth,
  getWeekRange,
  getDaysInWeek,
  MONTH_NAME,
} from '../../../services/date';
import {
  getWeekChartPointsByDay,
  groupWeekByDay,
} from '../../../services/dataItems';
import { FONT } from '../../../styles/fonts';
import { MEDIA } from '../../../styles/media';

CategoriesWeek.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  monthNumber: PropTypes.number.isRequired,
  weekNumber: PropTypes.number.isRequired,
  monthIncome: PropTypes.number.isRequired,
  onScrollTo: PropTypes.func,
  weekExpenses: PropTypes.arrayOf(PropTypes.object), // []
  weekExpensesTotal: PropTypes.number.isRequired,
  previousWeekTotalExpenses: PropTypes.number.isRequired,
  previousMonthName: PropTypes.string,
};

export default function CategoriesWeek (props) {
  const {
    style,
    year,
    monthNumber,
    weekNumber,
    monthIncome,
    onScrollTo,
    weekExpenses = [],
    weekExpensesTotal = 0,
    previousWeekTotalExpenses = 0,
    previousMonthName = ''
  } = props;

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const allTimeWeekAverage = useSelector(state => state.expenses.weekAverage);

  const [selectedDayIndex, setSelectedDayIndex] = useState();

  const daysInMonth = getDaysInMonth(year, monthNumber);
  const daysInWeek = getDaysInWeek(weekNumber, daysInMonth);

  const expensesGroupedByDays = groupWeekByDay(weekExpenses, daysInWeek);
  const expensesByDays = getWeekChartPointsByDay(expensesGroupedByDays);

  const totalExpenses = weekExpensesTotal;

  function onLayout (event) {
    if (typeof onScrollTo === 'function') {
      onScrollTo(event.nativeEvent.layout.y);
    }
  }

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

  const isEmptyWeek = !totalExpenses;

  if (isEmptyWeek) {
    return null;
  }

  return (
    <View
      style={[styles.categoriesWeek, style]}
      onLayout={onLayout}
    >
      <FoldedContainer
        title={(
          <View style={styles.titleContainer}>
            <TitleLink
              style={styles.subtitleLink}
              textStyle={[styles.subtitleLinkText, {
                fontSize: subtitleFontSize,
                lineHeight: subtitleLineHeight,
              }]}
            >
              Week {weekNumber}
            </TitleLink>

            <Text style={[styles.weekRangeText, {
              marginLeft: windowWidth < MEDIA.WIDE_MOBILE ? 16 : 32,
              paddingBottom: windowWidth >= MEDIA.DESKTOP ? 10 : 8,
              fontSize: windowWidth < MEDIA.WIDE_MOBILE ? 18 : 21,
              lineHeight: windowWidth < MEDIA.WIDE_MOBILE ? 18 : 21,
            }]}>
              {MONTH_NAME[monthNumber].substring(0, 3)} {(getWeekRange(weekNumber, getDaysInMonth(year, monthNumber)))}
            </Text>
          </View>
        )}
      >
        <View
          style={[styles.content, {
            flexDirection: windowWidth < MEDIA.DESKTOP ? 'column' : 'row',
            alignItems: windowWidth < MEDIA.DESKTOP ? 'center' : 'flex-start',
          }]}
        >
          <WeekStats
            style={{
              width: columnWidth,
              marginTop: 40,
            }}
            monthNumber={monthNumber}
            weekExpenses={weekExpenses}
            totalExpenses={totalExpenses}
            monthIncome={monthIncome}
            previousWeekTotalExpenses={previousWeekTotalExpenses}
            previousMonthName={previousMonthName}
            allTimeWeekAverage={allTimeWeekAverage}
            showSecondaryComparisons
          />

          <WeekChart
            style={{
              width: chartWidth,
              marginLeft: windowWidth < MEDIA.DESKTOP ? 0 : 40,
            }}
            daysInWeek={daysInWeek}
            expensesByDays={expensesByDays}
            selectedDayIndex={selectedDayIndex}
            onDaySelected={setSelectedDayIndex}
            totalExpenses={totalExpenses}
            monthIncome={monthIncome}
            previousWeekTotalExpenses={previousWeekTotalExpenses}
            previousMonthName={previousMonthName}
            allTimeWeekAverage={allTimeWeekAverage}
            showSecondaryComparisons
          />
        </View>
      </FoldedContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  categoriesWeek: {
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

  weekRangeText: {
    fontFamily: FONT.NOTO_SERIF.REGULAR,
  },

  content: {
    width: '100%',
    justifyContent: 'space-between',
  },
});
