import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useSelector } from 'react-redux';
import {
  useRouter,
  usePathname,
  Link,
} from 'expo-router';
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import Logo from './Logo';
import { clearStorage } from '../services/storage';
import { COLOR } from '../styles/colors';
import { FONT } from '../styles/fonts';
import { MEDIA } from '../styles/media';

export const DRAWER_PAGE = {
  OVERVIEW: 'overview',
  CATEGORIES: 'categories',
  EXPENSES: 'expenses',
  INCOMES: 'incomes',
  SAVINGS: 'savings',
  SETTINGS: 'settings',
};

const DRAWER_PAGE_LABEL = {
  [DRAWER_PAGE.OVERVIEW]: 'Overview',
  [DRAWER_PAGE.CATEGORIES]: 'Categories',
  [DRAWER_PAGE.EXPENSES]: 'Expenses',
  [DRAWER_PAGE.INCOMES]: 'Incomes',
  [DRAWER_PAGE.SAVINGS]: 'Savings',
  [DRAWER_PAGE.SETTINGS]: 'Settings',
};

const DRAWER_ICON = {
  [DRAWER_PAGE.OVERVIEW]: ({ color }) => (
    <MaterialCommunityIcons
      name='view-dashboard-outline'
      color={color}
      size={28}
    />
  ),
  [DRAWER_PAGE.CATEGORIES]: ({ color }) => (
    <MaterialCommunityIcons
      name='format-columns'
      color={color}
      size={28}
    />
  ),
  [DRAWER_PAGE.EXPENSES]: ({ color }) => (
    <MaterialIcons
      name='money-off'
      color={color}
      size={28}
    />
  ),
  [DRAWER_PAGE.INCOMES]: ({ color }) => (
    <FontAwesome5
      name='money-bill-alt'
      color={color}
      size={24}
    />
  ),
  [DRAWER_PAGE.SAVINGS]: ({ color }) => (
    <MaterialCommunityIcons
      name='bank'
      color={color}
      size={28}
    />
  ),
  [DRAWER_PAGE.SETTINGS]: ({ color }) => (
    <Ionicons
      name='settings-outline'
      color={color}
      size={28}
    />
  ),
};

const DRAWER_ITEMS = [
  {
    name: DRAWER_PAGE.OVERVIEW,
    label: DRAWER_PAGE_LABEL[DRAWER_PAGE.OVERVIEW],
    icon: DRAWER_ICON[DRAWER_PAGE.OVERVIEW],
  },
  {
    name: DRAWER_PAGE.CATEGORIES,
    label: DRAWER_PAGE_LABEL[DRAWER_PAGE.CATEGORIES],
    icon: DRAWER_ICON[DRAWER_PAGE.CATEGORIES],
  },
  {
    name: DRAWER_PAGE.EXPENSES,
    label: DRAWER_PAGE_LABEL[DRAWER_PAGE.EXPENSES],
    icon: DRAWER_ICON[DRAWER_PAGE.EXPENSES],
  },
  {
    name: DRAWER_PAGE.INCOMES,
    label: DRAWER_PAGE_LABEL[DRAWER_PAGE.INCOMES],
    icon: DRAWER_ICON[DRAWER_PAGE.INCOMES],
  },
  {
    name: DRAWER_PAGE.SAVINGS,
    label: DRAWER_PAGE_LABEL[DRAWER_PAGE.SAVINGS],
    icon: DRAWER_ICON[DRAWER_PAGE.SAVINGS],
  },
  {
    name: DRAWER_PAGE.SETTINGS,
    label: DRAWER_PAGE_LABEL[DRAWER_PAGE.SETTINGS],
    icon: DRAWER_ICON[DRAWER_PAGE.SETTINGS],
  },
];

// props are passed by react-navigation
// Read more here https://reactnavigation.org/docs/drawer-navigator/#drawercontent
export default function DrawerContent (props) {
  const router = useRouter();
  const pathname = usePathname();

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const selectedTab = useSelector(state => state.ui.selectedTab);

  const firstName = useSelector(state => state.account.firstName) || '';
  const lastName = useSelector(state => state.account.lastName) || '';

  async function onLogOut () {
    await clearStorage();

    router.push('sign-in');
  }

  return (
    <View style={styles.drawerContent}>
      <View style={styles.drawerHeader}>
        <Logo style={styles.logo} />
      </View>

      <DrawerContentScrollView
        {...props}
        style={styles.drawerScrollViewWrapper}
        contentContainerStyle={[styles.drawerScrollView, {
          marginTop: Platform.select({ ios: windowWidth < MEDIA.WIDE_MOBILE ? -54 : 0 }),
          padding: 0,
        }]}
      >
        {DRAWER_ITEMS.map(({ name, label, icon }) => {
          const isActiveRoute = pathname.includes(name);

          return (
            <Link
              key={name}
              style={[styles.drawerItem, isActiveRoute && styles.drawerItemActive]}
              href={name === DRAWER_PAGE.SETTINGS
                ? name
                : `/${name}/${selectedTab}`
              }
              disabled={isActiveRoute}
            >
              {icon(COLOR.BLACK)}

              <View style={styles.drawerLabelContainer}>
                <Text style={[styles.drawerLabel, isActiveRoute && styles.drawerLabelActive]}>
                  {label}
                </Text>
              </View>
            </Link>
          );
        })}
      </DrawerContentScrollView>

      <View style={styles.drawerFooter}>
        <Text style={styles.userNameText}>
          {firstName} {lastName[0]}.
        </Text>

        <Pressable
          style={({ pressed }) => [pressed && styles.pressed]}
          onPress={onLogOut}
        >
          <Ionicons
            style={styles.logOutIcon}
            name='log-out-outline'
            color={COLOR.BLACK}
            size={36}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flexGrow: 1,
    backgroundColor: COLOR.WHITE,
  },

  drawerHeader: {
    paddingLeft: Platform.select({ web: 42, ios: 54 }),
    paddingTop: Platform.select({ web: 24, ios: 72 }),
    paddingRight: 0,
    paddingBottom: 16,
  },
  logo: {},

  drawerScrollViewWrapper: {
    paddingTop: 16,
    paddingLeft: 16,
    backgroundColor: COLOR.WHITE,
  },

  drawerScrollView: {
    paddingTop: 88,
    flexGrow: 1,
    position: 'relative',
    padding: 0,
  },

  drawerItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 22,
    paddingRight: 12,
    paddingVertical: 12,
    marginVertical: Platform.OS === 'ios' ? 6 : 4,
  },
  drawerItemActive: {
    cursor: 'default',
  },

  drawerLabelContainer: {
    margin: 0,
    height: 32,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 32,
  },
  drawerLabel: {
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: Platform.OS === 'ios' ? 20 : 18,
    lineHeight: 38,
  },
  drawerLabelActive: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
  },

  drawerFooter: {
    paddingLeft: Platform.select({ ios: 54, web: 42 }),
    paddingTop: 8,
    paddingBottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userNameText: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
    fontSize: 18,
    color: COLOR.GRAY,
  },

  logOutIcon: {
    marginRight: 24,
  },

  pressed: {
    opacity: 0.7,
  },
});
