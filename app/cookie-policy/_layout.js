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

export default function CookiePolicyScreen () {
  const router = useRouter();

  return (
    <View style={styles.cookiePolicyScreen}>
      <View style={styles.header}>
        <HeaderLeft
          style={styles.headerLeft}
          routeSegment='Cookie Policy'
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
        <Text style={styles.title}>Cookie Policy</Text>

        <View style={styles.paragraph}>
          <Text style={styles.text}>
            This document informs Users about the technologies that help this Application to achieve the purposes described below.
            Such technologies allow the Owner to access and store information (for example by using a Cookie) or use resources
            (for example by running a script) on a User’s device as they interact with this Application.
          </Text>
        </View>

        <View style={styles.paragraph}>
          <Text style={styles.text}>
            For simplicity, all such technologies are defined as "Trackers" within this document – unless there is a
            reason to differentiate. For example, while Cookies can be used on both web and mobile browsers, it would
            be inaccurate to talk about Cookies in the context of mobile apps as they are a browser-based Tracker.
            For this reason, within this document, the term Cookies is only used where it is specifically meant to
            indicate that particular type of Tracker.
          </Text>
        </View>

        <View style={styles.paragraph}>
          <Text style={styles.text}>
            Some of the purposes for which Trackers are used may also require the User's consent. Whenever consent is
            given, it can be freely withdrawn at any time following the instructions provided in this document.
          </Text>
        </View>

        <View style={styles.paragraph}>
          <Text style={styles.text}>
            This Application only uses Trackers managed directly by the Owner (so-called “first-party” Trackers). The
            validity and expiration periods of first-party Cookies and other similar Trackers may vary depending on
            the lifetime set by the Owner. Some of them expire upon termination of the User’s browsing session.
          </Text>
        </View>

        <Text style={styles.title}>How this Application uses Trackers</Text>

        <View style={styles.paragraph}>
          <Text style={styles.text}>
            This Application uses so-called “technical” Cookies and other similar Trackers to carry out activities that
            are strictly necessary for the operation or delivery of the Service.
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
            Contact email: <Link style={styles.mailtoLink} href='mailto:feedback@thefinancier.app'>feedback@thefinancier.app</Link>
          </Text>
        </View>

        <View style={styles.paragraph}>
          <Text style={styles.text}>
            Given the objective complexity surrounding tracking technologies, Users are encouraged to contact the Owner should they wish to receive any further information on the use of such technologies by this Application.
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
  cookiePolicyScreen: {
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
  mailtoLink: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
    color: COLOR.ORANGE,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: COLOR.ORANGE,
  },
});
