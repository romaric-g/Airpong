import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, Button } from "react-native";
import ActionButton from "../Components/ActionButton";
import socket from '../connection'
import Models from "../Types/models";

const actions = [ "Smatch", "Revers", "Coup droit"];
const feedbacks = [ "Excelent !", "Super !", "ça passe..."]

const Game = () => {

    const [ gameState, setGameState ] = useState<Models.GameState>()
    const [ showAction, setShowAction ] = useState(false);

    const startTime = useRef(0);
    const latency = useRef(0);

    useEffect(() => {
        const getGameStateRes = (res: Models.GetGameStateResponse) => {
            setGameState(res.state);
        }
        socket.emit('GetGameState', null, getGameStateRes);
        socket.on('GameStateChange', gameStateChange);
        socket.on('PingResponse', calcPing)
        return () => {
            socket.off('GameStateChange', gameStateChange);
        }
    }, [])

    useEffect(() => {

        const interval = setInterval(() => {
           
            const time = new Date().getTime();

            if (gameState?.nextStriker === socket.id && !gameState.failed) {
                if (gameState.tBStart + gameState.tBDuration <= time) {
                    setShowAction(true)
                } else {
                    setShowAction(false)
                }
            } else {
                setShowAction(false)
            }

            // test ping
            startTime.current = Date.now();
            socket.emit('GetPing');
        }, 100)

        return () => {
            clearInterval(interval);
        }
    }, [gameState])

    const gameStateChange = useCallback((event: Models.GameStateChangeEvent) => {
        setGameState(event.state)
        console.log(event)
    }, [setGameState])

    const calcPing = useCallback(() => {
        latency.current = Date.now() - startTime.current;
        console.log(latency.current);
    }, [])

    const serv = useCallback(() => {
        if (gameState?.server === socket.id) {
            socket.emit("Play", {
                action: 'serv'
            } as Models.PlayParams, (event: any) => {
                console.log(event)
            })
        }
    }, [gameState])

    const play = useCallback((action: "smatch" | "revers" | "droit") => {
        if (gameState?.nextStriker === socket.id) {
            socket.emit("Play", {
                action: action
            } as Models.PlayParams, (event: any) => {
                console.log(event)
            })
        }
    }, [gameState])


    useEffect(() => {
        console.log(gameState)
    }, [gameState])

    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <Text style={styles.score}>{gameState?.score[0] + ' - ' + gameState?.score[1] }</Text>
                <Text style={styles.names}>{gameState?.playersName[0] + ' - ' + gameState?.playersName[1] }</Text>
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
                            <Text>{ showAction ? actions[gameState?.action] : "la balle arrive..."}</Text>
                        )}
                        { !gameState?.failed && gameState?.nextStriker !== socket.id && (
                            <Text>{ feedbacks[gameState?.feedback] }</Text>
                        )}
                        <View style={styles.wrap1}>
                            <ActionButton 
                                onPress={() => play('smatch')}
                                text="Smash"
                            />
                        </View>
                        <View style={styles.wrap2}>
                            <ActionButton
                                onPress={() => play('revers')}
                                text="Revers"
                            />
                        </View>
                        <View style={styles.wrap3}>
                            <ActionButton
                                onPress={() => play('droit')}
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
  },
  names: {
    fontSize: 20,
  },
  wrap1: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-start"
  },
  wrap2: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  },
  wrap3: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  },
  buttonwrapper:{
    flex: 1,
    alignItems: "center"
  }
});

export default Game;
