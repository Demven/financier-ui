import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import YearChart, { CHART_VIEW } from './YearChart';
import YearStats from './YearStats'
import TitleLink from '../../../components/TitleLink';
import { FONT } from '../../../styles/fonts';
import { MEDIA } from '../../../styles/media';
import { fetchOverviewForYear } from '../../../services/api/overview';
import {
  addInvestmentsGroupedByYearMonthWeekAction,
  addSavingsGroupedByYearMonthWeekAction,
  addYearSavingsTotalsAction,
  addYearInvestmentsTotalsAction,
} from '../../../redux/reducers/savings';
import { addExpensesGroupedByYearMonthWeekAction, addYearExpensesTotalsAction } from '../../../redux/reducers/expenses';
import { addIncomesGroupedByYearMonthWeekAction, addYearIncomesTotalsAction } from '../../../redux/reducers/incomes';
import Loader from "../../../components/Loader";

OverviewYear.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  expenses: PropTypes.object, // weeks -> expenses { [1]: [], [2]: [] }
  expensesTotals: PropTypes.shape({
    total: PropTypes.number,
  }),
  incomes: PropTypes.object, // weeks -> incomes { [1]: [], [2]: [] }
  incomesTotals: PropTypes.shape({
    total: PropTypes.number,
  }),
  savings: PropTypes.object, // weeks -> savings { [1]: [], [2]: [] }
  savingsTotals: PropTypes.shape({
    total: PropTypes.number,
  }),
  investments: PropTypes.object, // weeks -> investments { [1]: [], [2]: [] }
  investmentsTotals: PropTypes.shape({
    total: PropTypes.number,
  }),
  visible: PropTypes.bool.isRequired,
};

export default function OverviewYear (props) {
  const {
    style,
    year,
    expenses = {},
    expensesTotals = {},
    incomes = {},
    incomesTotals = {},
    savings = {},
    savingsTotals = {},
    investments = {},
    investmentsTotals = {},
    visible = false,
  } = props;

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const windowWidth = useSelector(state => state.ui.windowWidth);

  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chartView, setChartView] = useState(CHART_VIEW.INCOME);

  const totalExpenses = expensesTotals?.total || 0;
  const totalIncomes = incomesTotals?.total || 0;
  const totalSavingsAndInvestments = (savingsTotals?.total || 0) + (investmentsTotals?.total || 0);

  useEffect(() => {
    if (visible && !initialized) {
      setInitialized(true);
    }
  }, [visible]);

  useEffect(() => {
    const yearHasData = !!Object.keys(savings).length;

    if (visible && !yearHasData && !loading) {
      loadYearOverview();
    } else if (loading && yearHasData) {
      setLoading(false);
    }
  }, [visible, savings, loading]);

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

  async function loadYearOverview () {
    setLoading(true);

    const {
      expenses,
      expensesTotals,
      incomes,
      incomesTotals,
      savings,
      savingsTotals,
      investments,
      investmentsTotals,
    } = await fetchOverviewForYear(year);

    if (expenses) {
      dispatch(addExpensesGroupedByYearMonthWeekAction(expenses));
    }
    if (expensesTotals) {
      dispatch(addYearExpensesTotalsAction(expensesTotals));
    }

    if (savings) {
      dispatch(addSavingsGroupedByYearMonthWeekAction(savings));
    }
    if (savingsTotals) {
      dispatch(addYearSavingsTotalsAction(savingsTotals));
    }

    if (investments) {
      dispatch(addInvestmentsGroupedByYearMonthWeekAction(investments));
    }
    if (investmentsTotals) {
      dispatch(addYearInvestmentsTotalsAction(investmentsTotals));
    }

    if (incomes) {
      dispatch(addIncomesGroupedByYearMonthWeekAction(incomes));
    }
    if (incomesTotals) {
      dispatch(addYearIncomesTotalsAction(incomesTotals));
    }

    setLoading(false);
  }

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
    : 50; // desktop
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
    <View style={[styles.overviewYear, style]}>
      <View style={styles.titleContainer}>
        <TitleLink
          style={[styles.subtitleLink, { paddingLeft: subtitlePaddingLeft }]}
          textStyle={[styles.subtitleLinkText, {
            fontSize: subtitleFontSize,
            lineHeight: subtitleLineHeight,
          }]}
          alwaysHighlighted
          onPress={() => navigation.navigate('OverviewMonths', { year })}
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
          year={year}
          chartView={chartView}
          totalIncomes={totalIncomes}
          totalExpenses={totalExpenses}
          totalSavingsAndInvestments={totalSavingsAndInvestments}
        />
      </View>

      <Loader loading={!initialized || loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  overviewYear: {
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
