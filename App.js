import { Platform, StyleSheet, View, Dimensions } from 'react-native';
import { useCallback, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider, useDispatch } from 'react-redux';
import 'react-native-gesture-handler';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import OverviewScreen from './screens/OverviewScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import SavingsScreen from './screens/SavingsScreen';
import SettingsScreen from './screens/SettingsScreen';
import SignInScreen from './screens/SignInScreen';
import ExpenseScreen from './screens/ExpenseScreen';
import SavingScreen from './screens/SavingScreen';
import IncomeScreen from './screens/IncomeScreen';
import CategoryScreen from './screens/CategoryScreen';
import SubcategoryScreen from './screens/SubcategoryScreen';
import HeaderLeft from './components/HeaderLeft';
import HeaderRight from './components/HeaderRight';
import { TAB, TAB_NAME } from './components/HeaderTabs';
import DrawerContent from './components/DrawerContent';
import { STORAGE_KEY, retrieveFromStorage } from './services/storage';
import { setSettingsAction } from './redux/reducers/account';
import { store } from './redux/store';
import { MEDIA } from './styles/media';
import { FONT } from './styles/fonts';
import { COLOR } from './styles/colors';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const BottomTabs = createBottomTabNavigator();

const deviceWidth = Dimensions.get('window').width;

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function OverviewScreens () {
  return (
    <BottomTabs.Navigator
      initialRouteName='OverviewMonths'
      screenOptions={() => ({
        headerStyle: { backgroundColor: 'white' },
        headerTintColor: 'black',
        tabBarStyle: {
          backgroundColor: 'white',
          display: deviceWidth >= MEDIA.DESKTOP ? 'none' : undefined,
        },
        tabBarActiveTintColor: 'black',
        headerShown: false,
      })}
    >
      <BottomTabs.Screen
        name='OverviewWeeks'
        component={OverviewScreen}
        initialParams={{
          type: TAB.WEEKS,
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
  return (
    <BottomTabs.Navigator
      initialRouteName='CategoriesMonths'
      screenOptions={() => ({
        headerStyle: { backgroundColor: 'white' },
        headerTintColor: 'black',
        tabBarStyle: {
          backgroundColor: 'white',
          display: deviceWidth >= MEDIA.TABLET ? 'none' : undefined,
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

function SavingsScreens () {
  return (
    <BottomTabs.Navigator
      initialRouteName='SavingsMonths'
      screenOptions={() => ({
        headerStyle: { backgroundColor: 'white' },
        headerTintColor: 'black',
        tabBarStyle: {
          backgroundColor: 'white',
          display: deviceWidth >= MEDIA.TABLET ? 'none' : undefined,
        },
        tabBarActiveTintColor: 'black',
        headerShown: false,
      })}
    >
      <BottomTabs.Screen
        name='SavingsWeeks'
        component={SavingsScreen}
        initialParams={{
          type: TAB.WEEKS,
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
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: 'black',
        sceneContainerStyle: { backgroundColor: 'white' },
        drawerContentStyle: { paddingTop: 16, paddingLeft: 16, backgroundColor: 'white' },
        drawerItemStyle: styles.drawerItemStyle,
        drawerLabelStyle: styles.drawerLabelStyle,
        drawerActiveTintColor: 'black',
        drawerInactiveTintColor: 'black',
        drawerActiveBackgroundColor: 'white',
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

  useEffect(() => {
    checkIfLoggedIn();
    initializeRedux();
  }, [navigation]);

  async function checkIfLoggedIn () {
    const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

    if (!token) {
      navigation.navigate('SignIn');
    }
  }

  async function initializeRedux () {
    const settings = await retrieveFromStorage(STORAGE_KEY.SETTINGS);

    if (settings) {
      dispatch(setSettingsAction(settings));
    }
  }

  const modalScreenOptions = {
    presentation: Platform.OS === 'web' ? 'transparentModal' : 'modal',
    headerShown: Platform.OS !== 'web',
    contentStyle: { backgroundColor: Platform.select({ web: 'transparent' }) },
    headerTitleStyle: styles.modalTitle,
  };

  return (
    <Stack.Navigator
      initialRouteName='Drawer'
      screenOptions={{
        headerStyle: { backgroundColor: COLOR.WHITE },
        headerTitleStyle: styles.headerTitleStyle,
        headerTintColor: COLOR.BLACK,
        contentStyle: { backgroundColor: COLOR.WHITE },
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
        name='Expense'
        component={ExpenseScreen}
        options={{
          title: 'Add an Expense',
          ...modalScreenOptions,
        }}
      />

      <Stack.Screen
        name='Saving'
        component={SavingScreen}
        options={{
          title: 'Add a Saving',
          ...modalScreenOptions,
        }}
      />

      <Stack.Screen
        name='Income'
        component={IncomeScreen}
        options={{
          title: 'Add an Income',
          ...modalScreenOptions,
        }}
      />

      <Stack.Screen
        name='Category'
        component={CategoryScreen}
        options={{
          title: 'Create a Category',
          ...modalScreenOptions,
        }}
      />

      <Stack.Screen
        name='Subcategory'
        component={SubcategoryScreen}
        options={{
          title: 'Create a Subcategory',
          ...modalScreenOptions,
        }}
      />
    </Stack.Navigator>
  );
}

export default function App () {
  const [fontsLoaded] = useFonts({
    [FONT.TIRO_GURMUKHI.REGULAR]: require('./assets/fonts/TiroGurmukhi/TiroGurmukhi-Regular.ttf'),

    [FONT.NOTO_SERIF.REGULAR]: require('./assets/fonts/NotoSerif/NotoSerif-Regular.ttf'),
    [FONT.NOTO_SERIF.BOLD]: require('./assets/fonts/NotoSerif/NotoSerif-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View
      style={styles.app}
      onLayout={onLayoutRootView}
    >
      <StatusBar style='dark' />

      <Provider store={store}>
        <NavigationContainer>
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
    paddingVertical: deviceWidth >= MEDIA.DESKTOP ? 2 : 4,
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
  }
});
