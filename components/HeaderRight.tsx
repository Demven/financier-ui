import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import HeaderTabs from './HeaderTabs';
import AddNewEntryMenu from './AddNewEntryMenu';
import { MEDIA } from '../styles/media';

HeaderRight.propTypes = {
  style: PropTypes.object,
  routeName: PropTypes.string.isRequired,
};

export default function HeaderRight ({ style, routeName }) {
  const windowWidth = useSelector(state => state.ui.windowWidth);

  return (
    <View style={[styles.headerRight, style]}>
      {windowWidth >= MEDIA.DESKTOP && (
        <HeaderTabs
          style={styles.headerTabs}
          routeName={routeName}
        />
      )}

      <AddNewEntryMenu
        style={[styles.addNewEntryMenu, {
          marginTop: windowWidth >= MEDIA.DESKTOP ? 9 : 0,
        }]}
      />
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

  addNewEntryMenu: {
    marginRight: 12,
  },
});
