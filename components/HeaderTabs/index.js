import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import PropTypes from 'prop-types';
import HeaderTab from './HeaderTab';

HeaderTabs.propTypes = {
  style: PropTypes.object,
};

export const TAB = {
  WEEKS: 'weeks',
  MONTHS: 'months',
  YEARS: 'years',
};
export const TAB_NAME = {
  [TAB.WEEKS]: 'Weeks',
  [TAB.MONTHS]: 'Months',
  [TAB.YEARS]: 'Years',
};
const TABS = [
  TAB.WEEKS,
  TAB.MONTHS,
  TAB.YEARS,
];

export default function HeaderTabs (props) {
  const {
    style,
  } = props;

  const navigation = useNavigation();
  const route = useRoute();

  console.info('route', route);

  const navigateToPage = route.name;
  const selectedTab = route.params?.type;

  return (
    <View style={[styles.headerTabs, style]}>
      <HeaderTab
        active={selectedTab === TAB.WEEKS}
        onPress={() => navigation.navigate(navigateToPage, { type: TAB.WEEKS })}
      >
        {TAB_NAME[TAB.WEEKS]}
      </HeaderTab>

      <HeaderTab
        active={selectedTab === TAB.MONTHS}
        onPress={() => navigation.navigate(navigateToPage, { type: TAB.MONTHS })}
      >
        {TAB_NAME[TAB.MONTHS]}
      </HeaderTab>

      <HeaderTab
        active={selectedTab === TAB.YEARS}
        onPress={() => navigation.navigate(navigateToPage, { type: TAB.YEARS })}
      >
        {TAB_NAME[TAB.YEARS]}
      </HeaderTab>
    </View>
  );
}

const styles = StyleSheet.create({
  headerTabs: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    bottom: -9,
  },
});
