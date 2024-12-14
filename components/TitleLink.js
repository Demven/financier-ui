import { useState } from 'react';
import {
  StyleSheet,
  Pressable,
  View,
  Text,
} from 'react-native';
import { Link } from 'expo-router';
import PropTypes from 'prop-types';
import { FONT } from '../styles/fonts';
import { COLOR } from '../styles/colors';

TitleLink.propTypes = {
  style: PropTypes.any,
  textStyle: PropTypes.any,
  navigateTo: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      params: PropTypes.object,
    }),
  ]),
  onPress: PropTypes.func, // without onPress will work as a simple Text node
  alwaysHighlighted: PropTypes.bool,
  children: PropTypes.any.isRequired,
};

export default function TitleLink (props) {
  const {
    style,
    textStyle,
    alwaysHighlighted,
    navigateTo,
    onPress,
    children,
  } = props;

  const [highlighted, setHighlighted] = useState(false);

  const linkContent = (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          (highlighted || alwaysHighlighted) && {
            borderColor: alwaysHighlighted && !highlighted ? COLOR.LIGHT_GRAY : COLOR.BLACK,
          },
        ]}
      >
        <Text
          style={[styles.text, textStyle]}
          numberOfLines={1}
          onMouseEnter={onPress ? () => setHighlighted(true) : undefined}
          onMouseLeave={onPress ? () => setHighlighted(false) : undefined}
        >
          {children}
        </Text>
      </View>
    </View>
  );

  return navigateTo
    ? (
      <Link
        style={[
          styles.titleLink,
          {
            cursor: 'pointer',
          },
          style,
        ]}
        onPress={onPress}
        href={navigateTo}
        push
      >
        {linkContent}
      </Link>
    )
    : (
      <Pressable
        style={({ pressed }) => [
          styles.titleLink,
          {
            cursor: onPress ? 'pointer' : 'auto',
          },
          style,
          (pressed && onPress) && styles.titleLinkPressed,
        ]}
        onPress={onPress}
      >
        {linkContent}
      </Pressable>
    );
}

const styles = StyleSheet.create({
  titleLink: {},
  titleLinkPressed: {
    opacity: 0.7,
  },

  wrapper: {
    width: '100%',
    overflow: 'hidden',
  },

  container: {
    padding: 2,
    borderStyle: 'dotted',
    borderWidth: 3,
    borderColor: COLOR.TRANSPARENT,
    marginTop: -3,
    marginRight: -3,
    marginLeft: -3,
  },

  text: {
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 40,
    lineHeight: 40,
    color: COLOR.DARK_GRAY,
  },
});
