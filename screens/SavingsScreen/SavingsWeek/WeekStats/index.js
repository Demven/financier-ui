import { StyleSheet, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import TitleLink from '../../../../components/TitleLink';
import FoldedContainer from '../../../../components/FoldedContainer';
import { formatAmount, getAmount, getAmountColor } from '../../../../services/amount';
import { COLOR } from '../../../../styles/colors';
import { FONT } from '../../../../styles/fonts';
import { MEDIA } from '../../../../styles/media';

WeekStats.propTypes = {
  style: PropTypes.any,
  savingsAndInvestmentsGroupedByDay: PropTypes.arrayOf(PropTypes.number).isRequired,
  totalSavingsAndInvestments: PropTypes.number.isRequired,
  selectedDayIndex: PropTypes.number,
};

export default function WeekStats (props) {
  const {
    style,
    savingsAndInvestmentsGroupedByDay,
    totalSavingsAndInvestments,
    selectedDayIndex,
  } = props;

  const navigation = useNavigation();

  const windowWidth = useSelector(state => state.ui.windowWidth);

  const totalColor = getAmountColor(totalSavingsAndInvestments);

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
          {savingsAndInvestmentsGroupedByDay.flatMap((daySavingsAndInvestments, index) => (
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
                      onPress={() => navigation.navigate('Saving', {
                        saving: item?.shares ? undefined: item,
                        investment: item?.shares ? item : undefined,
                      })}
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
                    {getAmount(item)}
                  </Text>
                </View>
              ))}
            </>
          ))}

          <View style={styles.underline} />

          <View style={[styles.statRow, { marginTop: 24 }]}>
            <Text
              style={[
                styles.statName,
                styles.statNameBold,
                windowWidth < MEDIA.DESKTOP && styles.statNameSmaller,
                {
                  color: totalColor,
                  marginLeft: 4,
                },
              ]}
            >
              Total
            </Text>

            <Text
              style={[
                styles.statValue,
                styles.statValueBold,
                windowWidth < MEDIA.DESKTOP && styles.statValueSmaller,
                { color: totalColor },
              ]}
            >
              {formatAmount(totalSavingsAndInvestments)}
            </Text>
          </View>
        </View>
      </FoldedContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  weekStats: {
    width: '100%',
  },

  stats: {},

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

  underline: {
    height: 1,
    marginTop: 12,
    marginLeft: '50%',
    backgroundColor: COLOR.BLACK,
  },
});
