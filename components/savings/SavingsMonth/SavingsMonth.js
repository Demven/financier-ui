import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import MonthChart from './MonthChart';
import MonthStats from './MonthStats';
import TitleLink from '../../TitleLink';
import { TAB } from '../../HeaderTabs';
import { MONTH_NAME } from '../../../services/date';
import { getMonthChartPointsByWeek, mergeGroupedByWeek } from '../../../services/dataItems';
import { FONT } from '../../../styles/fonts';
import { MEDIA } from '../../../styles/media';

SavingsMonth.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  monthNumber: PropTypes.number.isRequired,
  savings: PropTypes.object, // weeks -> savings { [1]: [], [2]: [] }
  yearSavingsTotal: PropTypes.number.isRequired,
  investments: PropTypes.object, // weeks -> investments { [1]: [], [2]: [] }
  yearInvestmentsTotal: PropTypes.number.isRequired,
  previousMonthTotalSavingsAndInvestments: PropTypes.number,
  previousMonthName: PropTypes.string,
  onScrollTo: PropTypes.func,
};

export default function SavingsMonth (props) {
  const {
    style,
    year,
    monthNumber,
    savings = {},
    yearSavingsTotal = 0,
    investments = {},
    yearInvestmentsTotal = 0,
    previousMonthTotalSavingsAndInvestments,
    previousMonthName,
    onScrollTo,
  } = props;

  const windowWidth = useSelector(state => state.ui.windowWidth);

  const [selectedWeekIndex, setSelectedWeekIndex] = useState();

  const savingsAndInvestmentsGroupedByWeek = mergeGroupedByWeek(savings, investments);
  const savingsAndInvestmentsByWeeks = getMonthChartPointsByWeek(savingsAndInvestmentsGroupedByWeek);

  const totalSavingsAndInvestments = savingsAndInvestmentsByWeeks.reduce((total, weekTotal) => total + weekTotal, 0);

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

  const isEmptyMonth = !totalSavingsAndInvestments;

  if (isEmptyMonth) {
    return null;
  }

  return (
    <View
      style={[styles.savingsMonth, style]}
      onLayout={onLayout}
    >
      <TitleLink
        style={styles.subtitleLink}
        textStyle={[styles.subtitleLinkText, {
          fontSize: subtitleFontSize,
          lineHeight: subtitleLineHeight,
        }]}
        alwaysHighlighted
        navigateTo={{
          pathname: `/savings/${TAB.WEEKS}`,
          params: { monthNumber },
        }}
      >
        {MONTH_NAME[monthNumber]}
      </TitleLink>

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
          savingsAndInvestmentsByWeeks={savingsAndInvestmentsByWeeks}
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
          savingsAndInvestmentsByWeeks={savingsAndInvestmentsByWeeks}
          totalSavingsAndInvestments={totalSavingsAndInvestments}
          selectedWeekIndex={selectedWeekIndex}
          yearSavingsAndInvestments={yearSavingsTotal + yearInvestmentsTotal}
          previousMonthTotalSavingsAndInvestments={previousMonthTotalSavingsAndInvestments}
          previousMonthName={previousMonthName}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  savingsMonth: {
    flexGrow: 1,
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
