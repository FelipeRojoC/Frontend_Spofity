import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

type Props = {
  size?: number;
  circleSize?: number;
};

export default function BrandLogo({ size = 100, circleSize = 180 }: Props) {
  return (
    <View style={[styles.logoWrap, { width: circleSize, height: circleSize, borderRadius: circleSize / 2 }]}> 
      <Image source={require('../assets/images/react-logo.png')} style={{ width: size, height: size }} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  logoWrap: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
