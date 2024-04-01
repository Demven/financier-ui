import { StyleSheet, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import TitleLink from '../../../components/TitleLink';
import CompareStats from '../../../components/CompareStats';
import { formatAmount } from '../../../services/amount';
import { FONT } from '../../../styles/fonts';
import { MEDIA } from '../../../styles/media';
import { COLOR } from '../../../styles/colors';

CategoryCompareStats.propTypes = {
  style: PropTypes.any,
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    color: PropTypes.shape({
      hex: PropTypes.string,
    }).isRequired,
  }).isRequired,
  compareWhat: PropTypes.number,
  compareTo: PropTypes.number,
  previousResult: PropTypes.number,
  previousResultName: PropTypes.string,
  allTimeAverage: PropTypes.number,
  selected: PropTypes.bool,
  onPress: PropTypes.func,
};

export default function CategoryCompareStats (props) {
  const {
    style,
    category: {
      name,
      description,
      color: { hex },
    },
    compareWhat,
    compareTo,
    previousResult,
    previousResultName,
    allTimeAverage,
    selected,
    onPress = () => {},
  } = props;

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const currencySymbol = useSelector(state => state.account.currencySymbol);

  const titleFontSize = windowWidth < MEDIA.DESKTOP
    ? windowWidth < MEDIA.TABLET
      ? 28 // mobile
      : 36 // tablet
    : 24; // desktop
  const titleLineHeight = windowWidth < MEDIA.DESKTOP
    ? windowWidth < MEDIA.TABLET
      ? 32 // mobile
      : 40 // tablet
    : 32; // desktop

  return (
    <View style={[styles.categoryCompareStats, style]}>
      <View style={styles.statsColumn}>
        <View style={styles.titles}>
          <View style={[styles.colorCode, { backgroundColor: hex }]} />

          <TitleLink
            style={styles.titleLink}
            textStyle={[styles.titleLinkText, {
              fontSize: titleFontSize,
              lineHeight: titleLineHeight,
            }, selected && styles.titleLinkTextSelected]}
            alwaysHighlighted
            onPress={onPress}
          >
            {name}
          </TitleLink>

          {!!description && (
            <Text style={styles.description}>
              {description}
            </Text>
          )}
        </View>

        <CompareStats
          style={styles.compareStats}
          compareWhat={compareWhat}
          compareTo={compareTo}
          previousResult={previousResult}
          previousResultName={previousResultName}
          allTimeAverage={allTimeAverage}
          showSecondaryComparisons
          showTotal={false}
        />
      </View>

      <View style={styles.totalColumn}>
        <Text style={styles.totalText}>
          {formatAmount(compareWhat, currencySymbol)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  categoryCompareStats: {
    width: '100%',
    flexDirection: 'row',
  },

  statsColumn: {
    width: '70%',
  },

  titles: {
    position: 'relative',
  },

  colorCode: {
    width: 24,
    height: 24,
    position: 'absolute',
    left: -36,
    top: 7,
    borderWidth: 1,
    borderRadius: '50%',
    borderColor: COLOR.LIGHT_GRAY,
  },

  titleLink: {
    alignSelf: 'flex-start',
  },
  titleLinkText: {
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 24,
    lineHeight: 32,
  },
  titleLinkTextSelected: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
  },

  description: {
    marginTop: 24,
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 14,
    lineHeight: 16,
  },

  compareStats: {
    marginTop: 32,
    alignItems: 'flex-start',
  },

  totalColumn: {
    paddingTop: 12,
    flexShrink: 0,
    flexGrow: 1,
  },

  totalText: {
    textAlign: 'right',
    fontFamily: FONT.NOTO_SERIF.BOLD,
    fontSize: 24,
    lineHeight: 24,
  },
});
