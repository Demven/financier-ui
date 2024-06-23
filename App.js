import { useState } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import { useCallback, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  useSelector,
  Provider,
  useDispatch,
} from 'react-redux';
import 'react-native-gesture-handler';
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import OverviewScreen from './screens/OverviewScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import ExpensesScreen from './screens/ExpensesScreen';
import IncomesScreen from './screens/IncomesScreen';
import SavingsScreen from './screens/SavingsScreen';
import SettingsScreen from './screens/SettingsScreen';
import SignInScreen from './screens/SignInScreen';
import ConfirmEmailScreen from './screens/ConfirmEmailScreen';
import ExpenseScreen from './screens/ExpenseScreen';
import SavingScreen from './screens/SavingScreen';
import IncomeScreen from './screens/IncomeScreen';
import CategoryScreen from './screens/CategoryScreen';
import HeaderLeft from './components/HeaderLeft';
import HeaderRight from './components/HeaderRight';
import DrawerContent from './components/DrawerContent';
import Toast from './components/Toast';
import { TAB, TABS, TAB_NAME } from './components/HeaderTabs';
import {
  STORAGE_KEY,
  saveToStorage,
  retrieveFromStorage,
} from './services/storage';
import { getPathName } from './services/location';
import { validateToken } from './services/api/auth';
import { fetchBasics } from './services/api/basics';
import { fetchOverviewForYear } from './services/api/overview';
import { setAccountAction } from './redux/reducers/account';
import { setCategoriesAction } from './redux/reducers/categories';
import { setExpensesAction, setExpensesTotalsAction } from './redux/reducers/expenses';
import {
  setSavingsAction,
  setSavingsTotalsAction,
  setInvestmentsAction,
  setInvestmentsTotalsAction,
} from './redux/reducers/savings';
import {
  setWindowWidthAction,
  setSelectedTabAction,
  setSelectedYearAction,
  reinitializeAction,
} from './redux/reducers/ui';
import { setIncomesAction, setIncomesTotalsAction } from './redux/reducers/incomes';
import { setColorsAction } from './redux/reducers/colors';
import { store } from './redux/store';
import { MEDIA } from './styles/media';
import { FONT } from './styles/fonts';
import { COLOR } from './styles/colors';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const BottomTabs = createBottomTabNavigator();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const CONFIRM_EMAIL_PATH = 'confirm-email';

function OverviewScreens () {
  const windowWidth = useSelector(state => state.ui.windowWidth);

  return (
    <BottomTabs.Navigator
      initialRouteName='OverviewMonths'
      screenOptions={() => ({
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
      <BottomTabs.Screen
        name='OverviewWeeks'
        component={OverviewScreen}
        initialParams={{
          type: TAB.WEEKS,
          monthNumber: undefined,
        }}
        options={{
          title: 'Overview',
          tabBarLabel: TAB_NAME[TAB.WEEKS],
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name='calendar-week'
              color={color}
              size={size}
            />
          ),
        }}
      />

      <BottomTabs.Screen
        name='OverviewMonths'
        component={OverviewScreen}
        initialParams={{
          type: TAB.MONTHS,
          year: undefined,
        }}
        options={{
          title: 'Overview',
          tabBarLabel: TAB_NAME[TAB.MONTHS],
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name='calendar-text'
              color={color}
              size={size}
            />
          ),
        }}
      />

      <BottomTabs.Screen
        name='OverviewYears'
        component={OverviewScreen}
        initialParams={{
          type: TAB.YEARS,
        }}
        options={{
          title: 'All Expenses',
          tabBarLabel: TAB_NAME[TAB.YEARS],
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='calendar-sharp'
              color={color}
              size={size}
            />
          )
        }}
      />
    </BottomTabs.Navigator>
  );
}

