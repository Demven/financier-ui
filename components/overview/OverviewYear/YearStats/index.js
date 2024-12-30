import {
  StyleSheet,
  View,
  Text,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import PropTypes from 'prop-types';
import TitleLink from '../../../TitleLink';
import { TAB } from '../../../HeaderTabs';
import { CHART_VIEW } from '../YearChart';
import {
  setSelectedTabAction,
  setSelectedYearAction,
  setSelectedMonthAction,
  setSelectedWeekAction
} from '../../../../redux/reducers/ui';
import { formatAmount, getAmountColor } from '../../../../services/amount';
import { FONT } from '../../../../styles/fonts';
import { COLOR } from '../../../../styles/colors';
import { MEDIA } from '../../../../styles/media';

YearStats.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  chartView: PropTypes.oneOf([
    CHART_VIEW.EXPENSES,
    CHART_VIEW.INCOME,
    CHART_VIEW.SAVINGS,
  ]).isRequired,
  totalIncomes: PropTypes.number,
  totalExpenses: PropTypes.number,
  totalSavingsAndInvestments: PropTypes.number,
};

export default function YearStats (props) {
  const {
    style,
    year,
    chartView,
    totalIncomes,
    totalExpenses,
    totalSavingsAndInvestments,
  } = props;

  const dispatch = useDispatch();
  const router = useRouter();

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const currencySymbol = useSelector(state => state.account.currencySymbol);

  const savingsPercent = Math.floor(totalSavingsAndInvestments * 100 / totalIncomes);
  const totalExcludingSavings = totalIncomes - totalExpenses;
  const total = totalExcludingSavings - totalSavingsAndInvestments;

  const totalExcludingSavingsColor = getAmountColor(totalExcludingSavings);
  const totalColor = getAmountColor(total);

  return (
    <View style={[styles.yearStats, style]}>
      {!!totalIncomes && (
        <View style={[styles.statRow, { marginTop: 0 }]}>
          <TitleLink
            textStyle={[
              styles.statName,
              chartView === CHART_VIEW.INCOME && styles.statNameBold,
              windowWidth < MEDIA.DESKTOP && styles.statNameSmaller,
            ]}
            alwaysHighlighted={Platform.OS === 'ios' || windowWidth < MEDIA.TABLET}
            onPress={() => {
              dispatch(setSelectedTabAction(TAB.MONTHS));
              dispatch(setSelectedYearAction(year));
              dispatch(setSelectedMonthAction(undefined));
              dispatch(setSelectedWeekAction(undefined));

              setTimeout(() => router.push(`/incomes/${TAB.MONTHS}`), 0);
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
            alwaysHighlighted={Platform.OS === 'ios' || windowWidth < MEDIA.TABLET}
            onPress={() => {
              dispatch(setSelectedTabAction(TAB.MONTHS));
              dispatch(setSelectedYearAction(year));
              dispatch(setSelectedMonthAction(undefined));
              dispatch(setSelectedWeekAction(undefined));

              setTimeout(() => router.push(`/expenses/${TAB.MONTHS}`), 0);
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
            alwaysHighlighted={Platform.OS === 'ios' || windowWidth < MEDIA.TABLET}
            onPress={() => {
              dispatch(setSelectedTabAction(TAB.MONTHS));
              dispatch(setSelectedYearAction(year));
              dispatch(setSelectedMonthAction(undefined));
              dispatch(setSelectedWeekAction(undefined));

              setTimeout(() => router.push(`/savings/${TAB.MONTHS}`), 0);
            }}
          >
            Savings
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

      {!!savingsPercent && (
        <View style={[styles.statRow, { marginTop: 12 }]}>
          <Text style={[styles.statValue, styles.smallerText]}>({savingsPercent}%)</Text>
        </View>
      )}

      <View style={styles.underline} />

      {!!totalSavingsAndInvestments && (
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
  yearStats: {},
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
