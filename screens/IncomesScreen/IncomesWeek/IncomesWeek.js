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
} from '../../../services/dataItems';
import { FONT } from '../../../styles/fonts';
import { MEDIA } from '../../../styles/media';

IncomesWeek.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  monthNumber: PropTypes.number.isRequired,
  weekNumber: PropTypes.number.isRequired,
  monthIncome: PropTypes.number.isRequired,
  onScrollTo: PropTypes.func,
  weekIncomes: PropTypes.arrayOf(PropTypes.object),
  weekIncomesTotal: PropTypes.number.isRequired,
  previousWeekTotalIncomes: PropTypes.number,
  previousMonthName: PropTypes.string,
};

export default function IncomesWeek (props) {
  const {
    style,
    year,
    monthNumber,
    weekNumber,
    monthIncome,
    onScrollTo,
    weekIncomes = [],
    weekIncomesTotal = 0,
    previousWeekTotalIncomes = 0,
    previousMonthName = '',
  } = props;

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const allTimeWeekAverage = useSelector(state => state.expenses.weekAverage);

  const [selectedDayIndex, setSelectedDayIndex] = useState();

  const daysInMonth = getDaysInMonth(year, monthNumber);
  const daysInWeek = getDaysInWeek(weekNumber, daysInMonth);

  const incomesGroupedByDays = groupWeekByDay(weekIncomes, daysInWeek);
  const incomesByDays = getWeekChartPointsByDay(incomesGroupedByDays);

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

  const statsMarginTop = windowWidth < MEDIA.MEDIUM_DESKTOP
    ? windowWidth < MEDIA.DESKTOP
      ? 40 // tablet/mobile
      : -24 // desktop
    : -20; // large desktop

  const isEmptyWeek = !weekIncomesTotal;

  if (isEmptyWeek) {
    return null;
  }

  return (
    <View
      style={[styles.incomesWeek, style]}
      onLayout={onLayout}
    >
      <View style={[styles.titleContainer, { width: columnWidth }]}>
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
          daysInWeek={daysInWeek}
          incomesByDays={incomesByDays}
          monthIncome={monthIncome}
          selectedDayIndex={selectedDayIndex}
          onDaySelected={setSelectedDayIndex}
          weekIncomesTotal={weekIncomesTotal}
          previousWeekTotalIncomes={previousWeekTotalIncomes}
          previousMonthName={previousMonthName}
          allTimeWeekAverage={allTimeWeekAverage}
          showSecondaryComparisons
        />

        <WeekStats
          style={{
            width: columnWidth,
            marginTop: statsMarginTop,
            paddingLeft: windowWidth < MEDIA.DESKTOP ? 0 : 40,
          }}
          monthNumber={monthNumber}
          monthIncome={monthIncome}
          weekIncomes={weekIncomes}
          weekIncomesTotal={weekIncomesTotal}
          previousWeekTotalExpenses={previousWeekTotalIncomes}
          previousMonthName={previousMonthName}
          allTimeWeekAverage={allTimeWeekAverage}
          showSecondaryComparisons
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  incomesWeek: {
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
    justifyContent: 'space-between',
  },
});
