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

const SUPPORT_EMAIL = 'support@thefinancier.app';
const FEEDBACK_EMAIL = 'feedback@thefinancier.app';

export default function SupportScreen () {
  const router = useRouter();

  return (
    <View style={styles.supportScreen}>
      <View style={styles.header}>
        <HeaderLeft
          style={styles.headerLeft}
          routeSegment='support'
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
        <Text style={styles.title}>Feedback and reviews</Text>

        <View style={styles.paragraph}>
          <Text style={styles.text}>
            Email: <Link style={styles.mailtoLink} href={`mailto:${FEEDBACK_EMAIL}`}>{FEEDBACK_EMAIL}</Link>
          </Text>
        </View>

        <Text style={styles.title}>Technical Support</Text>

        <View style={styles.paragraph}>
          <Text style={styles.text}>
            Email: <Link style={styles.mailtoLink} href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</Link>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  supportScreen: {
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
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
    marginHorizontal: 'auto',
  },

  title: {
    paddingVertical: 16,
    fontFamily: FONT.NOTO_SERIF.BOLD,
    fontSize: 20,
    lineHeight: 24,
  },
  paragraph: {
    marginTop: 4,
    marginBottom: 32,
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
