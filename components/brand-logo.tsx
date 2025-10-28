import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet } from 'react-native';

type Props = {
  size?: number;
  circleSize?: number;
};

export default function BrandLogo({ size = 100, circleSize = 180 }: Props) {
  const breathAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const breathingAnimation = () => {
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(breathAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ]).start(() => breathingAnimation());
    };

    breathingAnimation();
  }, [breathAnim]);

  return (
    <Animated.View 
      style={[
        styles.logoWrap, 
        { 
          width: circleSize, 
          height: circleSize, 
          borderRadius: circleSize / 2,
          transform: [{ scale: breathAnim }]
        }
      ]}
    > 
      <Image 
        source={require('../assets/images/react-logo.png')} 
        style={{ width: size, height: size }} 
        resizeMode="contain" 
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  logoWrap: {
    backgroundColor: '#444444', // Cambio a un gris más oscuro
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});
