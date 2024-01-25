import { StyleSheet, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { COLOR } from '../../../../styles/colors';
import { MEDIA } from '../../../../styles/media';
import TitleLink from '../../../../components/TitleLink';
import { CHART_VIEW } from '../MonthChart';
import { formatAmount, getAmountColor } from '../../../../services/amount';
import { FONT } from '../../../../styles/fonts';

MonthStats.propTypes = {
  style: PropTypes.any,
  chartView: PropTypes.oneOf([
    CHART_VIEW.EXPENSES,
    CHART_VIEW.INCOME,
    CHART_VIEW.SAVINGS,
  ]).isRequired,
  setChartView: PropTypes.func.isRequired,
  totalIncomes: PropTypes.number,
  totalExpenses: PropTypes.number,
  totalSavingsAndInvestments: PropTypes.number,
};

export default function MonthStats (props) {
  const {
    style,
    chartView,
    setChartView = () => {},
    totalIncomes,
    totalExpenses,
    totalSavingsAndInvestments,
  } = props;

  const windowWidth = useSelector(state => state.ui.windowWidth);

  const savingsPercent = Math.floor(totalSavingsAndInvestments * 100 / totalIncomes);
  const totalExcludingSavings = totalIncomes - totalExpenses;
  const total = totalExcludingSavings - totalSavingsAndInvestments;

  const totalExcludingSavingsColor = getAmountColor(totalExcludingSavings);
  const totalColor = getAmountColor(total);

  return (
    <View style={[styles.monthStats, style]}>
      {!!totalIncomes && (
        <View style={[styles.statRow, { marginTop: 0 }]}>
          <TitleLink
            textStyle={[
              styles.statName,
              chartView === CHART_VIEW.INCOME && styles.statNameBold,
              windowWidth < MEDIA.DESKTOP && styles.statNameSmaller,
            ]}
            onPress={() => setChartView(CHART_VIEW.INCOME)}
          >
            Income
          </TitleLink>

          <Text style={[
            styles.statValue,
            chartView === CHART_VIEW.INCOME && styles.statValueBold,
            windowWidth < MEDIA.DESKTOP && styles.statValueSmaller,
          ]}>
            {formatAmount(totalIncomes)}
          </Text>
        </View>
      )}

      {!!totalExpenses && (
        <View style={styles.statRow}>
          <TitleLink
            textStyle={[
              styles.statName,
              chartView === CHART_VIEW.EXPENSES && styles.statNameBold,
              windowWidth < MEDIA.DESKTOP && styles.statNameSmaller,
            ]}
            onPress={() => setChartView(CHART_VIEW.EXPENSES)}
          >
            Expenses
          </TitleLink>

          <Text style={[
            styles.statValue,
            chartView === CHART_VIEW.EXPENSES && styles.statValueBold,
            windowWidth < MEDIA.DESKTOP && styles.statValueSmaller,
          ]}>
            {formatAmount(-totalExpenses)}
          </Text>
        </View>
      )}

      {!!totalSavingsAndInvestments && (
        <View style={styles.statRow}>
          <TitleLink
            textStyle={[
              styles.statName,
              chartView === CHART_VIEW.SAVINGS && styles.statNameBold,
              windowWidth < MEDIA.DESKTOP && styles.statNameSmaller,
            ]}
            onPress={() => setChartView(CHART_VIEW.SAVINGS)}
          >
            Savings
          </TitleLink>

          <Text style={[
            styles.statValue,
            chartView === CHART_VIEW.SAVINGS && styles.statValueBold,
            windowWidth < MEDIA.DESKTOP && styles.statValueSmaller,
          ]}>
            {formatAmount(totalSavingsAndInvestments)}
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
            {formatAmount(totalExcludingSavings)}
          </Text>
        </View>
      )}

      <View style={styles.statRow}>
        <Text
          style={[
            styles.statName,
            styles.statNameBold,
            windowWidth < MEDIA.DESKTOP && styles.statNameSmaller,
            { color: totalColor },
          ]}
        >
          Total
        </Text>

        <Text
          style={[
            styles.statValue,
            styles.statValueBold,
            windowWidth < MEDIA.DESKTOP && styles.statValueSmaller,
            { color: totalColor },
          ]}
        >
          {formatAmount(total)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  monthStats: {},

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
