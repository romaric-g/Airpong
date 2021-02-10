import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DeviceMotion, Gyroscope } from 'expo-sensors';
import Home from './Pages/Home';

const App = () => {
  let [fontsLoaded] = useFonts({
    SuezOne_400Regular,
    Montserrat_700Bold,
    Montserrat_300Light,
    Montserrat_400Regular,
  });
  
  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <NativeRouter style={styles.bgapp}>
      <ImageBackground source={image} style={styles.image}>
        <StatusBar hidden />
        <View style={styles.container}>
          <Route exact path="/" component={Home} />
          <Route path="/room/:code" component={Room} />
          <Route path="/game" component={Game} />
        </View>
      </ImageBackground>
    </NativeRouter>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;