function CategoriesScreens () {
  const windowWidth = useSelector(state => state.ui.windowWidth);

  return (
    <BottomTabs.Navigator
      initialRouteName='CategoriesMonths'
      screenOptions={() => ({
        headerStyle: { backgroundColor: 'white' },
        headerTintColor: 'black',
        tabBarStyle: {
          backgroundColor: 'white',
          display: windowWidth >= MEDIA.DESKTOP ? 'none' : undefined,
        },
        tabBarActiveTintColor: 'black',
        headerShown: false,
      })}
    >
      <BottomTabs.Screen
        name='CategoriesWeeks'
        component={CategoriesScreen}
        initialParams={{
          type: TAB.WEEKS,
        }}
        options={{
          title: 'Categories',
          tabBarLabel: TAB_NAME[TAB.WEEKS],
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name='calendar-week'
              color={color}
              size={size}
            />
          ),
        }}
      />

      <BottomTabs.Screen
        name='CategoriesMonths'
        component={CategoriesScreen}
        initialParams={{
          type: TAB.MONTHS,
        }}
        options={{
          title: 'Categories',
          tabBarLabel: TAB_NAME[TAB.MONTHS],
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name='calendar-text'
              color={color}
              size={size}
            />
          ),
        }}
      />

      <BottomTabs.Screen
        name='CategoriesYears'
        component={CategoriesScreen}
        initialParams={{
          type: TAB.YEARS,
        }}
        options={{
          title: 'Categories',
          tabBarLabel: TAB_NAME[TAB.YEARS],
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='calendar-sharp'
              color={color}
              size={size}
            />
          )
        }}
      />
    </BottomTabs.Navigator>
  );
}

function ExpensesScreens () {
  const windowWidth = useSelector(state => state.ui.windowWidth);

  return (
    <BottomTabs.Navigator
      initialRouteName='ExpensesMonths'
      screenOptions={() => ({
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
      <BottomTabs.Screen
        name='ExpensesWeeks'
        component={ExpensesScreen}
        initialParams={{
          type: TAB.WEEKS,
          monthNumber: undefined,
          weekNumber: undefined,
        }}
        options={{
          title: 'Expenses',
          tabBarLabel: TAB_NAME[TAB.WEEKS],
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name='calendar-week'
              color={color}
              size={size}
            />
          ),
        }}
      />

      <BottomTabs.Screen
        name='ExpensesMonths'
        component={ExpensesScreen}
        initialParams={{
          type: TAB.MONTHS,
          year: undefined,
        }}
        options={{
          title: 'Expenses',
          tabBarLabel: TAB_NAME[TAB.MONTHS],
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name='calendar-text'
              color={color}
              size={size}
            />
          ),
        }}
      />

      <BottomTabs.Screen
        name='ExpensesYears'
        component={ExpensesScreen}
        initialParams={{
          type: TAB.YEARS,
        }}
        options={{
          title: 'All Expenses',
          tabBarLabel: TAB_NAME[TAB.YEARS],
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='calendar-sharp'
              color={color}
              size={size}
            />
          )
        }}
      />
    </BottomTabs.Navigator>
  );
}

function IncomesScreens () {
  const windowWidth = useSelector(state => state.ui.windowWidth);

  return (
    <BottomTabs.Navigator
      initialRouteName='IncomesMonths'
      screenOptions={() => ({
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
      <BottomTabs.Screen
        name='IncomesWeeks'
        component={IncomesScreen}
        initialParams={{
          type: TAB.WEEKS,
          monthNumber: undefined,
          weekNumber: undefined,
        }}
        options={{
          title: 'Incomes',
          tabBarLabel: TAB_NAME[TAB.WEEKS],
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name='calendar-week'
              color={color}
              size={size}
            />
          ),
        }}
      />

      <BottomTabs.Screen
        name='IncomesMonths'
        component={IncomesScreen}
        initialParams={{
          type: TAB.MONTHS,
          year: undefined,
        }}
        options={{
          title: 'Incomes',
          tabBarLabel: TAB_NAME[TAB.MONTHS],
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name='calendar-text'
              color={color}
              size={size}
            />
          ),
        }}
      />

      <BottomTabs.Screen
        name='IncomesYears'
        component={IncomesScreen}
        initialParams={{
          type: TAB.YEARS,
        }}
        options={{
          title: 'All Incomes',
          tabBarLabel: TAB_NAME[TAB.YEARS],
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='calendar-sharp'
              color={color}
              size={size}
            />
          )
        }}
      />
    </BottomTabs.Navigator>
  );
}

