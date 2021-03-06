import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, Button } from "react-native";
import { Accelerometer, ThreeAxisMeasurement } from 'expo-sensors';
import { Subscription } from '@unimodules/core';
import ActionButton from "../Components/ActionButton";
import socket from "../connection";
import Models from "../Types/models";

const actions = ["Smash", "Revers", "Coup droit"];
const feedbacks = ["Excellent !", "Super !", "Ça passe..."];

const Game = () => {

    const [ gameState, setGameState ] = useState<Models.GameState>();
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    
    const currentAction = useRef<"smatch" | "revers" | "droit" | undefined>()
    const strikDelay = useRef(0);
    const nextStriker = useRef<string | undefined>();

    const setCurrentAction = (action: "smatch" | "revers" | "droit" | undefined) => {
      currentAction.current = action;
    }

    const _subscribe = useCallback(() => {
      setSubscription (
          Accelerometer.addListener(accelerometerData => {
              strik(accelerometerData);
          })
      );
      Accelerometer.setUpdateInterval(10);
  }, [])

    const _unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription(null);
    };

    const strik = useCallback( (data: ThreeAxisMeasurement) => {
        const now = Date.now();
        if (now - strikDelay.current > 250) {
            const { x, y, z } = data;
            const abs = Math.abs(x) + Math.abs(y) + Math.abs(z);
            if (abs > 2 && currentAction.current !== undefined) {
                console.log('strick', currentAction.current)
                strikDelay.current = now;
                play(currentAction.current)
            }
        }
    }, [currentAction])

    useEffect(() => {
      if (gameState?.nextStriker !== nextStriker.current) {
        nextStriker.current = gameState?.nextStriker;
      }
    }, [gameState])

    useEffect(() => {
        const getGameStateRes = (res: Models.GetGameStateResponse) => {
          setGameState(res.state);
        };
        _subscribe();
        socket.emit("GetGameState", null, getGameStateRes);
        socket.on("GameStateChange", gameStateChange);
        return () => {
            socket.off("GameStateChange", gameStateChange);
            _unsubscribe();
        };
    }, []);

  const gameStateChange = useCallback(
    (event: Models.GameStateChangeEvent) => {
      setGameState(event.state);
    },
    [setGameState]
  );

  const serv = useCallback(() => {
    if (gameState?.server === socket.id) {
      socket.emit(
        "Play",
        {
          action: "serv",
        } as Models.PlayParams,
        (event: any) => { }
      );
    }
  }, [gameState]);

  const play = useCallback(
    (action: "smatch" | "revers" | "droit") => {
      console.log('PLAY')
      if (nextStriker.current === socket.id) {
        console.log('YOU')
        socket.emit(
          "Play",
          {
            action: action,
          } as Models.PlayParams,
          (event: any) => { }
        );
      }
    },
    [gameState]
  );

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.score}>
          {gameState?.score[0] + " - " + gameState?.score[1]}
        </Text>
        <Text style={styles.names}>
          {gameState?.playersName[0] + " - " + gameState?.playersName[1]}
        </Text>
      </View>
        <View style={styles.buttonwrapper}>
            { gameState?.failed && <Text>{ gameState.nextStriker === socket.id ? 'Raté...' : 'Tour gagné !' }</Text>}
            { gameState?.server && gameState.server === socket.id ? (
                <>
                    <Text>Secouer votre téléphoene pour engager le service</Text>
                    <Button onPress={serv} title="servir" />
                </>
            ) : (
                <>
                    { !gameState?.failed && gameState?.nextStriker === socket.id && (
                        <Text>{ gameState.showedAction ? actions[gameState?.action] : "la balle arrive..."}</Text>
                    )}
                    { !gameState?.failed && gameState?.nextStriker !== socket.id && (
                        <Text>{ feedbacks[gameState?.feedback] }</Text>
                    )}
                    <View style={styles.wrap1}>
                        <ActionButton 
                            onTouchStart={() => setCurrentAction('smatch')}
                            onTouchEnd={() => {}}
                            text="Smash"
                        />
                    </View>
                    <View style={styles.wrap2}>
                        <ActionButton
                            onTouchStart={() => setCurrentAction('revers')}
                            onTouchEnd={() => {}}
                            text="Revers"
                        />
                    </View>
                    <View style={styles.wrap3}>
                        <ActionButton
                            onTouchStart={() => setCurrentAction('droit')}
                            onTouchEnd={() => {}}
                            text="Droit"
                        />
                    </View>
                </>
            )}
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
    height: "100%",
    paddingTop: 120,
    paddingBottom: 120,
  },
  wrapper: {
    flex: 1,
    alignItems: "center",
  },
  score: {
    fontSize: 48,
    fontFamily: "Arciform",
  },
  names: {
    fontSize: 20,
    fontFamily: "Arciform",
  },
  wrap1: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  wrap2: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  wrap3: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  buttonwrapper: {
    width: "100%",
    paddingRight: 40,
    paddingLeft: 50,
    alignContent: "center",
    flex: 1,
    justifyContent: "center",
    maxWidth: 500
  },
});

export default Game;
