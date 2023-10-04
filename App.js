import { Platform, StyleSheet, View } from 'react-native';
import { createDrawerNavigator, useDrawerStatus } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { HeaderTitle } from '@react-navigation/elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import OverviewScreen from './screens/OverviewScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import SavingsScreen from './screens/SavingsScreen';
import SettingsScreen from './screens/SettingsScreen';
import SignInScreen from './screens/SignInScreen';
import Logo from './components/Logo';
import DrawerContent from './components/DrawerContent';
import IconButton from './components/IconButton';
import 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const BottomTabs = createBottomTabNavigator();

function OverviewScreens () {
  return (
    <BottomTabs.Navigator
      initialRouteName='OverviewMonths'
      screenOptions={() => ({
        headerStyle: { backgroundColor: 'white' },
        headerTintColor: 'black',
        tabBarStyle: { backgroundColor: 'white' },
        tabBarActiveTintColor: 'black',
        headerShown: false,
      })}
    >
      <BottomTabs.Screen
        name='OverviewWeeks'
        component={OverviewScreen}
        initialParams={{
          type: 'weeks',
        }}
        options={{
          title: 'Overview',
          tabBarLabel: 'Weeks',
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
          type: 'months',
        }}
        options={{
          title: 'Overview',
          tabBarLabel: 'Months',
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
          type: 'years',
        }}
        options={{
          title: 'All Expenses',
          tabBarLabel: 'Years',
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
        tabBarStyle: { backgroundColor: 'white' },
        tabBarActiveTintColor: 'black',
        headerShown: false,
      })}
    >
      <BottomTabs.Screen
        name='CategoriesWeeks'
        component={CategoriesScreen}
        initialParams={{
          type: 'weeks',
        }}
        options={{
          title: 'Categories',
          tabBarLabel: 'Weeks',
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
          type: 'months',
        }}
        options={{
          title: 'Categories',
          tabBarLabel: 'Months',
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
          type: 'years',
        }}
        options={{
          title: 'Categories',
          tabBarLabel: 'Years',
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
        tabBarStyle: { backgroundColor: 'white' },
        tabBarActiveTintColor: 'black',
        headerShown: false,
      })}
    >
      <BottomTabs.Screen
        name='SavingsWeeks'
        component={SavingsScreen}
        initialParams={{
          type: 'weeks',
        }}
        options={{
          title: 'Savings',
          tabBarLabel: 'Weeks',
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
          type: 'months',
        }}
        options={{
          title: 'Savings',
          tabBarLabel: 'Months',
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
          type: 'years',
        }}
        options={{
          title: 'All Savings',
          tabBarLabel: 'Years',
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
          <IconButton
            iconName='add-circle-outline'
            size={24}
            color={tintColor}
            onPress={() => navigation.navigate('SignIn')}
          />
        ),
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: 'black',
        sceneContainerStyle: { backgroundColor: 'white' },
        drawerContentStyle: { paddingTop: 16, paddingLeft: 16, backgroundColor: 'white' },
        drawerItemStyle: { paddingVertical: 12, paddingLeft: 32, paddingRight: 12, margin: 0 },
        drawerLabelStyle: { fontSize: 16 },
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

export default function App() {
  return (
    <View style={styles.app}>
      <StatusBar style='dark' />

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
    marginLeft: 16,
    fontWeight: 'bold',
  },

  logo: {
    marginBottom: 2,
  },
});
