import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import YearChart from './YearChart';
import YearStats from './YearStats';
import TitleLink from '../../../components/TitleLink';
import { MONTHS_IN_YEAR } from '../../../services/date';
import { getAmount } from '../../../services/amount';
import { FONT } from '../../../styles/fonts';
import { MEDIA } from '../../../styles/media';

IncomesYear.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  savings: PropTypes.object, // weeks -> savings { [1]: [], [2]: [] }
  investments: PropTypes.object, // weeks -> investments { [1]: [], [2]: [] }
};

export default function IncomesYear (props) {
  const {
    style,
    year,
    savings = {},
    investments = {},
  } = props;

  const navigation = useNavigation();

  const [selectedMonthIndex, setSelectedMonthIndex] = useState();

  const windowWidth = useSelector(state => state.ui.windowWidth);

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

  function mergeGroupedByMonth (groupedByMonth1 = [], groupedByMonth2 = []) {
    return groupedByMonth1.map((byMonth1, index) => {
      const byMonth2 = groupedByMonth2[index] || [];

      return Array.isArray(byMonth1)
        ? [...byMonth1, ...byMonth2]
        : byMonth2;
    });
  }

  function getSavingsByMonths (groupedByMonth) {
    return groupedByMonth.map(itemsByMonth => {
      if (!itemsByMonth?.length) {
        return 0;
      }

      const monthTotal = itemsByMonth.reduce((total, item) => {
        return total + getAmount(item);
      }, 0);

      return parseFloat(monthTotal.toFixed(2));
    });
  }

  const savingsGroupedByMonth = groupByMonth(savings);
  const investmentsGroupedByMonth = groupByMonth(investments);
  const savingsAndInvestmentsGroupedByMonth = mergeGroupedByMonth(savingsGroupedByMonth, investmentsGroupedByMonth);
  const savingsByMonths = getSavingsByMonths(savingsAndInvestmentsGroupedByMonth);

  const totalSavingsAndInvestments = savingsByMonths.reduce((total, month) => total + month, 0);

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

  const isEmptyYear = !totalSavingsAndInvestments;

  if (isEmptyYear) {
    return null;
  }

  return (
    <View style={[styles.savingsYear, style]}>
      <View style={styles.titleContainer}>
        <TitleLink
          style={styles.subtitleLink}
          textStyle={[styles.subtitleLinkText, {
            fontSize: subtitleFontSize,
            lineHeight: subtitleLineHeight,
          }]}
          alwaysHighlighted
          onPress={() => navigation.navigate('SavingsMonths', { year })}
        >
          {year}
        </TitleLink>
      </View>

      <View
        style={[styles.content, {
          flexDirection: windowWidth < MEDIA.DESKTOP ? 'column' : 'row',
          alignItems: windowWidth < MEDIA.DESKTOP ? 'center' : 'flex-start',
        }]}
      >
        <YearChart
          style={{ width: chartWidth }}
          savingsByMonths={savingsByMonths}
          selectedMonthIndex={selectedMonthIndex}
          onMonthSelected={setSelectedMonthIndex}
        />

        <YearStats
          style={{
            width: columnWidth,
            marginTop: statsMarginTop,
            paddingLeft: windowWidth < MEDIA.DESKTOP ? 0 : 40,
          }}
          year={year}
          savingsByMonths={savingsByMonths}
          total={totalSavingsAndInvestments}
          selectedMonthIndex={selectedMonthIndex}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  incomesYear: {
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

  content: {
    justifyContent: 'space-between',
  },
});
