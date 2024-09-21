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
  yearIncome: PropTypes.number.isRequired,
  monthIncomes: PropTypes.object, // weeks -> incomes { [1]: [], [2]: [] }
  monthIncomesTotal: PropTypes.number,
  previousMonthTotalIncomes: PropTypes.number,
  previousMonthName: PropTypes.string,
};

export default function IncomesMonth (props) {
  const {
    style,
    year,
    monthNumber,
    yearIncome,
    monthIncomes = {},
    monthIncomesTotal = 0,
    previousMonthTotalIncomes = 0,
    previousMonthName = '',
  } = props;

  const [selectedWeekIndex, setSelectedWeekIndex] = useState();

  const navigation = useNavigation();

  const windowWidth = useSelector(state => state.ui.windowWidth);

  const incomesByWeeks = getMonthChartPointsByWeek(monthIncomes);

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

  const isEmptyMonth = !monthIncomesTotal;

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
          onPress={() => navigation.navigate('IncomesWeeks', { monthNumber })}
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
          incomesByWeeks={incomesByWeeks}
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
          yearIncome={yearIncome}
          incomesByWeeks={incomesByWeeks}
          monthIncomesTotal={monthIncomesTotal}
          previousMonthTotalIncomes={previousMonthTotalIncomes}
          previousMonthName={previousMonthName}
          selectedWeekIndex={selectedWeekIndex}
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
