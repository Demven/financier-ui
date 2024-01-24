import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import YearChart, { CHART_VIEW } from './YearChart';
import YearStats from './YearStats';
import TitleLink from '../../../components/TitleLink';
import { FONT } from '../../../styles/fonts';
import { MEDIA } from '../../../styles/media';

SavingsYear.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  expenses: PropTypes.object, // weeks -> expenses { [1]: [], [2]: [] }
  incomes: PropTypes.object, // weeks -> incomes { [1]: [], [2]: [] }
  savings: PropTypes.object, // weeks -> savings { [1]: [], [2]: [] }
  investments: PropTypes.object, // weeks -> investments { [1]: [], [2]: [] }
};

export default function SavingsYear (props) {
  const {
    style,
    year,
    expenses = {},
    incomes = {},
    savings = {},
    investments = {},
  } = props;

  const navigation = useNavigation();

  const windowWidth = useSelector(state => state.ui.windowWidth);

  const [chartView, setChartView] = useState(CHART_VIEW.INCOME);

  function getTotalAmount (yearItems) {
    return Object.keys(yearItems)
      .map(monthNumber => ([
        ...(yearItems[monthNumber]?.[1] || []),
        ...(yearItems[monthNumber]?.[2] || []),
        ...(yearItems[monthNumber]?.[3] || []),
        ...(yearItems[monthNumber]?.[4] || []),
      ]))
      .map(flatMonthData => {
        return flatMonthData.reduce((total, item) => {
          const amount = item.amount || (item.shares * item.pricePerShare);
          return total + amount;
        }, 0);
      })
      .reduce((monthTotal, yearTotal) => monthTotal + yearTotal, 0);
  }

  const totalIncomes = getTotalAmount(incomes);
  const totalExpenses = getTotalAmount(expenses);
  const totalSavingsAndInvestments = (getTotalAmount(savings) + getTotalAmount(investments)) || 0;

  useEffect(() => {
    if (chartView === CHART_VIEW.INCOME && !totalIncomes) {
      if (totalExpenses) {
        setChartView(CHART_VIEW.EXPENSES);
      } else if (totalSavingsAndInvestments) {
        setChartView(CHART_VIEW.SAVINGS);
      }
    } else if (chartView === CHART_VIEW.EXPENSES && !totalExpenses) {
      if (totalIncomes) {
        setChartView(CHART_VIEW.INCOME);
      } else if (totalSavingsAndInvestments) {
        setChartView(CHART_VIEW.SAVINGS);
      }
    } else if (chartView === CHART_VIEW.SAVINGS && !totalSavingsAndInvestments) {
      if (totalIncomes) {
        setChartView(CHART_VIEW.INCOME);
      } else if (totalExpenses) {
        setChartView(CHART_VIEW.EXPENSES);
      }
    }
  }, [totalIncomes, totalExpenses, totalSavingsAndInvestments]);

  const columnWidth = windowWidth < MEDIA.DESKTOP
    ? '100%'
    : '50%';
  const chartWidth = windowWidth < MEDIA.TABLET
    ? windowWidth < MEDIA.MOBILE
      ? '106%' // mobile
      : '106%' // wide-mobile
    : windowWidth < MEDIA.DESKTOP
      ? '107%' // tablet
      : columnWidth; // desktop
  const chartMarginLeft = windowWidth < MEDIA.TABLET
    ? windowWidth < MEDIA.MOBILE
      ? -35 // mobile
      : -27 // wide-mobile
    : windowWidth < MEDIA.DESKTOP
      ? 0 // tablet
      : -58; // desktop

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
  const subtitlePaddingLeft = windowWidth < MEDIA.DESKTOP ? 28 : 0;

  const statsMarginTop = windowWidth < MEDIA.DESKTOP
    ? windowWidth < MEDIA.TABLET
      ? windowWidth < MEDIA.WIDE_MOBILE
        ? windowWidth < MEDIA.MOBILE
          ? 0 // mobile
          : -8 // wide-mobile
        : -24 // wide-mobile
      : -54 // tablet
    : 0; // desktop

  const isEmptyYear = !totalIncomes && !totalExpenses && !totalSavingsAndInvestments;

  if (isEmptyYear) {
    return null;
  }

  return (
    <View style={[styles.savingsYear, style]}>
      <View style={styles.titleContainer}>
        <TitleLink
          style={[styles.subtitleLink, { paddingLeft: subtitlePaddingLeft }]}
          textStyle={[styles.subtitleLinkText, {
            fontSize: subtitleFontSize,
            lineHeight: subtitleLineHeight,
          }]}
          alwaysHighlighted
          onPress={() => navigation.navigate('OverviewMonths')}
        >
          {year}
        </TitleLink>
      </View>

      <View style={[styles.content, {
        flexDirection: windowWidth < MEDIA.DESKTOP ? 'column' : 'row',
        alignItems: windowWidth < MEDIA.DESKTOP ? 'center' : 'flex-start',
      }]}>
        <YearChart
          style={[styles.chart, {
            width: chartWidth,
            marginLeft: chartMarginLeft,
          }]}
          year={year}
          chartView={chartView}
          setChartView={setChartView}
          incomes={incomes}
          expenses={expenses}
          savings={savings}
          investments={investments}
        />

        <YearStats
          style={{
            width: columnWidth,
            marginTop: statsMarginTop,
            paddingTop: windowWidth < MEDIA.DESKTOP ? 0 : 24,
            paddingLeft: windowWidth < MEDIA.DESKTOP ? 32 : 40,
            paddingRight: windowWidth < MEDIA.DESKTOP ? 32 : 0,
          }}
          chartView={chartView}
          setChartView={setChartView}
          totalIncomes={totalIncomes}
          totalExpenses={totalExpenses}
          totalSavingsAndInvestments={totalSavingsAndInvestments}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  savingsYear: {
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

  chart: {
    marginTop: 16,
  },
});
