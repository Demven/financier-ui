import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { HeaderTitle } from '@react-navigation/elements';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import OverviewScreen from './screens/OverviewScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import SavingsScreen from './screens/SavingsScreen';
import SettingsScreen from './screens/SettingsScreen';
import Logo from './components/Logo';
import DrawerContent from './components/DrawerContent';
import 'react-native-gesture-handler';

const Drawer = createDrawerNavigator();

function DrawerNavigator () {
  return (
    <Drawer.Navigator
      initialRouteName='Overview'
      screenOptions={{
        headerTitle: (props) => (
          <View style={styles.headerLeft}>
            <Logo containerStyle={styles.logo} />

            <HeaderTitle>{props.children}</HeaderTitle>
          </View>
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
      }}
      drawerContent={DrawerContent}
    >
      <Drawer.Screen
        name='Overview'
        component={OverviewScreen}
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
        component={CategoriesScreen}
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
        component={SavingsScreen}
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

      {/*<Drawer.Screen*/}
      {/*  name='Log Out'*/}
      {/*  component={SignInScreen}*/}
      {/*  options={{*/}

      {/*    title: 'Log Out',*/}
      {/*    drawerIcon: ({ color }) => (*/}
      {/*      <AntDesign*/}
      {/*        name='logout'*/}
      {/*        color={color}*/}
      {/*        size={28}*/}
      {/*      />*/}
      {/*    ),*/}
      {/*    drawerItemStyle: {*/}
      {/*      width: '100%',*/}
      {/*      position: 'absolute',*/}
      {/*      bottom: 32,*/}
      {/*      left: 30,*/}
      {/*    },*/}
      {/*  }}*/}
      {/*/>*/}
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

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    marginBottom: 2,
    left: -16,
  },
});
