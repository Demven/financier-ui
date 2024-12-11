import { Tabs } from 'expo-router/tabs';
import { useSelector } from 'react-redux';
import {
  TAB,
  TAB_NAME,
  getTabBarIcon,
} from '../../../../components/HeaderTabs';
import { COLOR } from '../../../../styles/colors';
import { MEDIA } from '../../../../styles/media';

export default function ExpensesLayout () {
  const windowWidth = useSelector(state => state.ui.windowWidth);
  const selectedTab = useSelector(state => state.ui.selectedTab);

  return (
    <Tabs
      initialRouteName={TAB.MONTHS}
      screenOptions={() => ({
        title: selectedTab === TAB.YEARS
          ? 'All Expenses'
          : 'Expenses',
        headerStyle: { backgroundColor: COLOR.WHITE },
        headerTintColor: COLOR.BLACK,
        tabBarStyle: {
          backgroundColor: COLOR.WHITE,
          display: windowWidth >= MEDIA.DESKTOP ? 'none' : undefined,
        },
        tabBarActiveTintColor: COLOR.BLACK,
        headerShown: false,
      })}
    >
      <Tabs.Screen
        name={TAB.WEEKS}
        options={{
          tabBarIcon: ({ color, size }) => getTabBarIcon(TAB.WEEKS, color, size),
          tabBarLabel: TAB_NAME[TAB.WEEKS],
        }}
      />

      <Tabs.Screen
        name={TAB.MONTHS}
        options={{
          tabBarIcon: ({ color, size }) => getTabBarIcon(TAB.MONTHS, color, size),
          tabBarLabel: TAB_NAME[TAB.MONTHS],
        }}
      />

      <Tabs.Screen
        name={TAB.YEARS}
        options={{
          tabBarIcon: ({ color, size }) => getTabBarIcon(TAB.YEARS, color, size),
          tabBarLabel: TAB_NAME[TAB.YEARS],
        }}
      />
    </Tabs>
  );
}
