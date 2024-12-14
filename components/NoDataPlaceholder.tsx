import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import AddNewEntryMenu from './AddNewEntryMenu';
import { FONT } from '../styles/fonts';
import { COLOR } from '../styles/colors';

NoDataPlaceholder.propTypes = {
  style: PropTypes.any,
};

export default function NoDataPlaceholder (props) {
  const { style } = props;

  return (
    <View style={[styles.noDataPlaceholder, style]}>
      <Text style={styles.message}>
        You don't have data entries for the selected year.
      </Text>

      <AddNewEntryMenu
        style={styles.addNewEntryMenu}
        alwaysShowLabel
      />
    </View>
  );
}

const styles = StyleSheet.create({
  noDataPlaceholder: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  message: {
    width: 300,
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 20,
    lineHeight: 32,
    color: COLOR.GRAY,
    textAlign: 'center',
  },

  addNewEntryMenu: {
    marginTop: 60,
  },
});