function SavingsScreens () {
  const windowWidth = useSelector(state => state.ui.windowWidth);

  return (
    <BottomTabs.Navigator
      initialRouteName='SavingsMonths'
      screenOptions={() => ({
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
      <BottomTabs.Screen
        name='SavingsWeeks'
        component={SavingsScreen}
        initialParams={{
          type: TAB.WEEKS,
          monthNumber: undefined,
          weekNumber: undefined,
        }}
        options={{
          title: 'Savings',
          tabBarLabel: TAB_NAME[TAB.WEEKS],
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name='calendar-week'
              color={color}
              size={size}
            />
          ),
        }}
      />

      <BottomTabs.Screen
        name='SavingsMonths'
        component={SavingsScreen}
        initialParams={{
          type: TAB.MONTHS,
          year: undefined,
        }}
        options={{
          title: 'Savings',
          tabBarLabel: TAB_NAME[TAB.MONTHS],
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name='calendar-text'
              color={color}
              size={size}
            />
          ),
        }}
      />

      <BottomTabs.Screen
        name='SavingsYears'
        component={SavingsScreen}
        initialParams={{
          type: TAB.YEARS,
        }}
        options={{
          title: 'All Savings',
          tabBarLabel: TAB_NAME[TAB.YEARS],
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='calendar-sharp'
              color={color}
              size={size}
            />
          )
        }}
      />
    </BottomTabs.Navigator>
  );
}

function DrawerNavigator () {
  const windowWidth = useSelector(state => state.ui.windowWidth);

  return (
    <Drawer.Navigator
      initialRouteName='Overview'
      screenOptions={() => ({
        headerTitle: ({ children }) => (
          <HeaderLeft
            style={styles.headerLeft}
            title={children}
          />
        ),
        headerTitleAlign: 'left',
        headerTitleContainerStyle: { margin: 0 },
        headerRight: () => (
          <HeaderRight />
        ),
        headerStyle: { backgroundColor: COLOR.WHITE },
        headerTintColor: COLOR.BLACK,
        sceneContainerStyle: { backgroundColor: COLOR.WHITE, flexGrow: 1 },
        drawerContentStyle: { paddingTop: 16, paddingLeft: 16, backgroundColor: COLOR.WHITE },
        drawerItemStyle: [styles.drawerItemStyle, { paddingVertical: windowWidth >= MEDIA.DESKTOP ? 2 : 4 }],
        drawerLabelStyle: styles.drawerLabelStyle,
        drawerActiveTintColor: COLOR.BLACK,
        drawerInactiveTintColor: COLOR.BLACK,
        drawerActiveBackgroundColor: COLOR.WHITE,
      })}
      drawerContent={DrawerContent}
    >
      <Drawer.Screen
        name='Overview'
        component={OverviewScreens}
        options={{
          title: 'Overview',
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons
              name='view-dashboard-outline'
              color={color}
              size={28}
            />
          ),
        }}
      />

      <Drawer.Screen
        name='Categories'
        component={CategoriesScreens}
        options={{
          title: 'Categories',
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons
              name='format-columns'
              color={color}
              size={28}
            />
          ),
        }}
      />

      <Drawer.Screen
        name='Expenses'
        component={ExpensesScreens}
        options={{
          title: 'Expenses',
          drawerIcon: ({ color }) => (
            <MaterialIcons
              name='money-off'
              color={color}
              size={28}
            />
          ),
        }}
      />

      <Drawer.Screen
        name='Incomes'
        component={IncomesScreens}
        options={{
          title: 'Incomes',
          drawerIcon: ({ color }) => (
            <FontAwesome5
              name='money-bill-alt'
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Drawer.Screen
        name='Savings'
        component={SavingsScreens}
        options={{
          title: 'Savings',
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons
              name='bank'
              color={color}
              size={28}
            />
          ),
        }}
      />

      <Drawer.Screen
        name='Settings'
        component={SettingsScreen}
        options={{
          title: 'Settings',
          drawerIcon: ({ color }) => (
            <Ionicons
              name='settings-outline'
              color={color}
              size={28}
            />
          ),
          headerTitle: ({ children }) => (
            <HeaderLeft
              style={styles.headerLeft}
              title={children}
              simplified
            />
          ),
          headerRight: () => null,
        }}
      />
    </Drawer.Navigator>
  );
}

