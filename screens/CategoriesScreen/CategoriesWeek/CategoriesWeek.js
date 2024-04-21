import { useLayoutEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import WeekChart from './WeekChart';
import WeekStats from './WeekStats';
import TitleLink from '../../../components/TitleLink';
import FoldedContainer from '../../../components/FoldedContainer';
import {
  getDaysInMonth,
  getWeekRange,
  getDaysInWeek,
  MONTH_NAME,
} from '../../../services/date';
import { FONT } from '../../../styles/fonts';
import { MEDIA } from '../../../styles/media';
import { groupExpensesTotalsByCategoryId, groupWeekByDay } from "../../../services/dataItems";

CategoriesWeek.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  monthNumber: PropTypes.number.isRequired,
  weekNumber: PropTypes.number.isRequired,
  monthIncome: PropTypes.number.isRequired,
  onScrollTo: PropTypes.func,
  weekExpenses: PropTypes.arrayOf(PropTypes.object), // []
  weekExpensesTotal: PropTypes.number.isRequired,
  previousWeekExpenses: PropTypes.arrayOf(PropTypes.object), // []
  previousMonthName: PropTypes.string,
};

export default function CategoriesWeek (props) {
  const {
    style,
    year,
    monthNumber,
    weekNumber,
    monthIncome,
    onScrollTo,
    weekExpenses = [],
    weekExpensesTotal = 0,
    previousWeekExpenses = [],
    previousMonthName = ''
  } = props;

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const categories = useSelector(state => state.categories);

  const [selectedCategoryId, setSelectedCategoryId] = useState();

  const daysInMonth = getDaysInMonth(year, monthNumber);
  const daysInWeek = getDaysInWeek(weekNumber, daysInMonth);

  const totalExpenses = weekExpensesTotal;

  useLayoutEffect(() => {
    if (!selectedCategoryId && categories?.[0]?.id) {
      setTimeout(() => {
        setSelectedCategoryId(categories[0].id);
      }, 1000);
    }
  }, [categories]);

  function onLayout (event) {
    if (typeof onScrollTo === 'function') {
      onScrollTo(event.nativeEvent.layout.y);
    }
  }

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

  const isEmptyWeek = !totalExpenses;

  if (isEmptyWeek) {
    return null;
  }

  const weekExpensesGroupedByDay = useMemo(() => groupWeekByDay(weekExpenses, daysInWeek), [weekExpenses]);

  const dayExpensesTotalsGroupedByCategoryId = useMemo(() => {
    return weekExpensesGroupedByDay
      .map(dayExpenses => groupExpensesTotalsByCategoryId(dayExpenses || []));
  }, [weekExpensesGroupedByDay]);

  const expensesTotalsGroupedByCategoryId = useMemo(
  () => groupExpensesTotalsByCategoryId(weekExpenses),
  [weekExpenses],
  );
  const previousWeekExpensesTotalsGroupedByCategoryId = useMemo(
    () => groupExpensesTotalsByCategoryId(previousWeekExpenses),
    [previousWeekExpenses],
  );

  return (
    <View
      style={[styles.categoriesWeek, style]}
      onLayout={onLayout}
    >
      <FoldedContainer
        title={(
          <View style={styles.titleContainer}>
            <TitleLink
              style={styles.subtitleLink}
              textStyle={[styles.subtitleLinkText, {
                fontSize: subtitleFontSize,
                lineHeight: subtitleLineHeight,
              }]}
            >
              Week {weekNumber}
            </TitleLink>

            <Text style={[styles.weekRangeText, {
              marginLeft: windowWidth < MEDIA.WIDE_MOBILE ? 16 : 24,
              marginRight: windowWidth < MEDIA.WIDE_MOBILE ? 4 : 8,
              paddingBottom: windowWidth >= MEDIA.DESKTOP ? 15 : 8,
              fontSize: windowWidth < MEDIA.WIDE_MOBILE ? 18 : 21,
              lineHeight: windowWidth < MEDIA.WIDE_MOBILE ? 18 : 21,
            }]}>
              {MONTH_NAME[monthNumber].substring(0, 3)} {(getWeekRange(weekNumber, getDaysInMonth(year, monthNumber)))}
            </Text>
          </View>
        )}
      >
        <View
          style={[styles.content, {
            flexDirection: windowWidth < MEDIA.DESKTOP ? 'column' : 'row',
            alignItems: windowWidth < MEDIA.DESKTOP ? 'center' : 'flex-start',
          }]}
        >
          <WeekStats
            style={[styles.weekStats, {
              width: columnWidth,
            }]}
            categories={categories}
            monthIncome={monthIncome}
            expensesTotalsGroupedByCategoryId={expensesTotalsGroupedByCategoryId}
            previousWeekExpensesTotalsGroupedByCategoryId={previousWeekExpensesTotalsGroupedByCategoryId}
            previousMonthName={previousMonthName}
            selectedCategoryId={selectedCategoryId}
            onSelectCategoryId={setSelectedCategoryId}
          />

          <WeekChart
            style={[styles.weekChart, {
              width: chartWidth,
              maxWidth: windowWidth < MEDIA.DESKTOP ? 600 : '100%',
              paddingLeft: windowWidth < MEDIA.DESKTOP ? 0 : 80,
            }]}
            categories={categories}
            daysInWeek={daysInWeek}
            dayExpensesTotalsGroupedByCategoryId={dayExpensesTotalsGroupedByCategoryId}
            expensesTotalsGroupedByCategoryId={expensesTotalsGroupedByCategoryId}
            weekTotal={totalExpenses}
            selectedCategoryId={selectedCategoryId}
            onSelectCategoryId={setSelectedCategoryId}
          />
        </View>
      </FoldedContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  categoriesWeek: {},

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

  weekRangeText: {
    fontFamily: FONT.NOTO_SERIF.REGULAR,
  },

  weekStats: {
    marginTop: 40,
  },

  weekChart: {
    marginTop: 24,
  },

  content: {
    width: '100%',
    justifyContent: 'space-between',
  },
});
