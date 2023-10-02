import { StyleSheet, View, Text, Pressable } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import Logo from './Logo';
import { firstName, lastName } from '../data/settings.json';
import { COLORS } from '../styles/colors';

// props are passed by react-navigation
// Read more here https://reactnavigation.org/docs/drawer-navigator/#drawercontent
export default function DrawerContent (props) {
  const { navigation } = props;

  function onLogOut () {
    navigation.navigate('SignIn');
  }

  return (
    <View style={styles.drawerContent}>
      <View style={styles.drawerHeader}>
        <Logo containerStyle={styles.logo} />
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerScrollView}
      >
        <DrawerItemList {...props} />
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
            color={COLORS.BLACK}
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
  },

  drawerHeader: {
    paddingLeft: 42,
    paddingTop: 24,
    paddingRight: 0,
    paddingBottom: 16,
  },
  logo: {},

  drawerScrollView: {
    flexGrow: 1,
    position: 'relative',
    padding: 0,
  },

  drawerFooter: {
    paddingLeft: 34,
    paddingTop: 8,
    paddingBottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.GRAY,
  },

  logOutIcon: {
    marginRight: 24,
  },

  pressed: {
    opacity: 0.7,
  },
});
