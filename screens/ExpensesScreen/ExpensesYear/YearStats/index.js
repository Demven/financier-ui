import { StyleSheet, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import TitleLink from '../../../../components/TitleLink';
import FoldedContainer from '../../../../components/FoldedContainer';
import { formatAmount } from '../../../../services/amount';
import { MONTH_NAME } from '../../../../services/date';
import { FONT } from '../../../../styles/fonts';
import { COLOR } from '../../../../styles/colors';
import { MEDIA } from '../../../../styles/media';

YearStats.propTypes = {
  style: PropTypes.any,
  expensesByMonths: PropTypes.arrayOf(PropTypes.number).isRequired,
  year: PropTypes.number,
  selectedMonthIndex: PropTypes.number,
};

export default function YearStats (props) {
  const {
    style,
    expensesByMonths,
    year,
    selectedMonthIndex,
  } = props;

  const navigation = useNavigation();

  const windowWidth = useSelector(state => state.ui.windowWidth);

  return (
    <View style={[styles.yearStats, style]}>
      <FoldedContainer
        title={windowWidth >= MEDIA.DESKTOP ? 'Months' : 'See expenses by months'}
        disable={windowWidth >= MEDIA.DESKTOP}
      >
        <View
          style={[styles.stats, {
            marginTop: windowWidth < MEDIA.DESKTOP ? 16 : 24,
            paddingLeft: windowWidth < MEDIA.DESKTOP ? 16 : 24,
          }]}
        >
          {expensesByMonths.map((total, index) => (
            <View
              key={index}
              style={[styles.statRow, index === 0 && { marginTop: 0 }]}
            >
              <TitleLink
                textStyle={[
                  styles.statName,
                  windowWidth < MEDIA.DESKTOP && styles.statNameSmaller,
                  selectedMonthIndex === index && styles.statNameBold,
                ]}
                alwaysHighlighted={!!total}
                onPress={total > 0
                  ? () => navigation.navigate('ExpensesWeeks', { monthNumber: index + 1, year })
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
                {total > 0 ? formatAmount(-total) : '–'}
              </Text>
            </View>
          ))}
        </View>
      </FoldedContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  yearStats: {
    width: '100%',
  },

  stats: {
    width: '100%',
  },

  statRow: {
    marginTop: 16,
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
});
