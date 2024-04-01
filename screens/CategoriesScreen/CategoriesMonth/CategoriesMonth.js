import { useMemo, useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import MonthChart from './MonthChart';
import MonthStats from './MonthStats';
import TitleLink from '../../../components/TitleLink';
import FoldedContainer from '../../../components/FoldedContainer';
import { MONTH_NAME } from '../../../services/date';
import { groupExpensesTotalsByCategoryId } from '../../../services/dataItems';
import { FONT } from '../../../styles/fonts';
import { MEDIA } from '../../../styles/media';

CategoriesMonth.propTypes = {
  style: PropTypes.any,
  monthNumber: PropTypes.number.isRequired,
  monthIncome: PropTypes.number,
  monthExpenses: PropTypes.object, // weeks -> expenses { [1]: [], [2]: [] }
  monthExpensesTotal: PropTypes.object, // weeks -> expensesTotal { total: ?, [1]: ?, [2]: ? }
  previousMonthExpenses: PropTypes.object, // weeks -> expenses { [1]: [], [2]: [] }
  previousMonthName: PropTypes.string,
};

export default function CategoriesMonth (props) {
  const {
    style,
    monthNumber,
    monthIncome = 0,
    monthExpenses = {},
    monthExpensesTotal = {},
    previousMonthExpenses = {},
    previousMonthName = '',
  } = props;

  const [selectedCategoryId, setSelectedCategoryId] = useState();

  const navigation = useNavigation();

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const categories = useSelector(state => state.categories);

  useEffect(() => {
    if (categories?.[0]?.id) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories]);

  const totalExpenses = monthExpensesTotal?.total || 0;

  const expensesTotalsGroupedByCategoryId = useMemo(() => groupExpensesTotalsByCategoryId([
    ...(monthExpenses[1] || []),
    ...(monthExpenses[2] || []),
    ...(monthExpenses[3] || []),
    ...(monthExpenses[4] || []),
  ]),[monthExpenses]);

  const previousMonthExpensesTotalsGroupedByCategoryId = useMemo(() => groupExpensesTotalsByCategoryId([
    ...(previousMonthExpenses[1] || []),
    ...(previousMonthExpenses[2] || []),
    ...(previousMonthExpenses[3] || []),
    ...(previousMonthExpenses[4] || []),
  ]),[previousMonthExpenses]);

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

  const isEmptyMonth = !totalExpenses;

  if (isEmptyMonth) {
    return null;
  }

  return (
    <View style={[styles.categoriesMonth, style]}>
      <FoldedContainer
        title={(
          <TitleLink
            style={styles.subtitleLink}
            textStyle={[styles.subtitleLinkText, {
              fontSize: subtitleFontSize,
              lineHeight: subtitleLineHeight,
            }]}
            alwaysHighlighted
            onPress={() => navigation.navigate('CategoriesWeeks', { monthNumber })}
          >
            {MONTH_NAME[monthNumber]}
          </TitleLink>
        )}
      >
        <View
          style={[styles.content, {
            flexDirection: windowWidth < MEDIA.DESKTOP ? 'column' : 'row',
            alignItems: windowWidth < MEDIA.DESKTOP ? 'center' : 'flex-start',
          }]}
        >
          <MonthStats
            style={[styles.monthStats, {
              width: columnWidth,
            }]}
            categories={categories}
            expensesTotalsGroupedByCategoryId={expensesTotalsGroupedByCategoryId}
            previousMonthExpensesTotalsGroupedByCategoryId={previousMonthExpensesTotalsGroupedByCategoryId}
            monthIncome={monthIncome}
            previousMonthName={previousMonthName}
            selectedCategoryId={selectedCategoryId}
            onSelectCategoryId={setSelectedCategoryId}
          />

          <MonthChart
            style={[styles.monthChart, {
              width: chartWidth,
              paddingLeft: windowWidth < MEDIA.DESKTOP ? 0 : 80,
            }]}
            categories={categories}
            monthTotal={totalExpenses}
            expensesTotalsGroupedByCategoryId={expensesTotalsGroupedByCategoryId}
            selectedCategoryId={selectedCategoryId}
            onSelectCategoryId={setSelectedCategoryId}
          />
        </View>
      </FoldedContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  categoriesMonth: {},

  subtitleLink: {
    alignSelf: 'flex-start',
  },
  subtitleLinkText: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
  },

  monthStats: {
    marginTop: 40,
  },

  monthChart: {
    marginTop: 40,
  },

  content: {
    width: '100%',
    justifyContent: 'space-between',
  },
});