function Navigator () {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const selectedYear = useSelector(state => state.ui.selectedYear);
  const toast = useSelector(state => state.ui.toast);
  const needToReinitialize = useSelector(state => state.ui.reinitialize);

  const [reduxInitialized, setReduxInitialized] = useState(false);
  const [basicDataFetched, setBasicDataFetched] = useState(false);

  useEffect(() => {
    if (getPathName() !== `/${CONFIRM_EMAIL_PATH}`) {
      checkIfLoggedIn()
        .then((isLoggedIn) => {
          if (isLoggedIn) {
            initializeRedux();
            fetchBasicsData();
          }
        })
        .finally(() => {
          dispatch(reinitializeAction(false));
        });
    }
  }, [needToReinitialize]);

  useEffect(() => {
    if (reduxInitialized && basicDataFetched && selectedYear) {
      fetchOverviewData(selectedYear);
    }
  }, [reduxInitialized, basicDataFetched, selectedYear]);

  function onLayout () {
    dispatch(setWindowWidthAction(Dimensions.get('window').width));
  }

  async function checkIfLoggedIn () {
    const navigateToSignInPage = () => navigation.navigate('SignIn');

    const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

    if (!token) {
      navigateToSignInPage();

      return false;
    }

    const tokenValidationResult = await validateToken(token);

    if (!tokenValidationResult) {
      navigateToSignInPage();

      return false;
    }

    return true;
  }

  async function initializeRedux () {
    const selectedTab = await retrieveFromStorage(STORAGE_KEY.SELECTED_TAB);
    if (selectedTab && TABS.includes(selectedTab)) {
      dispatch(setSelectedTabAction(selectedTab));
    }

    const selectedYear = Number(await retrieveFromStorage(STORAGE_KEY.SELECTED_YEAR));
    if (selectedYear) {
      dispatch(setSelectedYearAction(selectedYear));
    }

    setReduxInitialized(true);
  }

  async function fetchBasicsData () {
    const {
      account,
      colors,
      categories,
    } = await fetchBasics();

    if (account) {
      dispatch(setAccountAction(account));
    }

    if (colors) {
      dispatch(setColorsAction(colors));
    }

    if (categories) {
      dispatch(setCategoriesAction(categories));
    }

    setBasicDataFetched(true);
  }

  async function fetchOverviewData (year) {
    const {
      expenses,
      expensesTotals,
      incomes,
      incomesTotals,
      savings,
      savingsTotals,
      investments,
      investmentsTotals,
    } = await fetchOverviewForYear(year);

    if (expenses) {
      dispatch(setExpensesAction(expenses));
    }
    if (expensesTotals) {
      dispatch(setExpensesTotalsAction(expensesTotals));
    }

    if (savings) {
      dispatch(setSavingsAction(savings));
    }
    if (savingsTotals) {
      dispatch(setSavingsTotalsAction(savingsTotals));
    }

    if (investments) {
      dispatch(setInvestmentsAction(investments));
    }
    if (investmentsTotals) {
      dispatch(setInvestmentsTotalsAction(investmentsTotals));
    }

    if (incomes) {
      dispatch(setIncomesAction(incomes));
    }
    if (incomesTotals) {
      dispatch(setIncomesTotalsAction(incomesTotals));
    }
  }

  const modalScreenOptions = {
    presentation: Platform.OS === 'web' ? 'transparentModal' : 'modal',
    headerShown: Platform.OS !== 'web',
    contentStyle: { backgroundColor: Platform.select({ web: 'transparent' }) },
    headerTitleStyle: styles.modalTitle,
  };

  return (
    <View
      style={{ flexGrow: 1 }}
      onLayout={onLayout}
    >
      <Stack.Navigator
        initialRouteName='Drawer'
        screenOptions={{
          headerStyle: { backgroundColor: COLOR.WHITE },
          headerTitleStyle: styles.headerTitleStyle,
          headerTintColor: COLOR.BLACK,
          contentStyle: { backgroundColor: COLOR.WHITE, flexGrow: 1 },
        }}
      >
        <Stack.Screen
          name='Drawer'
          component={DrawerNavigator}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name='SignIn'
          component={SignInScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name='ConfirmEmail'
          component={ConfirmEmailScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name='Expense'
          component={ExpenseScreen}
          initialParams={{
            expense: undefined,
            preselectedCategory: 'first', // 'first' or 'last'
          }}
          options={{
            title: 'Add an Expense',
            ...modalScreenOptions,
          }}
        />

        <Stack.Screen
          name='Saving'
          initialParams={{
            saving: undefined,
            investment: undefined,
          }}
          component={SavingScreen}
          options={{
            title: 'Add a Saving',
            ...modalScreenOptions,
          }}
        />

        <Stack.Screen
          name='Income'
          component={IncomeScreen}
          initialParams={{
            income: undefined,
          }}
          options={{
            title: 'Add an Income',
            ...modalScreenOptions,
          }}
        />

        <Stack.Screen
          name='Category'
          component={CategoryScreen}
          initialParams={{
            category: undefined,
          }}
          options={{
            title: 'Create a Category',
            ...modalScreenOptions,
          }}
        />
      </Stack.Navigator>

      <Toast {...toast} />
    </View>
  );
}

export default function App () {
  const [fontsLoaded] = useFonts({
    [FONT.TIRO_GURMUKHI.REGULAR]: require('./assets/fonts/TiroGurmukhi/TiroGurmukhi-Regular.ttf'),

    [FONT.NOTO_SERIF.REGULAR]: require('./assets/fonts/NotoSerif/NotoSerif-Regular.ttf'),
    [FONT.NOTO_SERIF.BOLD]: require('./assets/fonts/NotoSerif/NotoSerif-Bold.ttf'),

    Ionicons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
    FontAwesome5: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome5_Regular.ttf'),
    MaterialIcons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf'),
    MaterialCommunityIcons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf'),
  });

  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const [navigationInitialState, setNavigationInitialState] = useState();

  useEffect(() => {
    if (!isNavigationReady) {
      restoreNavigationState();
    }
  }, [isNavigationReady]);

  const checkIfNeedToHideSplashScreen = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  async function restoreNavigationState () {
    const savedNavigationState = await retrieveFromStorage(STORAGE_KEY.NAVIGATION_STATE);

    const isConfirmEmailPage = getPathName() === `/${CONFIRM_EMAIL_PATH}`;

    if (savedNavigationState && !isConfirmEmailPage) {
      setNavigationInitialState(savedNavigationState);
    }

    setIsNavigationReady(true);
  }

  if (!fontsLoaded || !isNavigationReady) {
    return null;
  }

  return (
    <View
      style={styles.app}
      onLayout={checkIfNeedToHideSplashScreen}
    >
      <StatusBar style='dark' />

      <Provider store={store}>
        <NavigationContainer
          initialState={navigationInitialState}
          onStateChange={state => saveToStorage(STORAGE_KEY.NAVIGATION_STATE, state)}
          linking={{
            config: {
              screens: {
                Drawer: '',
                Overview: {
                  initialRouteName: 'Overview',
                  screens: {
                    OverviewMonths: 'overview/months',
                    OverviewWeeks: 'overview/weeks',
                    OverviewYears: 'overview/years',
                  },
                },
                Categories: {
                  initialRouteName: 'Categories',
                  screens: {
                    CategoriesMonths: 'categories/months',
                    CategoriesWeeks: 'categories/weeks',
                    CategoriesYears: 'categories/years',
                  },
                },
                Expenses: {
                  initialRouteName: 'Expenses',
                  screens: {
                    ExpensesMonths: 'expenses/months',
                    ExpensesWeeks: 'expenses/weeks',
                    ExpensesYears: 'expenses/years',
                  },
                },
                Incomes: {
                  initialRouteName: 'Incomes',
                  screens: {
                    IncomesMonths: 'incomes/months',
                    IncomesWeeks: 'incomes/weeks',
                    IncomesYears: 'incomes/years',
                  },
                },
                Savings: {
                  initialRouteName: 'Savings',
                  screens: {
                    SavingsMonths: 'savings/months',
                    SavingsWeeks: 'savings/weeks',
                    SavingsYears: 'savings/years',
                  },
                },
                Settings: 'settings',
                Expense: 'expense/:id?',
                Saving: 'saving/:id?',
                Income: 'income/:id?',
                Category: 'category/:id?',
                ConfirmEmail: CONFIRM_EMAIL_PATH,
                SignIn: 'sign-in',
              },
            },
          }}
        >
          <Navigator />
        </NavigationContainer>
      </Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flexGrow: 1,
  },

  headerLeft: {
    left: Platform.select({ ios: -16 }),
  },

  headerTitleStyle: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
    fontSize: 18,
    lineHeight: 24,
  },

  logo: {
    marginBottom: 2,
  },

  drawerItemStyle: {
    paddingLeft: 22,
    paddingRight: 12,
    margin: 0,
  },
  drawerLabelStyle: {
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 18,
    lineHeight: 36,
  },

  modalTitle: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
    fontSize: 18,
  },
});
