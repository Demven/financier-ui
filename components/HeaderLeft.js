import { View, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { HeaderTitle } from '@react-navigation/elements';
import { useDispatch, useSelector } from 'react-redux';
import { useDrawerStatus } from '@react-navigation/drawer';
import Logo from './Logo';
import HeaderDropdown from './HeaderDropdown';
import { setSelectedYear } from '../redux/reducers/ui';
import { FONT } from '../styles/fonts';
import { MEDIA } from '../styles/media';

const deviceWidth = Dimensions.get('window').width;

HeaderLeft.propTypes = {
  style: PropTypes.object,
  title: PropTypes.string,
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
  } = props;

  const selectedYear = useSelector(state => state.ui.selectedYear);
  const dispatch = useDispatch();

  const isDrawerOpen = useDrawerStatus() === 'open';

  return (
    <View style={[styles.headerLeft, style]}>
      {!isDrawerOpen && (
        <Logo containerStyle={styles.logo} />
      )}

      <HeaderTitle style={styles.headerTitle}>
        {title}
      </HeaderTitle>

      {deviceWidth >= MEDIA.TABLET && (
        <HeaderDropdown
          style={styles.headerDropdown}
          selectedValue={selectedYear}
          values={YEARS}
          onSelect={(selectedYear) => dispatch(setSelectedYear({ selectedYear }))}
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
    marginTop: deviceWidth < MEDIA.TABLET ? 8 : 2,
    marginLeft: deviceWidth < MEDIA.TABLET ? 16 : 34,
    fontFamily: FONT.NOTO_SERIF.BOLD,
    fontSize: deviceWidth < MEDIA.TABLET ? 18 : 20,
    lineHeight: deviceWidth < MEDIA.TABLET ? 18 : 26,
  },
  headerDropdown: {
    marginLeft: 24,
  },
});
