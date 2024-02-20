import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Icon, { ICON_COLLECTION } from './Icon';
import { formatAmount, getAmountColor } from '../services/amount';
import { FONT } from '../styles/fonts';
import { COLOR } from '../styles/colors';

CompareStats.propTypes = {
  style: PropTypes.object,
  compareWhat: PropTypes.number.isRequired,
  compareTo: PropTypes.number.isRequired,
  previousResult: PropTypes.number.isRequired,
  previousResultName: PropTypes.string.isRequired,
  allTimeAverage: PropTypes.number.isRequired,
  showSecondaryComparisons: PropTypes.bool,
};

export default function CompareStats (props) {
  const {
    style,
    compareWhat,
    compareTo,
    previousResult,
    previousResultName,
    allTimeAverage,
    showSecondaryComparisons,
  } = props;

  const currencySymbol = useSelector(state => state.account.currencySymbol);

  const expensesToIncomeRatio = Math.round(Math.abs(compareWhat) * 100 / compareTo);

  const compareToPreviousResult = !!previousResult
    ? Math.round(compareWhat * 100 / previousResult)
    : 0;
  const changeComparedToPreviousResult = 100 - compareToPreviousResult;

  const compareToAllTimeAverage = !!allTimeAverage
    ? Math.round(compareWhat * 100 / allTimeAverage)
    : 0;
  const changeComparedToAllTimeAverage = 100 - compareToAllTimeAverage;

  const changeComparedToPreviousResultColor = previousResult
    ? getAmountColor(changeComparedToPreviousResult)
    : COLOR.GRAY;
  const changeComparedToAllTimeAverageColor = allTimeAverage && getAmountColor(changeComparedToAllTimeAverage);

  const secondaryComparisonsToShow = showSecondaryComparisons && (!!previousResult || !!changeComparedToAllTimeAverage);

  return (
    <View style={[
      styles.compareStats,
      style,
      !secondaryComparisonsToShow && styles.compareStatsWithoutSecondaryComparisons,
    ]}>
      <View style={styles.comparisons}>
        {!!compareTo && (
          <View style={styles.circle}>
            <Text style={[styles.circleText, { color: changeComparedToPreviousResultColor }]}>
              {expensesToIncomeRatio}%
            </Text>

            <Text style={styles.circleSubText}>
              of income
            </Text>
          </View>
        )}

        {secondaryComparisonsToShow && (
          <View style={styles.secondaryComparisons}>
            {!!previousResult && (
              <View style={styles.comparisonRow}>
                <Icon
                  style={styles.icon}
                  name={changeComparedToPreviousResult > 0 ? 'trending-up' : 'trending-down'}
                  collection={ICON_COLLECTION.MATERIAL_COMMUNITY}
                  size={36}
                  color={changeComparedToPreviousResultColor}
                />

                <Text style={[styles.comparisonValue, { color: changeComparedToPreviousResultColor }]}>
                  {formatAmount(changeComparedToPreviousResult)}%
                </Text>

                <Text style={styles.comparisonDescription}>
                  (compared to {previousResultName})
                </Text>
              </View>
            )}

            {!!allTimeAverage && changeComparedToAllTimeAverage !== 0 && (
              <View style={[styles.comparisonRow, { marginTop: -6 }]}>
                <Icon
                  style={styles.icon}
                  name={changeComparedToAllTimeAverage > 0 ? 'trending-up' : 'trending-down'}
                  collection={ICON_COLLECTION.MATERIAL_COMMUNITY}
                  size={36}
                  color={changeComparedToAllTimeAverageColor}
                />

                <Text style={[styles.comparisonValue, { color: changeComparedToAllTimeAverageColor }]}>
                  {formatAmount(changeComparedToAllTimeAverage)}%
                </Text>

                <Text style={styles.comparisonDescription}>
                  (all-time average)
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={[styles.total, !secondaryComparisonsToShow && styles.totalWithoutSecondaryComparisons]}>
        {formatAmount(compareWhat, currencySymbol)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  compareStats: {
    alignItems: 'flex-end',
  },
  compareStatsWithoutSecondaryComparisons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  comparisons: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  circle: {
    width: 84,
    height: 84,
    borderWidth: 3,
    borderColor: COLOR.GRAY,
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  circleText: {
    marginTop: 4,
    fontFamily: FONT.NOTO_SERIF.BOLD,
    fontSize: 28,
    lineHeight: 28,
    color: COLOR.GRAY,
    userSelect: 'auto',
  },
  circleSubText: {
    marginTop: 4,
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 10,
    lineHeight: 10,
    color: COLOR.BLACK,
    userSelect: 'auto',
  },

  secondaryComparisons: {
    marginLeft: 16,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comparisonValue: {
    marginLeft: 12,
    fontFamily: FONT.NOTO_SERIF.BOLD,
    fontSize: 18,
    lineHeight: 18,
  },
  comparisonDescription: {
    marginLeft: 16,
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 14,
    lineHeight: 14,
    color: COLOR.DARK_GRAY,
  },

  total: {
    marginTop: 32,
    fontFamily: FONT.NOTO_SERIF.BOLD,
    fontSize: 34,
    lineHeight: 34,
  },
  totalWithoutSecondaryComparisons: {
    marginTop: 0,
    marginLeft: 32,
  },
});
