import { StyleSheet, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { COLOR } from '../../../../styles/colors';
import { MEDIA } from '../../../../styles/media';
import TitleLink from '../../../../components/TitleLink';
import { formatAmount, getAmountColor } from '../../../../services/amount';
import { MONTH_NAME } from '../../../../services/date';
import { FONT } from '../../../../styles/fonts';

YearStats.propTypes = {
  style: PropTypes.any,
  savingsByMonths: PropTypes.arrayOf(PropTypes.number).isRequired,
  total: PropTypes.number,
  year: PropTypes.number,
  selectedMonthIndex: PropTypes.number,
};

export default function YearStats (props) {
  const {
    style,
    savingsByMonths,
    total,
    year,
    selectedMonthIndex,
  } = props;

  const navigation = useNavigation();

  const windowWidth = useSelector(state => state.ui.windowWidth);

  const totalColor = getAmountColor(total);

  const titleFontSize = windowWidth < MEDIA.MEDIUM_DESKTOP
    ? windowWidth < MEDIA.DESKTOP
      ? windowWidth < MEDIA.WIDE_MOBILE
        ? 21 // mobile
        : 24 // tablet
      : 26 // desktop
    : 28; // large desktop

  return (
    <View style={[styles.yearStats, style]}>
      <Text
        style={[styles.title, {
          fontSize: titleFontSize,
          lineHeight: titleFontSize,
        }]}
      >
        Months
      </Text>

      <View
        style={[styles.stats, {
          marginTop: windowWidth < MEDIA.DESKTOP ? 24 : 32,
          paddingLeft: windowWidth < MEDIA.DESKTOP ? 16 : 24,
        }]}
      >
        {savingsByMonths.map((total, index) => (
          <View style={[styles.statRow, index === 0 && { marginTop: 0 }]}>
            <TitleLink
              textStyle={[
                styles.statName,
                windowWidth < MEDIA.DESKTOP && styles.statNameSmaller,
                selectedMonthIndex === index && styles.statNameBold,
              ]}
              onPress={total > 0
                ? () => navigation.navigate('SavingsWeeks', { monthNumber: index + 1, year })
                : undefined
              }
            >
              {MONTH_NAME[index + 1]}
            </TitleLink>

            <Text style={[
              styles.statValue,
              windowWidth < MEDIA.DESKTOP && styles.statValueSmaller,
              selectedMonthIndex === index && styles.statValueBold,
            ]}>
              {total > 0 ? formatAmount(total) : '–'}
            </Text>
          </View>
        ))}

        <View style={styles.underline} />

        <View style={styles.statRow}>
          <Text
            style={[
              styles.statName,
              styles.statNameBold,
              windowWidth < MEDIA.DESKTOP && styles.statNameSmaller,
              { color: totalColor },
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
            {formatAmount(total)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  yearStats: {
    width: '100%',
  },

  title: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
  },

  stats: {},

  statRow: {
    marginTop: 8,
    flexDirection: 'row',
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

  underline: {
    height: 1,
    marginTop: 12,
    marginLeft: '50%',
    backgroundColor: COLOR.BLACK,
  },
});
