import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import YearChart from './YearChart';
import YearStats from './YearStats';
import TitleLink from '../../../components/TitleLink';
import FoldedContainer from '../../../components/FoldedContainer';
import Loader from '../../../components/Loader';
import { addExpensesGroupedByYearMonthWeekAction } from '../../../redux/reducers/expenses';
import { groupExpensesTotalsByCategoryId } from '../../../services/dataItems';
import { fetchExpensesForYear } from '../../../services/api/expense';
import { FONT } from '../../../styles/fonts';
import { MEDIA } from '../../../styles/media';

CategoriesYear.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  previousYear: PropTypes.number.isRequired,
  yearIncome: PropTypes.number.isRequired,
  yearExpenses: PropTypes.object.isRequired, // weeks -> expenses { [1]: [], [2]: [] }
  yearExpensesTotal: PropTypes.number.isRequired,
  previousYearExpenses: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default function CategoriesYear (props) {
  const {
    style,
    year,
    previousYear,
    yearIncome,
    yearExpenses = {},
    yearExpensesTotal = 0,
    previousYearExpenses = {},
    visible = false,
  } = props;

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [selectedCategoryId, setSelectedCategoryId] = useState();
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const categories = useSelector(state => state.categories);

  useEffect(() => {
    if (visible && !initialized) {
      setInitialized(true);
    }
  }, [visible]);

  useEffect(() => {
    const yearHasData = !!Object.keys(yearExpenses).length;

    if (visible && !yearHasData && !loading) {
      loadYearExpenses();
    } else if (loading && yearHasData) {
      setLoading(false);
    }
  }, [visible, yearExpenses, loading]);

  async function loadYearExpenses () {
    setLoading(true);

    const expenses = await fetchExpensesForYear(year);

    if (expenses) {
      dispatch(addExpensesGroupedByYearMonthWeekAction(expenses));
    }

    setLoading(false);
  }

  function getAllMonthExpenses (expenses, monthNumber) {
    return [
      ...(expenses?.[monthNumber]?.[1] || []),
      ...(expenses?.[monthNumber]?.[2] || []),
      ...(expenses?.[monthNumber]?.[3] || []),
      ...(expenses?.[monthNumber]?.[4] || []),
    ];
  }

  const expensesGroupedByMonths = useMemo(() => ({
    [1]: getAllMonthExpenses(yearExpenses, 1),
    [2]: getAllMonthExpenses(yearExpenses, 2),
    [3]: getAllMonthExpenses(yearExpenses, 3),
    [4]: getAllMonthExpenses(yearExpenses, 4),
    [5]: getAllMonthExpenses(yearExpenses, 5),
    [6]: getAllMonthExpenses(yearExpenses, 6),
    [7]: getAllMonthExpenses(yearExpenses, 7),
    [8]: getAllMonthExpenses(yearExpenses, 8),
    [9]: getAllMonthExpenses(yearExpenses, 9),
    [10]: getAllMonthExpenses(yearExpenses, 10),
    [11]: getAllMonthExpenses(yearExpenses, 11),
    [12]: getAllMonthExpenses(yearExpenses, 12),
  }), [yearExpenses]);

  const monthExpensesTotalsGroupedByCategoryId = useMemo(() => ({
    [1]: groupExpensesTotalsByCategoryId(expensesGroupedByMonths[1]),
    [2]: groupExpensesTotalsByCategoryId(expensesGroupedByMonths[2]),
    [3]: groupExpensesTotalsByCategoryId(expensesGroupedByMonths[3]),
    [4]: groupExpensesTotalsByCategoryId(expensesGroupedByMonths[4]),
    [5]: groupExpensesTotalsByCategoryId(expensesGroupedByMonths[5]),
    [6]: groupExpensesTotalsByCategoryId(expensesGroupedByMonths[6]),
    [7]: groupExpensesTotalsByCategoryId(expensesGroupedByMonths[7]),
    [8]: groupExpensesTotalsByCategoryId(expensesGroupedByMonths[8]),
    [9]: groupExpensesTotalsByCategoryId(expensesGroupedByMonths[9]),
    [10]: groupExpensesTotalsByCategoryId(expensesGroupedByMonths[10]),
    [11]: groupExpensesTotalsByCategoryId(expensesGroupedByMonths[11]),
    [12]: groupExpensesTotalsByCategoryId(expensesGroupedByMonths[12]),
  }), [expensesGroupedByMonths]);

  const expensesTotalsGroupedByCategoryId = useMemo(() => groupExpensesTotalsByCategoryId([
    ...expensesGroupedByMonths[1],
    ...expensesGroupedByMonths[2],
    ...expensesGroupedByMonths[3],
    ...expensesGroupedByMonths[4],
    ...expensesGroupedByMonths[5],
    ...expensesGroupedByMonths[6],
    ...expensesGroupedByMonths[7],
    ...expensesGroupedByMonths[8],
    ...expensesGroupedByMonths[9],
    ...expensesGroupedByMonths[10],
    ...expensesGroupedByMonths[11],
    ...expensesGroupedByMonths[12],
  ]),[expensesGroupedByMonths]);

  const previousYearExpensesTotalsGroupedByCategoryId = useMemo(() => groupExpensesTotalsByCategoryId([
    ...getAllMonthExpenses(previousYearExpenses, 1),
    ...getAllMonthExpenses(previousYearExpenses, 2),
    ...getAllMonthExpenses(previousYearExpenses, 3),
    ...getAllMonthExpenses(previousYearExpenses, 4),
    ...getAllMonthExpenses(previousYearExpenses, 5),
    ...getAllMonthExpenses(previousYearExpenses, 6),
    ...getAllMonthExpenses(previousYearExpenses, 7),
    ...getAllMonthExpenses(previousYearExpenses, 8),
    ...getAllMonthExpenses(previousYearExpenses, 9),
    ...getAllMonthExpenses(previousYearExpenses, 10),
    ...getAllMonthExpenses(previousYearExpenses, 11),
    ...getAllMonthExpenses(previousYearExpenses, 12),
  ]),[previousYearExpenses]);

  useEffect(() => {
    const findFirstCategoryWithPositiveValue = categories.find(category => expensesTotalsGroupedByCategoryId[category.id] > 0);

    if (!selectedCategoryId && findFirstCategoryWithPositiveValue?.id) {
      setTimeout(() => {
        setSelectedCategoryId(findFirstCategoryWithPositiveValue.id);
      }, 1000);
    }
  }, [categories, expensesTotalsGroupedByCategoryId]);

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

  const isEmptyYear = !yearExpensesTotal;

  if (isEmptyYear) {
    return null;
  }

  return (
    <View style={[styles.categoriesYear, style]}>
      <FoldedContainer
        title={(
          <TitleLink
            style={styles.subtitleLink}
            textStyle={[styles.subtitleLinkText, {
              fontSize: subtitleFontSize,
              lineHeight: subtitleLineHeight,
            }]}
            alwaysHighlighted
            onPress={() => navigation.navigate('CategoriesMonths', { year })}
          >
            {year}
          </TitleLink>
        )}
      >
        <View
          style={[styles.content, {
            flexDirection: windowWidth < MEDIA.DESKTOP ? 'column' : 'row',
            alignItems: windowWidth < MEDIA.DESKTOP ? 'center' : 'flex-start',
          }]}
        >
          <YearStats
            style={[styles.yearStats, {
              width: columnWidth,
            }]}
            previousYear={previousYear}
            categories={categories}
            yearIncome={yearIncome}
            expensesTotalsGroupedByCategoryId={expensesTotalsGroupedByCategoryId}
            previousYearExpensesTotalsGroupedByCategoryId={previousYearExpensesTotalsGroupedByCategoryId}
            selectedCategoryId={selectedCategoryId}
            onSelectCategoryId={setSelectedCategoryId}
          />

          <YearChart
            style={[styles.yearChart, {
              width: chartWidth,
              maxWidth: windowWidth < MEDIA.DESKTOP ? 600 : '100%',
              paddingLeft: windowWidth < MEDIA.DESKTOP ? 0 : 80,
            }]}
            categories={categories}
            monthExpensesTotalsGroupedByCategoryId={monthExpensesTotalsGroupedByCategoryId}
            expensesTotalsGroupedByCategoryId={expensesTotalsGroupedByCategoryId}
            yearTotal={yearExpensesTotal}
            selectedCategoryId={selectedCategoryId}
            onSelectCategoryId={setSelectedCategoryId}
          />
        </View>

        <Loader
          overlayStyle={styles.loaderOverlay}
          loading={!initialized || loading}
        />
      </FoldedContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  categoriesYear: {
    flexGrow: 1,
  },

  subtitleLink: {
    alignSelf: 'flex-start',
  },
  subtitleLinkText: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
  },

  yearStats: {
    marginTop: 40,
  },

  yearChart: {},

  content: {
    width: '100%',
    justifyContent: 'space-between',
  },

  loaderOverlay: {},
});
