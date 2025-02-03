import { Platform, StyleSheet } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HeaderLeft from '../../components/HeaderLeft';
import HeaderRight from '../../components/HeaderRight';
import DrawerContent, { DRAWER_PAGE } from '../../components/DrawerContent';
import { COLOR } from '../../styles/colors';

export default function DrawerLayout () {
  return (
    <GestureHandlerRootView style={styles.drawerLayout}>
      <Drawer
        screenOptions={({ route }) => ({
          headerTitle: ({ children }) => (
            <HeaderLeft
              style={styles.headerLeft}
              routeSegment={children}
              simplified={route.name.includes(DRAWER_PAGE.SETTINGS)}
            />
          ),
          headerTitleAlign: 'left',
          headerTitleContainerStyle: { margin: 0 },
          headerRight: () => (
            route.name.includes(DRAWER_PAGE.SETTINGS)
              ? null
              : <HeaderRight routeName={route.name} />
          ),
          headerStyle: { backgroundColor: COLOR.WHITE },
          headerTintColor: COLOR.BLACK,
          sceneStyle: {
            backgroundColor: COLOR.WHITE,
            flexGrow: 1,
            borderRadius: 0,
            position: 'relative',
          },
          drawerActiveTintColor: COLOR.BLACK,
          drawerInactiveTintColor: COLOR.BLACK,
        })}
        drawerContent={DrawerContent}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerLayout: {
    flexGrow: 1,
  },

  headerLeft: {
    left: Platform.select({ ios: -16 }),
  },
});
