import { Platform, StyleSheet, View, Dimensions } from 'react-native';
import { useCallback } from 'react';
import { createDrawerNavigator, useDrawerStatus } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { HeaderTitle } from '@react-navigation/elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
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
import Logo from './components/Logo';
import DrawerContent from './components/DrawerContent';
import IconButton from './components/IconButton';
import HeaderTabs, { TAB, TAB_NAME } from './components/HeaderTabs';
import { store } from './redux/store';
import { MEDIA } from './styles/media';
import { FONT } from './styles/fonts';

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
          display: deviceWidth >= MEDIA.TABLET ? 'none' : undefined,
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
      screenOptions={({ navigation }) => ({
        headerTitle: ({ children }) => {
          const isDrawerOpen = useDrawerStatus() === 'open';

          return (
            <View style={styles.headerLogoAndTitle}>
              {!isDrawerOpen && (
                <Logo containerStyle={styles.logo} />
              )}

              <HeaderTitle style={styles.headerTitle}>
                {children}
              </HeaderTitle>
            </View>
          );
        },
        headerTitleAlign: 'left',
        headerTitleContainerStyle: { margin: 0 },
        headerRight: ({ tintColor }) => (
          <View style={styles.headerTabsAndActions}>
            {deviceWidth >= MEDIA.TABLET && (
              <HeaderTabs style={styles.headerTabs} />
            )}

            <IconButton
              iconName='add-circle-outline'
              size={24}
              color={tintColor}
              onPress={() => navigation.navigate('SignIn')}
            />
          </View>
        ),
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: 'black',
        sceneContainerStyle: { backgroundColor: 'white' },
        drawerContentStyle: { paddingTop: 16, paddingLeft: 16, backgroundColor: 'white' },
        drawerItemStyle: { paddingVertical: 12, paddingLeft: 32, paddingRight: 12, margin: 0 },
        drawerLabelStyle: { fontSize: 16, fontFamily: FONT.MERRIWEATHER.REGULAR },
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
        }}
      />
    </Drawer.Navigator>
  );
}

export default function App () {
  const [fontsLoaded] = useFonts({
    [FONT.MERRIWEATHER.REGULAR]: require('./assets/fonts/Merriweather-Regular.ttf'),
    [FONT.MERRIWEATHER.BOLD]: require('./assets/fonts/Merriweather-Bold.ttf'),
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
          <Stack.Navigator
            initialRouteName='Categories'
            screenOptions={{
              headerStyle: { backgroundColor: '#fff' },
              headerTintColor: 'black',
              contentStyle: { backgroundColor: '#fff' },
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
                title: 'Sign In',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flexGrow: 1,
  },

  headerLogoAndTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    left: Platform.select({ ios: -16 }),
  },
  headerTitle: {
    marginLeft: 34,
    fontFamily: FONT.MERRIWEATHER.BOLD,
    fontSize: 18,
  },

  headerTabsAndActions: {
    flexDirection: 'row',
    alignItems: 'right',
  },
  headerTabs: {
    marginRight: 88,
  },

  logo: {
    marginBottom: 2,
  },
});
