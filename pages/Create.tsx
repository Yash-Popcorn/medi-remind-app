import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image, StyleSheet, Text, View } from "react-native";
import { Card, Title, TextInput, Button, Avatar, Divider, IconButton, Modal, Provider, Portal } from "react-native-paper";
import { Camera, CameraType } from 'expo-camera';
import React from "react";
import { api } from "./Dashboard";
import * as fileSystem from 'expo-file-system'
import { useNavigation } from "@react-navigation/native";

/*
interface textInformation {
    responses: [{
        "textAnnotations": [Array<unknown>]
    }]
}
*/

interface result {
    Code: 200,
    Data: {
        "MORNING": number,
        "BEDTIME": number,
        "EVENING": number,
        "MIDDAY": number
    }
}

export default function Create() {
    
    const [status, requestPermission] = Camera.useCameraPermissions();
    const [click, setClick] = React.useState(false)
    const [camera, setCamera] = React.useState(false)
    const [currentUri, setURI] = React.useState<undefined | string>(undefined)
    const [dayInfo, setInfo] = React.useState<undefined | result['Data']>(undefined)

    const camRef = React.useRef<undefined | Camera>()
    const navigation = useNavigation()

    const askPicture = async () => {
        const info = await requestPermission()
        if (info.granted) {
            setClick(true)
            setCamera(true)
        }
    }
    
    if (status?.granted && click && camera) {

        const fetchInfo = async (info: string) => {
            const response = await fetch(`${api}/photo`, {
                method: "POST",
                body: JSON.stringify({
                    'photo': info
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            })
            
            return await response.json()
        }

        const takePicture = async () => {
            setClick(false)
            setCamera(false)
            if (camRef.current) {
                const photo = await camRef.current.takePictureAsync()
                
                const base64 = await fileSystem.readAsStringAsync(photo.uri, {
                    encoding: fileSystem.EncodingType.Base64
                })
                
                fetchInfo(base64).then((data: result) => {
                    setInfo(data.Data)
                }).catch(console.error)

                setURI(photo.uri)
                
            }
        }

        return <Camera style={styles.camera} ref={camRef}>
            <IconButton size={60} icon="camera" mode={"outlined"} style={styles.takePhoto} onPress={() => {
                takePicture()
            }}>
                Bob
            </IconButton>
        </Camera>
    }

    return <View style={styles.view}>
        <Card style={styles.card}> 
        <Card.Content>
            <Title>
                Create new 
                <Title style={styles.title}>
                    {` medicine`}
                </Title>
            </Title>
            <Divider style={{
                marginBottom: 20
            }}/>
            <Avatar.Image size={150} style={styles.image} source={{
                uri: "https://www.cvs.com/bizcontent/marketing/spokenrxlabels/images/safe-banner-mob.png"
            }}>

            </Avatar.Image>

            <Card.Content>
                <Text style={styles.content}>
                    Upload image like the given example above
                </Text>
            </Card.Content>
            <Button icon={"camera"} mode={"contained"} style={styles.upload} onPress={() => {
                askPicture()
            }}>
                Upload
            </Button>
            {
                dayInfo && <Avatar.Image size={150} style={styles.image} source={{ uri: currentUri }}/>
            }
            {
                dayInfo && <Button mode={"contained"} style={styles.next} onPress={() => {
                    navigation.navigate('Info', {
                        Data: dayInfo,
                        URI: currentUri
                    })
                }}> Next</Button>
            }
        </Card.Content>
        </Card>
    </View>
}

const styles = StyleSheet.create({
    modal: {
        bottom: "50%",
        flex: 2,
    },
    view: {
    },
    next: {
        backgroundColor: "#11d99b",
        bottom: "-5%",
    },
    bottomCard: {
        position: "absolute",
        bottom: "-70%"
    },
    card: {
        justifyContent: "center",
        alignContent: "center",
        top: "20%",
        paddingVertical: 30,
    },
    title: {
        fontSize: 30,
        fontWeight: '300',     
    },
    upload: {
        width: "30%",
        backgroundColor: "#2b2b2b",
        marginBottom: 20,
    },
    image: {
        marginBottom: 30,
        backgroundColor: "#E6E6E6",
        borderRadius: 6,
    },
    content: {
        fontSize: 20,
        fontWeight: '300',  
        right: "5%",
        marginBottom: 20,
    },
    camera: {
        flex: 1
    },
    takePhoto: {
        left: "37%",
        top: "85%"
    }
})