import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import HeaderTabs from './HeaderTabs';
import HeaderCornerMenu from './HeaderCornerMenu';
import { MEDIA } from '../styles/media';

HeaderRight.propTypes = {
  style: PropTypes.object,
};

export default function HeaderRight ({ style }) {
  const windowWidth = useSelector(state => state.ui.windowWidth);

  return (
    <View style={[styles.headerRight, style]}>
      {windowWidth >= MEDIA.DESKTOP && (
        <HeaderTabs style={styles.headerTabs} />
      )}

      <HeaderCornerMenu style={styles.headerCornerMenu} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'right',
  },
  headerTabs: {
    marginRight: 8,
  },
  headerCornerMenu: {
    marginRight: 12,
    marginTop: 9,
  },
});
