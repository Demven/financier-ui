import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import YearChart from './YearChart';
import YearStats from './YearStats';
import TitleLink from '../../../components/TitleLink';
import Loader from '../../../components/Loader';
import { MONTHS_IN_YEAR } from '../../../services/date';
import { getTotalAmountsByMonths } from '../../../services/amount';
import { fetchIncomesForYear } from '../../../services/api/income';
import { addIncomesGroupedByYearMonthWeekAction } from '../../../redux/reducers/incomes';
import { FONT } from '../../../styles/fonts';
import { MEDIA } from '../../../styles/media';

IncomesYear.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  allTimeTotalIncome: PropTypes.number.isRequired,
  yearIncomes: PropTypes.object.isRequired, // weeks -> incomes { [1]: [], [2]: [] }
  yearIncomesTotal: PropTypes.number.isRequired,
  previousYearTotalIncomes: PropTypes.number,
  previousYear: PropTypes.number.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default function IncomesYear (props) {
  const {
    style,
    year,
    allTimeTotalIncome = 0,
    yearIncomes = {},
    yearIncomesTotal = 0,
    previousYearTotalIncomes,
    previousYear,
    visible = false,
  } = props;

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState();

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const allTimeYearAverage = useSelector(state => state.incomes.incomesTotals.yearAverage);

  useEffect(() => {
    if (visible && !initialized) {
      setInitialized(true);
    }
  }, [visible]);

  useEffect(() => {
    const yearHasData = !!Object.keys(yearIncomes).length;

    if (visible && !yearHasData && !loading) {
      loadYearIncomes();
    } else if (loading && yearHasData) {
      setLoading(false);
    }
  }, [visible, yearIncomes, loading]);

  async function loadYearIncomes () {
    setLoading(true);

    const incomes = await fetchIncomesForYear(year);

    if (incomes) {
      dispatch(addIncomesGroupedByYearMonthWeekAction(incomes));
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

  const incomesGroupedByMonth = groupByMonth(yearIncomes);
  const totalAmountsByMonths = getTotalAmountsByMonths(incomesGroupedByMonth);

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

  const isEmptyYear = !yearIncomesTotal;

  if (isEmptyYear) {
    return null;
  }

  return (
    <View style={[styles.incomesYear, style]}>
      <View style={[styles.titleContainer, { width: columnWidth }]}>
        <TitleLink
          style={styles.subtitleLink}
          textStyle={[styles.subtitleLinkText, {
            fontSize: subtitleFontSize,
            lineHeight: subtitleLineHeight,
          }]}
          alwaysHighlighted
          onPress={() => navigation.navigate('IncomesMonths', { year })}
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
          incomesByMonths={totalAmountsByMonths}
          selectedMonthIndex={selectedMonthIndex}
          onMonthSelected={setSelectedMonthIndex}
          yearIncomesTotal={yearIncomesTotal}
          previousYearTotalIncomes={previousYearTotalIncomes}
          previousYear={previousYear}
          allTimeYearAverage={allTimeYearAverage}
          allTimeTotalIncome={allTimeTotalIncome}
        />

        <YearStats
          style={{
            width: columnWidth,
            marginTop: statsMarginTop,
            paddingLeft: windowWidth < MEDIA.DESKTOP ? 0 : 40,
          }}
          year={year}
          incomesByMonths={totalAmountsByMonths}
          selectedMonthIndex={selectedMonthIndex}
          yearIncomesTotal={yearIncomesTotal}
          previousYearTotalIncomes={previousYearTotalIncomes}
          previousYear={previousYear}
          allTimeYearAverage={allTimeYearAverage}
          allTimeTotalIncome={allTimeTotalIncome}
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
  incomesYear: {
    flexGrow: 1,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    position: 'relative',
    zIndex: 1,
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
