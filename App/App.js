import React, { useState, useEffect } from 'react';
import { Button, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeRouter, Route, Link, useHistory } from "react-router-native";
import Home from './Pages/Home';
import Room from './Pages/Room';
import Game from './Pages/Game';

const App = () => {
  const history = useHistory();

  return (
    <NativeRouter style={styles.bgapp}>
      <StatusBar hidden />
      <View style={styles.nav}>
        <Link to="/" underlayColor="#f0f4f7" style={styles.navItem}>
          <Text>room</Text>
        </Link>
        <Link to="/room" underlayColor="#f0f4f7" style={styles.navItem}>
          <Text>Room</Text>
        </Link>
        <Link to="/game" underlayColor="#f0f4f7" style={styles.navItem}>
          <Text>Game</Text>
        </Link>
      </View>
      <View style={styles.container}>
        <Route exact path="/" component={Home} />
        <Route path="/room" component={Room} />
        <Route path="/game" component={Game} />
      </View>
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