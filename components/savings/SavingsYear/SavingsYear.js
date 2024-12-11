import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import YearChart from './YearChart';
import YearStats from './YearStats';
import TitleLink from '../../TitleLink';
import Loader from '../../Loader';
import { TAB } from '../../HeaderTabs';
import { MONTHS_IN_YEAR } from '../../../services/date';
import { fetchSavingsForYear } from '../../../services/api/saving';
import { fetchInvestmentsForYear } from '../../../services/api/investment';
import { getTotalAmountsByMonths } from '../../../services/amount';
import {
  addInvestmentsGroupedByYearMonthWeekAction,
  addSavingsGroupedByYearMonthWeekAction
} from '../../../redux/reducers/savings';
import { FONT } from '../../../styles/fonts';
import { MEDIA } from '../../../styles/media';

SavingsYear.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  savings: PropTypes.object, // weeks -> savings { [1]: [], [2]: [] }
  savingsTotals: PropTypes.shape({
    total: PropTypes.number,
  }),
  investments: PropTypes.object, // weeks -> investments { [1]: [], [2]: [] }
  investmentsTotals: PropTypes.shape({
    total: PropTypes.number,
  }),
  allTimeTotalSavingsAndInvestments: PropTypes.number,
  previousYearTotalSavingsAndInvestments: PropTypes.number,
  previousYear: PropTypes.number,
  visible: PropTypes.bool.isRequired,
};

export default function SavingsYear (props) {
  const {
    style,
    year,
    savings = {},
    savingsTotals = {},
    investments = {},
    investmentsTotals = {},
    allTimeTotalSavingsAndInvestments,
    previousYearTotalSavingsAndInvestments,
    previousYear,
    visible = false,
  } = props;

  const dispatch = useDispatch();

  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState();

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const savingsAllTimeYearAverage = useSelector(state => state.savings.savingsTotals.yearAverage);
  const investmentsAllTimeYearAverage = useSelector(state => state.savings.investmentsTotals.yearAverage);

  const allTimeYearAverage = savingsAllTimeYearAverage + investmentsAllTimeYearAverage;

  useEffect(() => {
    if (visible && !initialized) {
      setInitialized(true);
    }
  }, [visible]);

  useEffect(() => {
    const yearHasData = !!Object.keys(savings).length;

    if (visible && !yearHasData && !loading) {
      loadYearSavingsInvestments();
    } else if (loading && yearHasData) {
      setLoading(false);
    }
  }, [visible, savings, loading]);

  async function loadYearSavingsInvestments () {
    setLoading(true);

    const [savings, investments] = await Promise.all([
      fetchSavingsForYear(year),
      fetchInvestmentsForYear(year),
    ]).finally(() => {
      setLoading(false);
    });

    if (savings) {
      dispatch(addSavingsGroupedByYearMonthWeekAction(savings));
    }

    if (investments) {
      dispatch(addInvestmentsGroupedByYearMonthWeekAction(investments));
    }

    setLoading(false);
  }

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

  const savingsGroupedByMonth = groupByMonth(savings);
  const investmentsGroupedByMonth = groupByMonth(investments);
  const savingsAndInvestmentsGroupedByMonth = mergeGroupedByMonth(savingsGroupedByMonth, investmentsGroupedByMonth);
  const amountsByMonths = getTotalAmountsByMonths(savingsAndInvestmentsGroupedByMonth);

  const totalSavingsAndInvestments = (savingsTotals?.total || 0) + (investmentsTotals?.total || 0);

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
    : 50; // desktop

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
          navigateTo={{
            pathname: `/savings/${TAB.MONTHS}`,
            params: { year },
          }}
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
          amountsByMonths={amountsByMonths}
          selectedMonthIndex={selectedMonthIndex}
          onMonthSelected={setSelectedMonthIndex}
          total={totalSavingsAndInvestments}
          allTimeYearAverage={allTimeYearAverage}
          allTimeTotalSavingsAndInvestments={allTimeTotalSavingsAndInvestments}
          previousYearTotalSavingsAndInvestments={previousYearTotalSavingsAndInvestments}
          previousYear={previousYear}
        />

        <YearStats
          style={{
            width: columnWidth,
            marginTop: statsMarginTop,
            paddingLeft: windowWidth < MEDIA.DESKTOP ? 0 : 40,
          }}
          year={year}
          amountsByMonths={amountsByMonths}
          total={totalSavingsAndInvestments}
          selectedMonthIndex={selectedMonthIndex}
          allTimeYearAverage={allTimeYearAverage}
          allTimeTotalSavingsAndInvestments={allTimeTotalSavingsAndInvestments}
          previousYearTotalSavingsAndInvestments={previousYearTotalSavingsAndInvestments}
          previousYear={previousYear}
        />
      </View>

      <Loader
        overlayStyle={styles.loaderOverlay}
        loading={!initialized || loading}
      />
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

  loaderOverlay: {
    marginTop: -12,
  },
});
