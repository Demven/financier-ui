import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { Link } from 'expo-router';
import { COLOR } from '../../styles/colors';
import { FONT } from '../../styles/fonts';

HeaderTab.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.string.isRequired,
  navigateTo: PropTypes.string.isRequired,
};

export default function HeaderTab (props) {
  const {
    active,
    children,
    navigateTo,
  } = props;

  return (
    <Link
      style={[styles.headerTab, active && styles.headerTabActive]}
      href={navigateTo}
    >
      <View style={styles.headerTabTextContainer}>
        <Text style={[styles.headerTabText, active && styles.headerTabActiveText]}>
          {children}
        </Text>
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  headerTab: {
    borderBottomWidth: 6,
    borderBottomColor: COLOR.TRANSPARENT,
  },
  headerTabActive: {
    borderBottomWidth: 5,
    borderBottomColor: COLOR.LIGHT_ORANGE,
  },

  headerTabTextContainer: {
    minWidth: 84,
    paddingHorizontal: 12,
    paddingBottom: 10,
    paddingTop: 10,
    boxSizing: 'content-box',
  },
  headerTabText: {
    width: '100%',
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'center',
  },
  headerTabActiveText: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
    paddingBottom: 1,
  },
});
