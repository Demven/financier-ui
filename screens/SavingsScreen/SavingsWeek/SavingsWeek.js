import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import WeekChart from './WeekChart';
import WeekStats from './WeekStats';
import TitleLink from '../../../components/TitleLink';
import {
  getDaysInMonth,
  getWeekRange,
  getDaysInWeek,
  MONTH_NAME,
} from '../../../services/date';
import {
  getWeekChartPointsByDay,
  groupWeekByDay,
  mergeGroupedByDay,
} from '../../../services/dataItems';
import { FONT } from '../../../styles/fonts';
import { MEDIA } from '../../../styles/media';

SavingsWeek.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  monthNumber: PropTypes.number.isRequired,
  weekNumber: PropTypes.number.isRequired,
  onScrollTo: PropTypes.func,
  savings: PropTypes.object, // weeks -> savings { [1]: [], [2]: [] }
  investments: PropTypes.object, // weeks -> investments { [1]: [], [2]: [] }
  monthTotalSavingsAndInvestments: PropTypes.number,
  previousWeekSavingsAndInvestments: PropTypes.number,
  previousMonthName: PropTypes.string,
};

export default function SavingsWeek (props) {
  const {
    style,
    year,
    monthNumber,
    weekNumber,
    onScrollTo,
    savings = {},
    investments = {},
    monthTotalSavingsAndInvestments,
    previousWeekSavingsAndInvestments,
    previousMonthName,
  } = props;

  const [selectedDayIndex, setSelectedDayIndex] = useState();

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const savingsAllTimeWeekAverage = useSelector(state => state.savings.savingsWeekAverage) || 0;
  const investmentsAllTimeWeekAverage = useSelector(state => state.savings.investmentsWeekAverage) || 0;
  const allTimeWeekAverage = savingsAllTimeWeekAverage + investmentsAllTimeWeekAverage;

  const daysInMonth = getDaysInMonth(year, monthNumber);
  const daysInWeek = getDaysInWeek(weekNumber, daysInMonth);

  const currentWeekSavings = savings?.[weekNumber] || [];
  const currentWeekInvestments = investments?.[weekNumber] || [];

  const savingsGroupedByDay = groupWeekByDay(currentWeekSavings, daysInWeek);
  const investmentsGroupedByDay = groupWeekByDay(currentWeekInvestments, daysInWeek);
  const savingsAndInvestmentsGroupedByDay = mergeGroupedByDay(savingsGroupedByDay, investmentsGroupedByDay);
  const savingsAndInvestmentsByDays = getWeekChartPointsByDay(savingsAndInvestmentsGroupedByDay);

  const totalSavingsAndInvestments = savingsAndInvestmentsByDays.reduce((total, weekTotal) => total + weekTotal, 0);

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
    : 50; // desktop

  const statsMarginTop = windowWidth < MEDIA.MEDIUM_DESKTOP
    ? windowWidth < MEDIA.DESKTOP
      ? 40 // tablet/mobile
      : -24 // desktop
    : -20; // large desktop

  const isEmptyWeek = !totalSavingsAndInvestments;

  if (isEmptyWeek) {
    return null;
  }

  return (
    <View
      style={[styles.savingsWeek, style]}
      onLayout={onLayout}
    >
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

      <View
        style={[styles.content, {
          flexDirection: windowWidth < MEDIA.DESKTOP ? 'column' : 'row',
          alignItems: windowWidth < MEDIA.DESKTOP ? 'center' : 'flex-start',
        }]}
      >
        <WeekChart
          style={{ width: chartWidth }}
          year={Number(year)}
          monthNumber={monthNumber}
          daysInWeek={daysInWeek}
          savingsAndInvestmentsByDays={savingsAndInvestmentsByDays}
          selectedDayIndex={selectedDayIndex}
          onDaySelected={setSelectedDayIndex}
          totalSavingsAndInvestments={totalSavingsAndInvestments}
          monthTotalSavingsAndInvestments={monthTotalSavingsAndInvestments}
          previousWeekSavingsAndInvestments={previousWeekSavingsAndInvestments}
          previousMonthName={previousMonthName}
          allTimeWeekAverage={allTimeWeekAverage}
        />

        <WeekStats
          style={{
            width: columnWidth,
            marginTop: statsMarginTop,
            paddingLeft: windowWidth < MEDIA.DESKTOP ? 0 : 40,
          }}
          savingsAndInvestmentsGroupedByDay={savingsAndInvestmentsGroupedByDay}
          totalSavingsAndInvestments={totalSavingsAndInvestments}
          selectedDayIndex={selectedDayIndex}
          monthTotalSavingsAndInvestments={monthTotalSavingsAndInvestments}
          previousWeekSavingsAndInvestments={previousWeekSavingsAndInvestments}
          previousMonthName={previousMonthName}
          allTimeWeekAverage={allTimeWeekAverage}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  savingsWeek: {
    flexGrow: 1,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
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
    justifyContent: 'space-between',
  },
});
