import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import MonthChart from './MonthChart';
import MonthStats from './MonthStats';
import TitleLink from '../../../components/TitleLink';
import { MONTH_NAME } from '../../../services/date';
import { getMonthChartPointsByWeek, mergeGroupedByWeek } from '../../../services/dataItems';
import { FONT } from '../../../styles/fonts';
import { MEDIA } from '../../../styles/media';

SavingsMonth.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  monthNumber: PropTypes.number.isRequired,
  savings: PropTypes.object, // weeks -> savings { [1]: [], [2]: [] }
  investments: PropTypes.object, // weeks -> investments { [1]: [], [2]: [] }
};

export default function SavingsMonth (props) {
  const {
    style,
    year,
    monthNumber,
    savings = {},
    investments = {},
  } = props;

  console.info('monthNumber', monthNumber, savings, investments);

  const [selectedWeekIndex, setSelectedWeekIndex] = useState();

  const navigation = useNavigation();

  const windowWidth = useSelector(state => state.ui.windowWidth);

  const savingsAndInvestmentsGroupedByWeek = mergeGroupedByWeek(savings, investments);
  const savingsAndInvestmentsByWeeks = getMonthChartPointsByWeek(savingsAndInvestmentsGroupedByWeek);

  const totalSavingsAndInvestments = savingsAndInvestmentsByWeeks.reduce((total, weekTotal) => total + weekTotal, 0);

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

  const isEmptyMonth = !totalSavingsAndInvestments;

  if (isEmptyMonth) {
    return null;
  }

  return (
    <View style={[styles.savingsMonth, style]}>
      <TitleLink
        style={styles.subtitleLink}
        textStyle={[styles.subtitleLinkText, {
          fontSize: subtitleFontSize,
          lineHeight: subtitleLineHeight,
        }]}
        alwaysHighlighted
        onPress={() => navigation.navigate('SavingsWeeks', { monthNumber })}
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
