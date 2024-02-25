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
import ItemGroup from '../../../../components/ItemGroup';
import { formatAmount, getListTotal } from '../../../../services/amount';
import { COLOR } from '../../../../styles/colors';
import { FONT } from '../../../../styles/fonts';
import { MEDIA } from '../../../../styles/media';

WeekStats.propTypes = {
  style: PropTypes.any,
  monthNumber: PropTypes.number,
  monthIncome: PropTypes.number,
  weekIncomes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    dateString: PropTypes.string,
    amount: PropTypes.number,
  })).isRequired,
  weekIncomesTotal: PropTypes.number.isRequired,
  previousWeekTotalExpenses: PropTypes.number.isRequired,
  previousMonthName: PropTypes.string.isRequired,
  allTimeWeekAverage: PropTypes.number,
};

export default function WeekStats (props) {
  const {
    style,
    monthNumber,
    monthIncome,
    weekIncomes,
    weekIncomesTotal,
    previousWeekTotalExpenses,
    previousMonthName,
    allTimeWeekAverage,
  } = props;

  const navigation = useNavigation();

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const currencySymbol = useSelector(state => state.account.currencySymbol);

  const incomesGroupedByName = useMemo(() =>
    weekIncomes.reduce((groupedByName, income) => {
      const name = income.name;

      groupedByName[name] = Array.isArray(groupedByName[name])
        ? [...groupedByName[name], income]
        : [income];

      return groupedByName;
    }, {}), [weekIncomes]);

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
            .entries(incomesGroupedByName)
            .map(([groupName, incomes], index) => (
              <View
                key={groupName}
                style={[styles.statRow, index === 0 && { marginTop: 0 }]}
              >
                <View style={styles.statNameWrapper}>
                  {incomes.length === 1 && (
                    <TitleLink
                      textStyle={[
                        styles.statName,
                        windowWidth < MEDIA.DESKTOP && styles.statNameSmaller,
                      ]}
                      alwaysHighlighted
                      onPress={() => navigation.navigate('Income', { income: incomes[0] })}
                    >
                      {groupName}
                    </TitleLink>
                  )}

                  {incomes.length > 1 && (
                    <ItemGroup
                      titleStyle={[
                        styles.statName,
                        windowWidth < MEDIA.DESKTOP && styles.statNameSmaller,
                      ]}
                      title={groupName}
                      items={incomes}
                      monthNumber={monthNumber}
                      onPressItem={income => navigation.navigate('Income', { income })}
                    />
                  )}
                </View>

                <Text style={[
                  styles.statValue,
                  windowWidth < MEDIA.DESKTOP && styles.statValueSmaller,
                ]}>
                  {formatAmount(getListTotal(incomes), currencySymbol)}
                </Text>
              </View>
            ))
          }
        </View>
      </FoldedContainer>

      {windowWidth < MEDIA.DESKTOP && (
        <CompareStats
          style={styles.compareStats}
          compareWhat={weekIncomesTotal}
          compareTo={monthIncome}
          previousResult={previousWeekTotalExpenses}
          previousResultName={previousMonthName}
          allTimeAverage={allTimeWeekAverage}
          showSecondaryComparisons
          circleSubText='of month'
          circleSubTextColor={COLOR.GRAY}
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
