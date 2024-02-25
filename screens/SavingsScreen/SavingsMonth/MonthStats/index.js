import { StyleSheet, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import TitleLink from '../../../../components/TitleLink';
import CompareStats from '../../../../components/CompareStats';
import FoldedContainer from '../../../../components/FoldedContainer';
import { formatAmount } from '../../../../services/amount';
import { COLOR } from '../../../../styles/colors';
import { FONT } from '../../../../styles/fonts';
import { MEDIA } from '../../../../styles/media';

MonthStats.propTypes = {
  style: PropTypes.any,
  monthNumber: PropTypes.number.isRequired,
  savingsAndInvestmentsByWeeks: PropTypes.arrayOf(PropTypes.number).isRequired,
  totalSavingsAndInvestments: PropTypes.number.isRequired,
  selectedWeekIndex: PropTypes.number,
  yearSavingsAndInvestments: PropTypes.number.isRequired,
  previousMonthTotalSavingsAndInvestments: PropTypes.number,
  previousMonthName: PropTypes.number,
};

export default function MonthStats (props) {
  const {
    style,
    monthNumber,
    savingsAndInvestmentsByWeeks,
    totalSavingsAndInvestments,
    selectedWeekIndex,
    yearSavingsAndInvestments,
    previousMonthTotalSavingsAndInvestments,
    previousMonthName,
  } = props;

  const navigation = useNavigation();

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const allTimeSavingsMonthAverage = useSelector(state => state.savings.savingsMonthAverage);
  const allTimeInvestmentsMonthAverage = useSelector(state => state.savings.investmentsMonthAverage);
  const allTimeMonthAverage = allTimeSavingsMonthAverage + allTimeInvestmentsMonthAverage;

  return (
    <View style={[styles.monthStats, style]}>
      <FoldedContainer
        title={windowWidth >= MEDIA.DESKTOP ? 'Weeks' : 'See savings by weeks'}
        disable={windowWidth >= MEDIA.DESKTOP}
      >
        <View
          style={[styles.stats, {
            marginTop: windowWidth < MEDIA.DESKTOP ? 16 : 40,
            paddingLeft: windowWidth < MEDIA.DESKTOP ? 16 : 24,
          }]}
        >
          {savingsAndInvestmentsByWeeks.map((total, index) => (
            <View
              key={index}
              style={[styles.statRow, index === 0 && { marginTop: 0 }]}
            >
              <TitleLink
                textStyle={[
                  styles.statName,
                  windowWidth < MEDIA.DESKTOP && styles.statNameSmaller,
                  selectedWeekIndex === index && styles.statNameBold,
                ]}
                alwaysHighlighted={!!total}
                onPress={total
                  ? () => navigation.navigate('SavingsWeeks', { monthNumber, weekNumber: index + 1 })
                  : undefined}
              >
                Week {index + 1}
              </TitleLink>

              <Text style={[
                styles.statValue,
                windowWidth < MEDIA.DESKTOP && styles.statValueSmaller,
                selectedWeekIndex === index && styles.statValueBold,
              ]}>
                {total > 0 ? formatAmount(total) : '–'}
              </Text>
            </View>
          ))}
        </View>
      </FoldedContainer>

      <CompareStats
        style={styles.compareStats}
        compareWhat={totalSavingsAndInvestments}
        compareTo={yearSavingsAndInvestments}
        previousResult={previousMonthTotalSavingsAndInvestments}
        previousResultName={previousMonthName}
        allTimeAverage={allTimeMonthAverage}
        showSecondaryComparisons
        circleSubText='of year'
        circleSubTextColor={COLOR.GRAY}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  monthStats: {
    width: '100%',
  },

  stats: {
    width: '100%',
  },

  statRow: {
    marginTop: 16,
    flexDirection: 'row',
  },

  statName: {
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 20,
    lineHeight: 24,
    color: COLOR.DARK_GRAY,
  },
  statNameBold: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
  },
  statNameSmaller: {
    fontSize: 18,
    lineHeight: 23,
  },

  statValue: {
    marginLeft: 'auto',
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 20,
    lineHeight: 24,
    color: COLOR.DARK_GRAY,
    userSelect: 'text',
  },
  statValueBold: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
  },
  statValueSmaller: {
    fontSize: 18,
    lineHeight: 23,
  },

  compareStats: {
    marginTop: 52,
  },
});
