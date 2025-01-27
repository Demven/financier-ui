import { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { usePathname, useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';
import {
  useSelector,
  Provider,
  useDispatch,
} from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import Toast from '../components/Toast';
import { TABS } from '../components/HeaderTabs';
import {
  STORAGE_KEY,
  retrieveFromStorage,
  saveToStorage,
  clearStorage,
} from '../services/storage';
import { getTimespan } from '../services/location';
import { validateToken } from '../services/api/auth';
import { fetchBasics } from '../services/api/basics';
import { fetchOverviewForYear } from '../services/api/overview';
import { setAccountAction } from '../redux/reducers/account';
import { setCategoriesAction } from '../redux/reducers/categories';
import { setExpensesAction, setExpensesTotalsAction } from '../redux/reducers/expenses';
import {
  setSavingsAction,
  setSavingsTotalsAction,
  setInvestmentsAction,
  setInvestmentsTotalsAction,
} from '../redux/reducers/savings';
import {
  setSelectedTabAction,
  setSelectedYearAction,
  setLoadingAction,
  reinitializeAction,
  setWindowWidthAction,
} from '../redux/reducers/ui';
import { setIncomesAction, setIncomesTotalsAction } from '../redux/reducers/incomes';
import { setColorsAction } from '../redux/reducers/colors';
import { store } from '../redux/store';
import { FONT } from '../styles/fonts';
import { COLOR } from '../styles/colors';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const CONFIRM_EMAIL_PATH = 'confirm-email';
export const RESET_PASSWORD_PATH = 'reset-password';
export const SUPPORT_PATH = 'support';
export const COOKIE_POLICY_PATH = 'cookie-policy';
export const PRIVACY_POLICY_PATH = 'privacy-policy';
export const SIGN_IN_PATH = 'sign-in';
export const SETTINGS_PATH = 'settings';

const NO_AUTH_PAGES = [
  CONFIRM_EMAIL_PATH,
  RESET_PASSWORD_PATH,
  SUPPORT_PATH,
  COOKIE_POLICY_PATH,
  PRIVACY_POLICY_PATH,
];

const NO_SCROLL_PAGES = [
  SIGN_IN_PATH,
  SETTINGS_PATH,
];

function Navigator () {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const currentPagePath = pathname.slice(1); // remove starting slash '/'

  const selectedYear = useSelector(state => state.ui.selectedYear);
  const toast = useSelector(state => state.ui.toast);
  const needToReinitialize = useSelector(state => state.ui.reinitialize);

  const accountId = useSelector(state => state.account.id);

  const [reduxInitialized, setReduxInitialized] = useState(false);
  const [basicDataFetched, setBasicDataFetched] = useState(false);

  const [isNavigationReady, setIsNavigationReady] = useState(false);

  const [fontsLoaded] = useFonts({
    [FONT.TIRO_GURMUKHI.REGULAR]: require('../assets/fonts/TiroGurmukhi/TiroGurmukhi-Regular.ttf'),

    [FONT.NOTO_SERIF.REGULAR]: require('../assets/fonts/NotoSerif/NotoSerif-Regular.ttf'),
    [FONT.NOTO_SERIF.BOLD]: require('../assets/fonts/NotoSerif/NotoSerif-Bold.ttf'),

    Ionicons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
    FontAwesome5: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome5_Regular.ttf'),
    MaterialIcons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf'),
    MaterialCommunityIcons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf'),
  });

  useEffect(() => {
    if (router && !isNavigationReady) {
      redirectToTheLastVisitedPage();
    } else if (router && pathname && isNavigationReady) {
      if (pathname === '/') {
        router.replace('/overview');
      }
    }
  }, [router, pathname, isNavigationReady]);

  useEffect(() => {
    if (isNavigationReady && !NO_AUTH_PAGES.includes(currentPagePath)) {
      checkIfLoggedIn()
        .then((isLoggedIn) => {
          if (isLoggedIn && needToReinitialize) {
            initializeRedux();
            fetchBasicsData();
            dispatch(reinitializeAction(false));
          } else if (isLoggedIn && !accountId) {
            dispatch(reinitializeAction(true));
          }
        });
    }
  }, [currentPagePath, accountId, isNavigationReady, needToReinitialize]);

  useEffect(() => {
    saveLastVisitedPage(pathname);
  }, [pathname])

  useEffect(() => {
    if (fontsLoaded && isNavigationReady) {
      SplashScreen.hideAsync();
      // to see and test the splash screen use instead timer:
      // setTimeout(SplashScreen.hideAsync, 10000);
    }
  }, [fontsLoaded, isNavigationReady]);

  useEffect(() => {
    if (reduxInitialized && basicDataFetched && selectedYear) {
      fetchOverviewData(selectedYear);
    }
  }, [reduxInitialized, basicDataFetched, selectedYear]);

  async function checkIfLoggedIn () {
    const navigateToSignInPage = async () => {
      await clearStorage();
      router.push('/sign-in');
    };

    const token = await new Promise((resolve) => setTimeout(resolve, 100))
      .then(() => retrieveFromStorage(STORAGE_KEY.TOKEN));

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

  function saveLastVisitedPage (pathName) {
    saveToStorage(STORAGE_KEY.LAST_VISITED_PAGE, pathName);
    saveToStorage(STORAGE_KEY.LAST_VISITED_TIMESTAMP, String(+(new Date())));
  }

  async function redirectToTheLastVisitedPage () {
    const lastVisitedPage = await retrieveFromStorage(STORAGE_KEY.LAST_VISITED_PAGE);
    const lastVisitedTimestamp = await retrieveFromStorage(STORAGE_KEY.LAST_VISITED_TIMESTAMP);

    const needToRestoreNavigationState = pathname !== `/${CONFIRM_EMAIL_PATH}` && pathname !== `/${RESET_PASSWORD_PATH}`;
    const timespan = getTimespan(pathname);

    if (timespan && needToRestoreNavigationState && lastVisitedPage && lastVisitedTimestamp) {
      router.replace(lastVisitedPage);
    }

    setIsNavigationReady(true);
  }

  async function initializeRedux () {
    setReduxInitialized(false);

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
    setBasicDataFetched(false);

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
    dispatch(setLoadingAction(true));

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

    dispatch(setLoadingAction(false));
  }

  function onLayout () {
    dispatch(setWindowWidthAction(Dimensions.get('window').width));
  }

  return (
    <View
      style={[
        {
          flexGrow: 1,
          position: 'relative',
        },
        NO_SCROLL_PAGES.includes(currentPagePath) && { overflow: 'hidden' },
      ]}
      onLayout={onLayout}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: COLOR.WHITE },
          headerTitleStyle: styles.headerTitleStyle,
          headerTintColor: COLOR.BLACK,
          contentStyle: { backgroundColor: COLOR.WHITE, flexGrow: 1 },
        }}
      />

      <Toast {...toast} />
    </View>
  );
}

export default function RootLayout () {
  return (
    <View style={styles.rootLayout}>
      <StatusBar style='dark' />

      <Provider store={store}>
        <Navigator />
      </Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  rootLayout: {
    flexGrow: 1,
  },

  headerTitleStyle: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
    fontSize: 18,
    lineHeight: 24,
  },
});
