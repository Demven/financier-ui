import { StyleSheet, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import TitleLink from '../../../../components/TitleLink';
import FoldedContainer from '../../../../components/FoldedContainer';
import CompareStats from '../../../../components/CompareStats';
import { formatAmount } from '../../../../services/amount';
import { COLOR } from '../../../../styles/colors';
import { FONT } from '../../../../styles/fonts';
import { MEDIA } from '../../../../styles/media';

MonthStats.propTypes = {
  style: PropTypes.any,
  monthNumber: PropTypes.number.isRequired,
  yearIncome: PropTypes.number.isRequired,
  incomesByWeeks: PropTypes.arrayOf(PropTypes.number).isRequired,
  monthIncomesTotal: PropTypes.number.isRequired,
  previousMonthTotalIncomes: PropTypes.number,
  previousMonthName: PropTypes.string,
  selectedWeekIndex: PropTypes.number,
};

export default function MonthStats (props) {
  const {
    style,
    monthNumber,
    yearIncome,
    incomesByWeeks,
    monthIncomesTotal,
    previousMonthTotalIncomes,
    previousMonthName,
    selectedWeekIndex,
  } = props;

  const navigation = useNavigation();

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const allTimeMonthAverage = useSelector(state => state.incomes.monthAverage);
  const currencySymbol = useSelector(state => state.account.currencySymbol);

  return (
    <View style={[styles.monthStats, style]}>
      <FoldedContainer
        title={windowWidth < MEDIA.DESKTOP ? 'View incomes by weeks' : 'Weeks'}
        disable={windowWidth >= MEDIA.DESKTOP}
      >
        <View
          style={[styles.stats, {
            marginTop: windowWidth < MEDIA.DESKTOP ? 16 : 40,
            paddingLeft: windowWidth < MEDIA.DESKTOP ? 16 : 24,
          }]}
        >
          {incomesByWeeks.map((total, index) => (
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
                  ? () => navigation.navigate('IncomesWeeks', { monthNumber, weekNumber: index + 1 })
                  : undefined}
              >
                Week {index + 1}
              </TitleLink>

              <Text style={[
                styles.statValue,
                windowWidth < MEDIA.DESKTOP && styles.statValueSmaller,
                selectedWeekIndex === index && styles.statValueBold,
              ]}>
                {total > 0 ? formatAmount(total, currencySymbol) : '–'}
              </Text>
            </View>
          ))}
        </View>
      </FoldedContainer>

      <CompareStats
        style={styles.compareStats}
        compareWhat={monthIncomesTotal}
        compareTo={yearIncome}
        previousResult={previousMonthTotalIncomes}
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
