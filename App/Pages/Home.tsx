import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { useHistory } from 'react-router';
import NormalButton from '../Components/NormalButton';
import NormalButtonWhite from '../Components/NormalButtonWhite';
import socket from '../connection'
import Models from '../Types/models';

const Home = () => {

    const [ username, setUsername ] = useState('default');

    const [ codeInput, setCodeInput ] = useState('');

    const [ roomInfo, setRoomInfo ] = useState<Models.RoomInfo>()

    const history = useHistory();

    const joinPrivate = useCallback(() => {
        console.log('JOIN PRIVATE')
        socket.emit('JoinRoom', {
            settings: {
                name: username
            },
            code: codeInput
        } as Models.JoinRoomParams, (res: Models.SocketResponse) => {
            console.log(res)
        })
    }, [username, codeInput])


    const joinRandom = () => {

    }

    useEffect(() => {
        const getRoomInfoRes = (res: Models.GetRoomInfoResponse) => {
            setRoomInfo(res.roomInfo);
        }
        socket.emit('GetRoomInfo', null, getRoomInfoRes);

        socket.on('RoomInfoChange', roomInfoChange);
        return () => {
            socket.off('RoomInfoChange', roomInfoChange);
        }
    }, [])

    useEffect(() => {
        socket.emit('UpdateName', {
            name: username
        } as Models.PlayerSettings, () => {});
    }, [username])

    useEffect(() => {
        if (roomInfo?.start) {
            history.push('/game')
        }
    }, [roomInfo])

    const roomInfoChange = useCallback((event: Models.RoomInfoChangeEvent) => {
        setRoomInfo(event.info)
    }, [setRoomInfo])

    return  !roomInfo || roomInfo.alone ? (
        <View style={styles.container}>
            <Text style={styles.gametitle}>Airpong</Text>
        
            <View style={styles.container2}>
                <NormalButton 
                    title="Lancer la recherche"
                    onPress={joinRandom}
                />
        
            <Text>ou</Text>
        
            <TextInput 
                placeholder="Rentrer un code ami"
                value={codeInput}
                onChangeText={(text) => setCodeInput(text.toUpperCase())}
                autoCapitalize="characters"
                maxLength={6}
                onSubmitEditing={joinPrivate}
                style={styles.input}
            />
        
            <Text>Votre code : {roomInfo?.code || 'En attente...'}</Text>

            <Text>Username</Text>
            <TextInput 
                placeholder="Votre nom"
                value={username}
                onChangeText={(text) => setUsername(text.toUpperCase())}
                style={styles.input}
            />
            </View>
        </View>
    ) : (
        <View style={stylesRoom.container}>
            <Text style={stylesRoom.gametitle}>Airpong</Text>
            <Text style={stylesRoom.name}>{ roomInfo.playersName[0] }</Text>
            <Text style={stylesRoom.vs}>vs</Text>
            <Text style={stylesRoom.name}>{ roomInfo.playersName[1] }</Text>

            { roomInfo.startTimer !== undefined ? (
                <Text>Début dans { roomInfo.startTimer }</Text>
            ) : (
                <Text>La partie est prete à se lancer</Text>
            )}
            <View style={stylesRoom.launchbutton}>
                <NormalButtonWhite title="Lancer la partie" />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "space-around",
      marginTop: 120,
      marginBottom: 120,
    },
    container2: {
      flex: 1,
      alignItems: "center",
      justifyContent: "space-evenly",
      marginTop: 75,
      marginBottom: 75,
    },
    gametitle: {
      color: "#EE8383",
      fontSize: 90,
      fontFamily: "Arciform Sans Normal"
    }, 
    input: {
        backgroundColor: "#FFE1E1",
        borderRadius: 15,
        paddingTop: 10,
        paddingRight: 50,
        paddingBottom: 10,
        paddingLeft: 50,
    },
});

const stylesRoom = StyleSheet.create({
    container: {
      backgroundColor: "#EE8383",
      flex: 1,
      alignItems: "center",
      justifyContent: "space-evenly",
      width: "100%",
      height: "100%",
      paddingTop: 120,
      paddingBottom: 120,
    },
    gametitle: {
      color: "#fff",
      fontSize: 30,
      position: "absolute",
      top: 20,
      left: 20,
    },
    name: {
      color: "#fff",
      fontSize: 45,
    },
    launchbutton: {
        position: "absolute",
        bottom: 50
    },
    vs:{
        color: "#fff",
        fontSize: 24,
    }
});
  
export default Home;