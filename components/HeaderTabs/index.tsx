import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import HeaderTab from './HeaderTab';

HeaderTabs.propTypes = {
  style: PropTypes.object,
  routeName: PropTypes.string.isRequired,
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
export const TABS = [
  TAB.WEEKS,
  TAB.MONTHS,
  TAB.YEARS,
];

export function getTabBarIcon (selectedTab, color, size) {
  if (selectedTab === TAB.WEEKS) {
    return (
      <MaterialCommunityIcons
        name='calendar-week'
        color={color}
        size={size}
      />
    );
  } else if (selectedTab === TAB.MONTHS) {
    return (
      <MaterialCommunityIcons
        name='calendar-text'
        color={color}
        size={size}
      />
    );
  } else if (selectedTab === TAB.YEARS) {
    return (
      <Ionicons
        name='calendar-sharp'
        color={color}
        size={size}
      />
    );
  }
}

export default function HeaderTabs (props) {
  const { style, routeName } = props;

  const pagePath = routeName.split('/')[0];
  const correctedPagePath = pagePath === 'index' || !pagePath
    ? 'overview'
    : pagePath;

  const selectedTab = useSelector(state => state.ui.selectedTab);

  return (
    <View style={[styles.headerTabs, style]}>
      <HeaderTab
        active={selectedTab === TAB.WEEKS}
        navigateTo={`${correctedPagePath}/${TAB.WEEKS}`}
      >
        {TAB_NAME[TAB.WEEKS]}
      </HeaderTab>

      <HeaderTab
        active={selectedTab === TAB.MONTHS}
        navigateTo={`${correctedPagePath}/${TAB.MONTHS}`}
      >
        {TAB_NAME[TAB.MONTHS]}
      </HeaderTab>

      <HeaderTab
        active={selectedTab === TAB.YEARS}
        navigateTo={`${correctedPagePath}/${TAB.YEARS}`}
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
    bottom: -5,
  },
});
