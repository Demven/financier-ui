import { View, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import HeaderTabs from './HeaderTabs';
import { MEDIA } from '../styles/media';
import HeaderCornerMenu from "./HeaderCornerMenu";

HeaderRight.propTypes = {
  style: PropTypes.object,
};

export default function HeaderRight ({ style }) {
  const deviceWidth = Dimensions.get('window').width;

  return (
    <View style={[styles.headerRight, style]}>
      {deviceWidth >= MEDIA.DESKTOP && (
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
    marginTop: 4,
  },
});
