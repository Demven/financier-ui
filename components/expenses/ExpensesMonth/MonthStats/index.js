import { StyleSheet, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import TitleLink from '../../../TitleLink';
import FoldedContainer from '../../../FoldedContainer';
import CompareStats from '../../../CompareStats';
import { TAB } from '../../../HeaderTabs';
import { formatAmount } from '../../../../services/amount';
import { COLOR } from '../../../../styles/colors';
import { FONT } from '../../../../styles/fonts';
import { MEDIA } from '../../../../styles/media';

MonthStats.propTypes = {
  style: PropTypes.any,
  monthNumber: PropTypes.number.isRequired,
  monthIncome: PropTypes.number.isRequired,
  expensesByWeeks: PropTypes.arrayOf(PropTypes.number).isRequired,
  totalExpenses: PropTypes.number.isRequired,
  previousMonthTotalExpenses: PropTypes.number,
  previousMonthName: PropTypes.string,
  selectedWeekIndex: PropTypes.number,
  showSecondaryComparisons: PropTypes.bool.isRequired,
};

export default function MonthStats (props) {
  const {
    style,
    monthNumber,
    monthIncome,
    expensesByWeeks,
    totalExpenses,
    previousMonthTotalExpenses,
    previousMonthName,
    selectedWeekIndex,
    showSecondaryComparisons,
  } = props;

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const allTimeMonthAverage = useSelector(state => state.expenses.expensesTotals.monthAverage);
  const currencySymbol = useSelector(state => state.account.currencySymbol);

  return (
    <View style={[styles.monthStats, style]}>
      <FoldedContainer
        title={windowWidth < MEDIA.DESKTOP ? 'View expenses by weeks' : 'Weeks'}
        disable={windowWidth >= MEDIA.DESKTOP}
      >
        <View
          style={[styles.stats, {
            marginTop: windowWidth < MEDIA.DESKTOP ? 16 : 40,
            paddingLeft: windowWidth < MEDIA.DESKTOP ? 16 : 24,
          }]}
        >
          {expensesByWeeks.map((total, index) => (
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
                navigateTo={total
                  ? {
                    pathname: `/expenses/${TAB.WEEKS}`,
                    params: {
                      monthNumber,
                      weekNumber: index + 1,
                    }}
                  : undefined
                }
              >
                Week {index + 1}
              </TitleLink>

              <Text style={[
                styles.statValue,
                windowWidth < MEDIA.DESKTOP && styles.statValueSmaller,
                selectedWeekIndex === index && styles.statValueBold,
              ]}>
                {total > 0 ? formatAmount(-total, currencySymbol) : '–'}
              </Text>
            </View>
          ))}
        </View>
      </FoldedContainer>

      <CompareStats
        style={styles.compareStats}
        compareWhat={-totalExpenses}
        compareTo={monthIncome}
        previousResult={-previousMonthTotalExpenses}
        previousResultName={previousMonthName}
        allTimeAverage={-allTimeMonthAverage}
        showSecondaryComparisons={showSecondaryComparisons}
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
