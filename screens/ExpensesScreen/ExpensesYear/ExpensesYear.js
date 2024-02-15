import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import YearChart from './YearChart';
import YearStats from './YearStats';
import TitleLink from '../../../components/TitleLink';
import CategoryDropdown, { SHOW_ALL_CATEGORY_ID } from '../../../components/CategoryDropdown';
import { MONTHS_IN_YEAR } from '../../../services/date';
import { getTotalAmountsByMonths } from '../../../services/amount';
import { filterYearExpensesByCategory } from '../../../services/dataItems';
import { FONT } from '../../../styles/fonts';
import { MEDIA } from '../../../styles/media';

ExpensesYear.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  expenses: PropTypes.object, // weeks -> expenses { [1]: [], [2]: [] }
};

export default function ExpensesYear (props) {
  const {
    style,
    year,
    expenses = {},
  } = props;

  const navigation = useNavigation();

  const [selectedMonthIndex, setSelectedMonthIndex] = useState();

  const [categoryId, setCategoryId] = useState(SHOW_ALL_CATEGORY_ID);

  const windowWidth = useSelector(state => state.ui.windowWidth);

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

  const filteredExpenses = filterYearExpensesByCategory(expenses, categoryId);
  const expensesGroupedByMonth = groupByMonth(filteredExpenses);
  const totalAmountsByMonths = getTotalAmountsByMonths(expensesGroupedByMonth);
  const totalExpenses = totalAmountsByMonths.reduce((total, month) => total + month, 0);

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

  const isEmptyYear = !totalExpenses;

  if (isEmptyYear) {
    return null;
  }

  return (
    <View style={[styles.expensesYear, style]}>
      <View style={[styles.titleContainer, { width: columnWidth }]}>
        <TitleLink
          style={styles.subtitleLink}
          textStyle={[styles.subtitleLinkText, {
            fontSize: subtitleFontSize,
            lineHeight: subtitleLineHeight,
          }]}
          alwaysHighlighted
          onPress={() => navigation.navigate('ExpensesMonths', { year })}
        >
          {year}
        </TitleLink>

        <CategoryDropdown
          style={styles.categoryDropdown}
          categoryId={categoryId}
          showAll
          onSelect={setCategoryId}
        />
      </View>

      <View
        style={[styles.content, {
          flexDirection: windowWidth < MEDIA.DESKTOP ? 'column' : 'row',
          alignItems: windowWidth < MEDIA.DESKTOP ? 'center' : 'flex-start',
        }]}
      >
        <YearChart
          style={{ width: chartWidth }}
          expensesByMonths={totalAmountsByMonths}
          selectedMonthIndex={selectedMonthIndex}
          onMonthSelected={setSelectedMonthIndex}
        />

        <YearStats
          style={{
            width: columnWidth,
            marginTop: statsMarginTop,
            paddingLeft: windowWidth < MEDIA.DESKTOP ? 0 : 40,
          }}
          year={year}
          expensesByMonths={totalAmountsByMonths}
          total={totalExpenses}
          selectedMonthIndex={selectedMonthIndex}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  expensesYear: {
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

  categoryDropdown: {
    width: 300,
    position: 'absolute',
    right: 0,
    top: -14,
  },

  content: {
    justifyContent: 'space-between',
  },
});
