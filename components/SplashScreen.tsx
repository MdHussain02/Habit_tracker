import Lottie from 'lottie-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type SplashScreenProps = {
  onAnimationFinish?: () => void;
};

export default function SplashScreen({ onAnimationFinish }: SplashScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <Lottie
          autoPlay
          loop={false} // important: ensure it runs only once
          source={require('../assets/lottie/Logo-1.json')}
          style={styles.animation}
          onAnimationFinish={onAnimationFinish}
          speed={1}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationContainer: {
    width: 800,
    height: 800,
  },
  animation: {
    width: '100%',
    height: '100%',
  },
});
