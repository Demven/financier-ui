import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { HeaderTitle } from '@react-navigation/elements';
import { useDispatch, useSelector } from 'react-redux';
import { useDrawerStatus } from '@react-navigation/drawer';
import Logo from './Logo';
import HeaderDropdown from './HeaderDropdown';
import { setSelectedYearAction } from '../redux/reducers/ui';
import { FONT } from '../styles/fonts';
import { MEDIA } from '../styles/media';

HeaderLeft.propTypes = {
  style: PropTypes.object,
  title: PropTypes.string,
  simplified: PropTypes.bool,
};

const YEARS = [
  2023,
  2022,
  2021,
  2020,
];

export default function HeaderLeft (props) {
  const {
    style,
    title,
    simplified = false,
  } = props;

  const selectedYear = useSelector(state => state.ui.selectedYear);
  const windowWidth = useSelector(state => state.ui.windowWidth);

  const dispatch = useDispatch();

  const isDrawerOpen = useDrawerStatus() === 'open';

  return (
    <View style={[styles.headerLeft, style]}>
      {!isDrawerOpen && (
        <Logo containerStyle={styles.logo} />
      )}

      <HeaderTitle
        style={[styles.headerTitle, {
          marginTop: windowWidth < MEDIA.TABLET ? 8 : 2,
          marginLeft: windowWidth < MEDIA.TABLET ? 16 : 41,
          fontSize: windowWidth < MEDIA.TABLET ? 18 : 20,
          lineHeight: windowWidth < MEDIA.TABLET ? 18 : 26,
        }]}
      >
        {title}
      </HeaderTitle>

      {(windowWidth >= MEDIA.TABLET && !simplified) && (
        <HeaderDropdown
          style={styles.headerDropdown}
          selectedValue={selectedYear}
          values={YEARS}
          onSelect={(selectedYear) => dispatch(setSelectedYearAction({ selectedYear }))}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
  },
  headerDropdown: {
    marginLeft: 24,
  },
});
