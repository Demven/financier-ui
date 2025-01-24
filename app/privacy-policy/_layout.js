import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import HeaderLeft from '../../components/HeaderLeft';
import CloseButton from '../../components/CloseButton';
import { FONT } from '../../styles/fonts';
import { COLOR } from '../../styles/colors';

export default function PrivacyPolicyScreen () {
  const router = useRouter();

  return (
    <View style={styles.privacyPolicyScreen}>
      <View style={styles.header}>
        <HeaderLeft
          style={styles.headerLeft}
          routeSegment='Privacy Policy'
          simplified
        />

        <CloseButton
          style={styles.closeButton}
          size={46}
          onPress={() => {
            router.push('/');
          }}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Privacy Policy</Text>

        <View style={styles.paragraph}>
          <Text style={styles.text}>
            Your privacy is our number one priority. All stored Personal Data (expenses, savings, investments, incomes)
            is not shared and will never be shared with any Third-Party Actors, unless approved by you. Your Data
            belongs only to you and you have the right to access it any time, request to permanently delete it, and
            get a copy of your Data in CSV or JSON formats upon request.
          </Text>
        </View>

        <View style={styles.paragraph}>
          <Text style={styles.text}>
            In order to receive information about your Personal Data, the purposes and the parties the Data is shared with, contact the Owner.
          </Text>
        </View>

        <Text style={styles.title}>Owner and Data Controller</Text>

        <View style={styles.paragraph}>
          <Text style={styles.text}>
            The Financier
          </Text>
        </View>

        <View style={styles.paragraph}>
          <Text style={styles.text}>
            900 Ave at Port Imperial,{'\n'}
            Weehawken, NJ, 07086
          </Text>
        </View>

        <View style={styles.paragraph}>
          <Text style={styles.text}>
            Contact email: <Link style={styles.link} href='mailto:feedback@thefinancier.app'>feedback@thefinancier.app</Link>
          </Text>
        </View>


        <Text style={styles.title}>Cookie Policy</Text>

        <View style={styles.paragraph}>
          <Text style={styles.text}>
            This Application uses Trackers. To learn more, Users may consult the <Link style={styles.link} href='/cookie-policy'>Cookie Policy</Link>.
          </Text>
        </View>

        <View style={[styles.paragraph, { marginTop: 48 }]}>
          <Text style={styles.text}>
            Latest update: January 16, 2025
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  privacyPolicyScreen: {
    flexGrow: 1,
  },

  header: {
    height: 64,
    justifyContent: 'center',
    borderBottomWidth: 1,
    backgroundColor: COLOR.WHITE,
    borderBottomColor: COLOR.LIGHTER_GRAY,
    position: 'relative',
  },

  headerLeft: {
    left: 24,
  },

  closeButton: {
    position: 'absolute',
    right: 12,
  },

  content: {
    marginTop: 40,
    paddingVertical: 0,
    paddingHorizontal: 40,
    maxWidth: 860,
    alignItems: 'flex-start',
    backgroundColor: COLOR.WHITE,
    marginHorizontal: 'auto',
  },

  title: {
    marginTop: 8,
    paddingVertical: 16,
    fontFamily: FONT.NOTO_SERIF.BOLD,
    fontSize: 20,
    lineHeight: 24,
  },
  paragraph: {
    marginTop: 8,
    marginBottom: 16,
  },
  text: {
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 16,
    lineHeight: 21,
  },
  link: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
    color: COLOR.ORANGE,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: COLOR.ORANGE,
  },
});
