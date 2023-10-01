import { StyleSheet, Text, View } from 'react-native';

export default function SignInScreen () {
  return (
    <View style={styles.signInScreen}>
      <Text style={styles.title}>
        Sign In
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  signInScreen: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  title: {
    color: '#fff',
    fontSize: 34,
  },
});
