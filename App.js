import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import OverviewScreen from './screens/OverviewScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import SavingsScreen from './screens/SavingsScreen';
import SettingsScreen from './screens/SettingsScreen';
import SignInScreen from './screens/SignInScreen';
import 'react-native-gesture-handler';

const Drawer = createDrawerNavigator();

function DrawerNavigator () {
  return (
    <Drawer.Navigator
      initialRouteName='Overview'
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: 'black',
        sceneContainerStyle: { backgroundColor: 'white' },
        drawerContentStyle: { paddingTop: 16, paddingLeft: 16, backgroundColor: 'white' },
        drawerContentContainerStyle: { position: 'relative', flexGrow: 1 },
        drawerActiveTintColor: 'black',
        drawerInactiveTintColor: 'black',
        drawerActiveBackgroundColor: 'white',
      }}
    >
      <Drawer.Screen
        name='Overview'
        component={OverviewScreen}
        options={{
          title: 'Overview',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name='view-dashboard-outline'
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name='Categories'
        component={CategoriesScreen}
        options={{
          title: 'Categories',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name='format-columns'
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name='Savings'
        component={SavingsScreen}
        options={{
          title: 'Savings',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name='bank'
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name='Settings'
        component={SettingsScreen}
        options={{
          title: 'Settings',
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name='settings-outline'
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name='Log Out'
        component={SignInScreen}
        options={{
          title: 'Log Out',
          drawerIcon: ({ color, size }) => (
            <AntDesign
              name='logout'
              color={color}
              size={size}
            />
          ),
          drawerItemStyle: {
            width: '100%',
            position: 'absolute',
            bottom: 32,
            left: 0,
          },
        }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <View style={styles.app}>
      <StatusBar style='light' />

      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flexGrow: 1,
  },
});
