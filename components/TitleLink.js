import { useState } from 'react';
import {
  StyleSheet,
  Pressable,
  View,
  Text,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import { FONT } from '../styles/fonts';
import { COLOR } from '../styles/colors';

TitleLink.propTypes = {
  style: PropTypes.any,
  textStyle: PropTypes.any,
  underlineGap: PropTypes.number,
  onPress: PropTypes.func, // without onPress will work as a simple Text node
  children: PropTypes.any.isRequired,
};

const UNDERLINE_GAP = 6;

export default function TitleLink (props) {
  const {
    style,
    textStyle,
    underlineGap = UNDERLINE_GAP,
    onPress,
    children,
  } = props;

  const [highlighted, setHighlighted] = useState(false);

  return (
    <Pressable
      style={({ pressed }) => [styles.titleLink, style, pressed && styles.titleLinkPressed]}
      onPress={onPress}
    >
      <View
        style={[
          styles.container,
          { paddingVertical: underlineGap },
          highlighted && { borderBottomColor: COLOR.BLACK }
        ]}
      >
        <Text
          style={[styles.text, textStyle]}
          onMouseEnter={onPress ? () => setHighlighted(true) : undefined}
          onMouseLeave={onPress ? () => setHighlighted(false) : undefined}
        >
          {children}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  titleLink: {},
  titleLinkPressed: {
    opacity: 0.7,
  },

  container: {
    borderStyle: Platform.select({ web: 'dashed' }),
    borderBottomWidth: 3,
    borderBottomColor: COLOR.TRANSPARENT,
  },

  text: {
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 40,
    lineHeight: 40,
    color: COLOR.DARK_GRAY,
  },
});
