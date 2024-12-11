import { StyleSheet, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import PropTypes from 'prop-types';
import TitleLink from '../../../TitleLink';
import FoldedContainer from '../../../FoldedContainer';
import CompareStats from '../../../CompareStats';
import { formatAmount, getAmount } from '../../../../services/amount';
import { COLOR } from '../../../../styles/colors';
import { FONT } from '../../../../styles/fonts';
import { MEDIA } from '../../../../styles/media';

WeekStats.propTypes = {
  style: PropTypes.any,
  savingsAndInvestmentsGroupedByDay: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    ticker: PropTypes.string,
    shares: PropTypes.number,
    pricePerShare: PropTypes.number,
  }))).isRequired,
  totalSavingsAndInvestments: PropTypes.number.isRequired,
  selectedDayIndex: PropTypes.number,
  monthTotalSavingsAndInvestments: PropTypes.number.isRequired,
  previousWeekSavingsAndInvestments: PropTypes.number,
  previousMonthName: PropTypes.string,
  allTimeWeekAverage: PropTypes.number.isRequired,
};

export default function WeekStats (props) {
  const {
    style,
    savingsAndInvestmentsGroupedByDay,
    totalSavingsAndInvestments,
    selectedDayIndex,
    monthTotalSavingsAndInvestments,
    previousWeekSavingsAndInvestments,
    previousMonthName,
    allTimeWeekAverage,
  } = props;

  const router = useRouter();

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const currencySymbol = useSelector(state => state.account.currencySymbol);

  return (
    <View style={[styles.weekStats, style]}>
      <FoldedContainer
        title='Savings & Investments'
        disable={windowWidth >= MEDIA.DESKTOP}
      >
        <View
          style={[styles.stats, {
            marginTop: windowWidth < MEDIA.DESKTOP ? 16 : 40,
            paddingLeft: windowWidth < MEDIA.DESKTOP ? 16 : 24,
          }]}
        >
          {savingsAndInvestmentsGroupedByDay.flatMap(daySavingsAndInvestments => (
            <>
              {daySavingsAndInvestments?.map((item, index) => (
                <View
                  key={index}
                  style={[styles.statRow, index === 0 && { marginTop: 0 }]}
                >
                  <View style={styles.statNameWrapper}>
                    <TitleLink
                      textStyle={[
                        styles.statName,
                        windowWidth < MEDIA.DESKTOP && styles.statNameSmaller,
                        selectedDayIndex === index && styles.statNameBold,
                      ]}
                      alwaysHighlighted
                      onPress={() => router.push(`/${item?.shares ? 'investment' : 'saving'}/${item.id}`)}
                    >
                      {item.name}
                    </TitleLink>

                    {!!item.shares && (
                      <Text style={styles.sharesText}>
                        {item.shares} {item.ticker} * {item.pricePerShare}
                      </Text>
                    )}
                  </View>


                  <Text style={[
                    styles.statValue,
                    windowWidth < MEDIA.DESKTOP && styles.statValueSmaller,
                    selectedDayIndex === index && styles.statValueBold,
                  ]}>
                    {formatAmount(getAmount(item), currencySymbol)}
                  </Text>
                </View>
              ))}
            </>
          ))}
        </View>
      </FoldedContainer>

      {windowWidth < MEDIA.DESKTOP && (
        <CompareStats
          style={styles.compareStats}
          compareWhat={totalSavingsAndInvestments}
          compareTo={monthTotalSavingsAndInvestments}
          previousResult={previousWeekSavingsAndInvestments}
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

  sharesText: {
    marginTop: 2,
    marginLeft: 12,
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 12,
    lineHeight: 18,
    color: COLOR.DARK_GRAY,
  },

  compareStats: {
    marginTop: 40,
  },
});
