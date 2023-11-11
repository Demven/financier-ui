import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
} from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import Logo from './Logo';
import { COLOR } from '../styles/colors';
import { FONT } from '../styles/fonts';

// props are passed by react-navigation
// Read more here https://reactnavigation.org/docs/drawer-navigator/#drawercontent
export default function DrawerContent (props) {
  const { navigation } = props;

  const firstName = useSelector(state => state.account.firstName) || '';
  const lastName = useSelector(state => state.account.lastName) || '';

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
  },

  drawerHeader: {
    paddingLeft: Platform.select({ web: 42, ios: 54 }),
    paddingTop: Platform.select({ web: 24, ios: 72 }),
    paddingRight: 0,
    paddingBottom: 16,
  },
  logo: {},

  drawerScrollView: {
    flexGrow: 1,
    position: 'relative',
    padding: 0,
    marginTop: Platform.select({ ios: -54 }),
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
