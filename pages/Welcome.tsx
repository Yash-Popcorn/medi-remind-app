import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native"
import * as animationData from "../assets/cover.json"
import { useNavigation } from "@react-navigation/native";
import React from "react";
import * as SecureStore from 'expo-secure-store';
import { TokenResponse } from "expo-auth-session";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Google from 'expo-auth-session/providers/google';
import { basicAlert } from "../components/alert";

export default function Welcome() {

    const navigation = useNavigation()

    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: '513025633283-ensoo8grpovmb104rem5h6et20ip956o.apps.googleusercontent.com',
    });

    React.useEffect(() => {
        const getToken = async () => {
            const data: string | null  = await SecureStore.getItemAsync("google-token")
            if (data === null) return undefined
    
            const result: TokenResponse = JSON.parse(data)
            const secondsSinceEpoch = Math.round(Date.now() / 1000)
            
            if (result.expiresIn === undefined) return
            return secondsSinceEpoch - result.issuedAt < result.expiresIn && result || "Expired"
        }

        getToken().then(result => {
            if (result && result !== "Expired") {
                
                navigation.navigate('Dashboard', {
                    data: result
                })
                
            } else if (result === "Expired") {
                basicAlert('Expired Token', 'Your token has expired!')
            } else {
                console.log("NOTHING")
            }
        }).catch(console.error)
    }, [])

    React.useEffect(() => {
        if (response?.type === "success") {
            const data = JSON.stringify(response.authentication)
            SecureStore.setItemAsync("google-token", data).then(() => {
                navigation.navigate('Dashboard', {
                    data: response.authentication
                })
            })
        }
    }, [response])

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>
                Medicine Reminder
            </Text>
            <Text style={styles.subtitle}>
                Daily reminder for your medicines
            </Text>
            <LottieView
                loop={true}
                autoPlay={true}
                style={{
                    width: 350 * 1.2,
                    height: 350 * 1.2,
                    right: "6%",
                    top: "15%",
                }}
                source={animationData}
            />
            <View style={styles.buttonContainer}>
                <FontAwesome.Button style={styles.button} borderRadius={8} name="google" size={65} backgroundColor="#2b8eff" onPress={() => {
                    promptAsync()
                }}>
                    Login with
                </FontAwesome.Button>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: "#ededed",
      flexDirection: "column",
      flex: 1,
    },
    title: {
        fontWeight: "bold",
        fontSize: 50,
        color: "#404040",
        right: "15%",
        bottom: "7%"
    },
    subtitle: {
        fontWeight: "semi-bold",
        fontSize: 20,
        color: "#4d4d4d",
        right: "4%",
        bottom: "7%"
    },
    button: {
        
    },
    buttonContainer: {
        bottom:"35%"
    }
});