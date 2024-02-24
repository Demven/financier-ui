import { useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import TitleLink from '../../../../components/TitleLink';
import FoldedContainer from '../../../../components/FoldedContainer';
import CompareStats from '../../../../components/CompareStats';
import ExpenseGroup from './ExpenseGroup';
import { formatAmount, getListTotal } from '../../../../services/amount';
import { COLOR } from '../../../../styles/colors';
import { FONT } from '../../../../styles/fonts';
import { MEDIA } from '../../../../styles/media';

WeekStats.propTypes = {
  style: PropTypes.any,
  monthNumber: PropTypes.number,
  weekExpenses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    categoryId: PropTypes.string,
    dateString: PropTypes.string,
    amount: PropTypes.number,
  })).isRequired,
  totalExpenses: PropTypes.number.isRequired,
  monthIncome: PropTypes.number.isRequired,
  previousWeekTotalExpenses: PropTypes.number.isRequired,
  previousMonthName: PropTypes.string.isRequired,
  allTimeWeekAverage: PropTypes.number,
  showSecondaryComparisons: PropTypes.bool.isRequired,
};

export default function WeekStats (props) {
  const {
    style,
    monthNumber,
    weekExpenses,
    totalExpenses,
    monthIncome,
    previousWeekTotalExpenses,
    previousMonthName,
    allTimeWeekAverage,
    showSecondaryComparisons,
  } = props;

  const navigation = useNavigation();

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const currencySymbol = useSelector(state => state.account.currencySymbol);

  const expensesGroupedByName = useMemo(() =>
    weekExpenses.reduce((groupedByName, expense) => {
      const name = expense.name;

      groupedByName[name] = Array.isArray(groupedByName[name])
        ? [...groupedByName[name], expense]
        : [expense];

      return groupedByName;
    }, {}), [weekExpenses]);

  return (
    <View style={[styles.weekStats, style]}>
      <FoldedContainer
        title={windowWidth < MEDIA.DESKTOP ? 'View incomes' : 'Incomes'}
        disable={windowWidth >= MEDIA.DESKTOP}
        initiallyFolded={windowWidth < MEDIA.DESKTOP}
      >
        <View
          style={[styles.stats, {
            marginTop: windowWidth < MEDIA.DESKTOP ? 16 : 40,
            paddingLeft: windowWidth < MEDIA.DESKTOP ? 16 : 24,
          }]}
        >
          {Object
            .entries(expensesGroupedByName)
            .map(([groupName, expenses], index) => (
              <View
                key={groupName}
                style={[styles.statRow, index === 0 && { marginTop: 0 }]}
              >
                <View style={styles.statNameWrapper}>
                  {expenses.length === 1 && (
                    <TitleLink
                      textStyle={[
                        styles.statName,
                        windowWidth < MEDIA.DESKTOP && styles.statNameSmaller,
                      ]}
                      alwaysHighlighted
                      onPress={() => navigation.navigate('Income', { income: expenses[0] })}
                    >
                      {groupName}
                    </TitleLink>
                  )}

                  {expenses.length > 1 && (
                    <ExpenseGroup
                      titleStyle={[
                        styles.statName,
                        windowWidth < MEDIA.DESKTOP && styles.statNameSmaller,
                      ]}
                      title={groupName}
                      expenses={expenses}
                      monthNumber={monthNumber}
                    />
                  )}
                </View>

                <Text style={[
                  styles.statValue,
                  windowWidth < MEDIA.DESKTOP && styles.statValueSmaller,
                ]}>
                  {formatAmount(getListTotal(expenses), currencySymbol)}
                </Text>
              </View>
            ))
          }
        </View>
      </FoldedContainer>

      {windowWidth < MEDIA.DESKTOP && (
        <CompareStats
          style={styles.compareStats}
          compareWhat={totalExpenses}
          compareTo={monthIncome}
          previousResult={previousWeekTotalExpenses}
          previousResultName={previousMonthName}
          allTimeAverage={allTimeWeekAverage}
          showSecondaryComparisons={showSecondaryComparisons}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  weekStats: {
    width: '100%',
  },

  stats: {
    width: '100%',
  },

  statRow: {
    marginTop: 16,
    flexDirection: 'row',
  },

  statNameWrapper: {
    flexGrow: 1,
    alignItems: 'flex-start',
  },

  statName: {
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 20,
    lineHeight: 24,
    color: COLOR.DARK_GRAY,
  },
  statNameBold: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
  },
  statNameSmaller: {
    fontSize: 18,
    lineHeight: 23,
  },

  statValue: {
    marginLeft: 'auto',
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 20,
    lineHeight: 24,
    color: COLOR.DARK_GRAY,
    userSelect: 'text',
  },
  statValueBold: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
  },
  statValueSmaller: {
    fontSize: 18,
    lineHeight: 23,
  },

  compareStats: {
    marginTop: 40,
  },
});
