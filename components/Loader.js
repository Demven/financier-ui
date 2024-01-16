import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import PropTypes from 'prop-types';
import { COLOR } from '../styles/colors';

Loader.propTypes = {
  style: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  setLoading: PropTypes.bool.isRequired,
  timeout: PropTypes.number,
};

export default function Loader (props) {
  const {
    style,
    loading,
    setLoading,
    timeout,
  } = props;

  const [logoLoaded, setLogoLoaded] = useState(false);

  const angle = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (loading && logoLoaded) {
      animate();

      if (timeout) {
        setTimeout(() => {
          setLoading(false);
        }, timeout);
      }
    }
  }, [loading, logoLoaded, timeout]);

  function animate () {
    angle.value = withRepeat(withTiming(360, {
      duration: 2000,
      easing: Easing.linear,
      reduceMotion: 'system',
    }), -2, false);
    opacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.inOut(Easing.cubic),
      reduceMotion: 'system',
    });
  }

  const animatedBorderStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: `${angle.value}deg` }],
  }));
  const animatedOpacityStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!loading) return null;

  return (
    <Pressable style={({ pressed }) => [styles.loader, pressed && styles.loaderPressed]}>
      <Animated.View style={[styles.logoContainer, animatedOpacityStyles, style]}>
        {logoLoaded && (
          <Animated.View
            style={[styles.border, animatedBorderStyles]}
          />
        )}

        <Image
          style={styles.logo}
          source={require('../assets/images/f.png')}
          onLoad={() => setLogoLoaded(true)}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  loader: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: COLOR.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loaderPressed: {
    opacity: 0.7,
  },

  logoContainer: {
    height: 106,
    width: 106,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'content-box',
    position: 'relative',
  },

  border: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderWidth: 4,
    borderColor: COLOR.ORANGE,
    borderRadius: '50%',
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },

  logo: {
    height: 45,
    width: 36,
  },
});
