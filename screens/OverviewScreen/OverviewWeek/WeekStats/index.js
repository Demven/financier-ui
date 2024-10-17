import { StyleSheet, View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { TAB } from '../../../../components/HeaderTabs';
import TitleLink from '../../../../components/TitleLink';
import { CHART_VIEW } from '../WeekChart';
import {
  setSelectedMonthAction,
  setSelectedTabAction,
  setSelectedWeekAction,
} from '../../../../redux/reducers/ui';
import { formatAmount, getAmountColor } from '../../../../services/amount';
import { FONT } from '../../../../styles/fonts';
import { COLOR } from '../../../../styles/colors';
import { MEDIA } from '../../../../styles/media';

WeekStats.propTypes = {
  style: PropTypes.any,
  chartView: PropTypes.oneOf([
    CHART_VIEW.EXPENSES,
    CHART_VIEW.INCOME,
    CHART_VIEW.SAVINGS,
  ]).isRequired,
  monthNumber: PropTypes.number.isRequired,
  weekNumber: PropTypes.number.isRequired,
  totalIncomes: PropTypes.number,
  previousWeeksTotalIncomes: PropTypes.number,
  totalExpenses: PropTypes.number,
  previousWeeksTotalExpenses: PropTypes.number,
  totalSavingsAndInvestments: PropTypes.number,
  previousWeeksTotalSavings: PropTypes.number,
  previousWeeksTotalInvestments: PropTypes.number,
};

export default function WeekStats (props) {
  const {
    style,
    chartView,
    monthNumber,
    weekNumber,
    totalIncomes,
    previousWeeksTotalIncomes,
    totalExpenses,
    previousWeeksTotalExpenses,
    totalSavingsAndInvestments,
    previousWeeksTotalSavings,
    previousWeeksTotalInvestments,
  } = props;

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const currencySymbol = useSelector(state => state.account.currencySymbol);

  const totalExcludingSavings = (totalIncomes + previousWeeksTotalIncomes) - (totalExpenses + previousWeeksTotalExpenses);
  const total = totalExcludingSavings - totalSavingsAndInvestments - previousWeeksTotalSavings - previousWeeksTotalInvestments;

  const totalExcludingSavingsColor = getAmountColor(totalExcludingSavings);
  const totalColor = getAmountColor(total);

  return (
    <View style={[styles.weekStats, style]}>
      {!!totalIncomes && (
        <View style={[styles.statRow, { marginTop: 0 }]}>
          <TitleLink
            textStyle={[
              styles.statName,
              chartView === CHART_VIEW.INCOME && styles.statNameBold,
              windowWidth < MEDIA.DESKTOP && styles.statNameSmaller,
            ]}
            onPress={() => {
              dispatch(setSelectedTabAction(TAB.WEEKS));
              dispatch(setSelectedMonthAction(monthNumber));
              dispatch(setSelectedWeekAction(weekNumber));
              setTimeout(() => navigation.navigate('Incomes'), 0);
            }}
          >
            Incomes
          </TitleLink>

          <Text style={[
            styles.statValue,
            chartView === CHART_VIEW.INCOME && styles.statValueBold,
            windowWidth < MEDIA.DESKTOP && styles.statValueSmaller,
          ]}>
            {formatAmount(totalIncomes, currencySymbol)}
          </Text>
        </View>
      )}

      {!!totalExpenses && (
        <View style={[styles.statRow, !totalIncomes && { marginTop: 0 }]}>
          <TitleLink
            textStyle={[
              styles.statName,
              chartView === CHART_VIEW.EXPENSES && styles.statNameBold,
              windowWidth < MEDIA.DESKTOP && styles.statNameSmaller,
            ]}
            onPress={() => {
              dispatch(setSelectedTabAction(TAB.WEEKS));
              dispatch(setSelectedMonthAction(monthNumber));
              dispatch(setSelectedWeekAction(weekNumber));
              setTimeout(() => navigation.navigate('Expenses'), 0);
            }}
          >
            Expenses
          </TitleLink>

          <Text style={[
            styles.statValue,
            chartView === CHART_VIEW.EXPENSES && styles.statValueBold,
            windowWidth < MEDIA.DESKTOP && styles.statValueSmaller,
          ]}>
            {formatAmount(-totalExpenses, currencySymbol)}
          </Text>
        </View>
      )}

      {!!totalSavingsAndInvestments && (
        <View style={[styles.statRow, (!totalIncomes && !totalExpenses) && { marginTop: 0 }]}>
          <TitleLink
            textStyle={[
              styles.statName,
              chartView === CHART_VIEW.SAVINGS && styles.statNameBold,
              windowWidth < MEDIA.DESKTOP && styles.statNameSmaller,
            ]}
            onPress={() => {
              dispatch(setSelectedTabAction(TAB.WEEKS));
              dispatch(setSelectedMonthAction(monthNumber));
              dispatch(setSelectedWeekAction(weekNumber));
              setTimeout(() => navigation.navigate('Savings'), 0);
            }}
          >
            Savings / Investments
          </TitleLink>

          <Text style={[
            styles.statValue,
            chartView === CHART_VIEW.SAVINGS && styles.statValueBold,
            windowWidth < MEDIA.DESKTOP && styles.statValueSmaller,
          ]}>
            {formatAmount(totalSavingsAndInvestments, currencySymbol)}
          </Text>
        </View>
      )}

      <View style={styles.underline} />

      {!!(totalSavingsAndInvestments || previousWeeksTotalSavings || previousWeeksTotalInvestments) && (
        <View style={styles.statRow}>
          <Text style={[styles.statName, styles.smallerText]}>(Excluding Savings)</Text>

          <Text style={[
            styles.statValue,
            styles.statValueBold,
            windowWidth < MEDIA.DESKTOP && styles.statValueSmaller,
            { color: totalExcludingSavingsColor },
          ]}>
            {formatAmount(totalExcludingSavings, currencySymbol)}
          </Text>
        </View>
      )}

      <View style={styles.statRow}>
        <Text style={[
          styles.statName,
          styles.statNameBold,
          windowWidth < MEDIA.DESKTOP && styles.statNameSmaller,
          { color: totalColor },
        ]}>
          Total
        </Text>

        <Text style={[
          styles.statValue,
          styles.statValueBold,
          windowWidth < MEDIA.DESKTOP && styles.statValueSmaller,
          { color: totalColor },
        ]}>
          {formatAmount(total, currencySymbol)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  weekStats: {},
  statRow: {
    marginTop: 20,
    flexDirection: 'row',
  },

  statName: {
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 24,
    lineHeight: 30,
    color: COLOR.DARK_GRAY,
  },
  statNameBold: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
  },
  statNameSmaller: {
    fontSize: 21,
    lineHeight: 26,
  },

  statValue: {
    marginLeft: 'auto',
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 24,
    lineHeight: 30,
    color: COLOR.DARK_GRAY,
    userSelect: 'text',
  },
  statValueBold: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
  },
  statValueSmaller: {
    fontSize: 21,
    lineHeight: 26,
  },

  smallerText: {
    fontSize: 16,
    lineHeight: 30,
  },

  underline: {
    height: 1,
    marginTop: 12,
    marginLeft: '50%',
    backgroundColor: COLOR.BLACK,
  },
});
