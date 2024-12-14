import { StyleSheet, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import PropTypes from 'prop-types';
import TitleLink from '../../TitleLink';
import CompareStats from '../../CompareStats';
import { formatAmount } from '../../../services/amount';
import IconButton from '../../IconButton';
import { ICON_COLLECTION } from '../../Icon';
import { FONT } from '../../../styles/fonts';
import { MEDIA } from '../../../styles/media';
import { COLOR } from '../../../styles/colors';

CategoryCompareStats.propTypes = {
  style: PropTypes.any,
  category: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    colorId: PropTypes.number.isRequired,
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
      id: categoryId,
      name,
      description,
      colorId,
    },
    compareWhat,
    compareTo,
    previousResult,
    previousResultName,
    allTimeAverage,
    selected,
    onPress = () => {},
  } = props;

  const router = useRouter();

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const currencySymbol = useSelector(state => state.account.currencySymbol);
  const colors = useSelector(state => state.colors);

  const titleFontSize = windowWidth < MEDIA.DESKTOP
    ? windowWidth < MEDIA.TABLET
      ? 19 // mobile
      : 24 // tablet
    : 24; // desktop
  const titleLineHeight = windowWidth < MEDIA.DESKTOP
    ? windowWidth < MEDIA.TABLET
      ? 24 // mobile
      : 30 // tablet
    : 32; // desktop

  const { hex } = colors.find(color => color.id === colorId) || {};

  const totalText = (
    <Text style={[styles.totalText, {
      fontSize: titleFontSize,
      lineHeight: titleLineHeight,
      textAlign: windowWidth <= MEDIA.WIDE_MOBILE ? 'left' : 'right',
    }]}>
      {formatAmount(compareWhat, currencySymbol)}
    </Text>
  );

  return (
    <View style={[styles.categoryCompareStats, style]}>
      <View style={styles.statsColumn}>
        <View style={styles.titles}>
          <View style={[styles.colorCode, { backgroundColor: hex }]} />

          <View style={styles.titleWrapper}>
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

            <IconButton
              style={styles.editButton}
              iconName='edit'
              iconCollection={ICON_COLLECTION.MATERIAL}
              size={24}
              color={COLOR.GRAY}
              onPress={() => router.push(`/category/${categoryId}`)}
            />
          </View>

          {!!description && (
            <Text style={styles.description}>
              {description}
            </Text>
          )}

          {windowWidth <= MEDIA.WIDE_MOBILE && (
            <View style={styles.totalTextMobileWrapper}>
              {totalText}
            </View>
          )}
        </View>

        <CompareStats
          style={[
            styles.compareStats,
            {
              marginTop: windowWidth < MEDIA.WIDE_MOBILE ? 20 : 24,
            },
            windowWidth < MEDIA.TABLET && {
              transform: [{ translateX: windowWidth < MEDIA.WIDE_MOBILE ? -25: -36 }, { scale: 0.8 }],
            },
          ]}
          compareWhat={compareWhat}
          compareTo={compareTo}
          previousResult={previousResult}
          previousResultName={String(previousResultName)}
          allTimeAverage={allTimeAverage}
          showSecondaryComparisons
          showTotal={false}
        />
      </View>

      {windowWidth > MEDIA.WIDE_MOBILE && (
        <View style={styles.totalColumn}>
          {totalText}
        </View>
      )}
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

  titleWrapper: {
    flexDirection: 'row',
  },

  editButton: {
    marginLeft: 16,
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
    alignItems: 'flex-start',
  },

  totalColumn: {
    paddingTop: 6,
    flexShrink: 0,
    flexGrow: 1,
  },

  totalTextMobileWrapper: {
    marginTop: 20,
  },

  totalText: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
  },
});
