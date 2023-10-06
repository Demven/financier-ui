import { StyleSheet, View, Text, Pressable } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS } from '../../styles/colors';

HeaderTab.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default function HeaderTab (props) {
  const {
    active,
    children,
    onPress,
  } = props;

  return (
    <Pressable
      style={({ pressed }) => [styles.headerTab, pressed && styles.headerTabPressed, active && styles.headerTabActive]}
      onPress={onPress}
    >
      <View style={styles.headerTabTextContainer}>
        <Text style={[styles.headerTabText, active && styles.headerTabActiveText]}>
          {children}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerTab: {
    borderBottomWidth: 6,
    borderBottomColor: COLORS.TRANSPARENT,
  },

  headerTabPressed: {},
  headerTabActive: {
    borderBottomWidth: 5,
    borderBottomColor: COLORS.LIGHT_ORANGE,
  },

  headerTabTextContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headerTabText: {
    fontSize: 21,
  },
  headerTabActiveText: {
    fontWeight: 'bold',
  },
});
