import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { TokenResponse } from "expo-auth-session";
import React, { useState } from "react";
import { Image, Modal, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { dashboardInterface } from "../components/interfaces";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Welcome from "./Welcome";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { getItemAsync, setItemAsync } from "expo-secure-store";
import * as Calendar from 'expo-calendar';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar, BottomNavigation } from "react-native-paper";

export const api = 'https://yash-popcorn-yash-ninja-medicine-backend-6pw7774wjggh5xxr-5000.preview.app.github.dev/'


interface accountInterface {
    email: string
    picture: string
    name: string
    given_name: string
}

type ProfileScreenRouteProp = RouteProp<dashboardInterface, 'Dashboard'>;

//const Tab = createMaterialBottomTabNavigator()

export default function Dashboard() {

    const route = useRoute<ProfileScreenRouteProp>()
    const [account, setAccount] = useState<undefined | accountInterface>()
    const navigation = useNavigation()
    
    React.useEffect(() => {
        /**
         * TO DO:
         * Add caching for the user info
         */

        (async () => {
            const { status } = await Calendar.requestCalendarPermissionsAsync();
            if (status === 'granted') {
                const id = getItemAsync('calender')
                if (id === null) {
                    await setItemAsync('calender', await createCalendar())
                }
            }
        })()

        async function createCalendar() {
            const defaultCalendarSource =
                Platform.OS === 'ios'
                ? await Calendar.getDefaultCalendarAsync()
                    : { isLocalAccount: true, name: 'Medicine Calender' };

            const newCalendarID = await Calendar.createCalendarAsync({
                title: 'Medicine Calender',
                color: 'red',
                entityType: Calendar.EntityTypes.EVENT,
                name: 'internalCalendarName',
                ownerAccount: 'personal',
                accessLevel: Calendar.CalendarAccessLevel.OWNER,
            });
            console.log(`Your new calendar ID is: ${newCalendarID}`);
            return newCalendarID
        }

        async function fetchUserInfo(token: string) {
            const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
            });
          
            return await response.json();
        }

        async function signUp(gmail: string) {
            const response = await fetch(`${api}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    'gmail': gmail.toString()
                })
            })

            return response.json()
        }

        const info = route.params as dashboardInterface
        
        fetchUserInfo(info.data.accessToken).then(async result => {
            setAccount(result)

            if (account?.email) {
                await setItemAsync("current-email", account.email)
                try {
                    const response = await signUp(account.email)
                    console.log(response)
                } catch (err) {
                    console.log('Maybe already login')
                }
            }
            
        }).catch(console.error)
    }, [])

    /*
    <View style={styles.title}>
                <Text style={styles.welcome}>
                    Welcome back,  
                    <Text style={{color: "orange"}}>
                        {` ${account?.name}` || "Error"}
                    </Text>
                </Text>
            </View>
            
            <View style={styles.display}>
                <Image style={styles.avatar} source={{
                    uri: account?.picture
                }}/>
            </View>
            
            <SafeAreaView style={styles.addContainer}>
                <FontAwesome.Button name="plus" borderRadius={40} backgroundColor={"#2FC848"} size={45} style={styles.add} onPress={() => {
                    navigation.navigate('Create')
                }}>
                
                </FontAwesome.Button>
            </SafeAreaView>
    */
    /*
    <TouchableOpacity onPress={() => {
                console.log("EE")
            }} activeOpacity={0.9}>
                <LinearGradient
                    start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                    colors={['#895cf2', '#ffabf4', '#895cf2']}
                    style={styles.button}>
                    <Text style={styles.gradText}>Create new medicine</Text>
                </LinearGradient>
            </TouchableOpacity>
    */
    return (    
        <View style={styles.container}>
            <Text style={styles.title}>
                Dashboard
            </Text>


            <View style={styles.card}>
                <Text style={styles.cardText}>
                    Welcome, {account?.name}
                </Text>
            </View>

            <View style={styles.bigCard}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('Collection')
                }} activeOpacity={0.9}>
                    <LinearGradient
                        start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                        colors={['#2b2b2b', '#141414', '#262626']}
                        style={styles.button}>
                        <Text style={styles.createText}>My Medicines                       💊</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    navigation.navigate('Create')
                }} activeOpacity={0.9}>
                    <LinearGradient
                        start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                        colors={['#ff8400', '#ff9e36', '#ffb01c']}
                        style={styles.button}>
                        <Text style={styles.createText}>Create new medicine            +</Text>
                    </LinearGradient>
                    <View style={styles.downView}>
                        <Text style={styles.down}>
                            Create a new medicine by simply taking a picture and provide information
                        </Text>
                    </View>
                   
                </TouchableOpacity>
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    down: {
        borderRadius: 14,
        fontSize: 30,
        textAlign: "center",
        fontWeight: "600",
        color: "#5e5e5e",
    },
    downView: {
        backgroundColor: "#e6e6e6",
        flex: .8,
        borderRadius: 14,
        padding: 30
    },
    bigCard: {
        borderRadius: 14,
        padding: 15,
        alignItems: 'center',
        flex: .7,
        backgroundColor: "#ffffff",
        aspectRatio: .75,
        borderWidth: 1.5,
        borderColor: "#e0e0e0",
        alignContent: "center",
    },
    cardText: {
        fontWeight: "500",
        fontSize: 30,
        padding: 10,
        color: "#4d4d4d"
    },
    card: {
        flex: .2,
        backgroundColor: "#ffffff",
        aspectRatio: 2.8,
        borderWidth: 1.5,
        borderRadius: 14,
        borderColor: "#e0e0e0",
        marginBottom: 30,
    },
    title: {
        top: "5%",
        right: "25%",
        marginBottom: 80,
        fontWeight: "600",
        fontSize: 30
    },
    gradText: {
        fontWeight: "700",
        fontSize: 20,
        color: "#ffffff",
    },
    createText: {
        fontWeight: "700",
        fontSize: 20,
        color: "#ffffff",
    },
    button: {
        padding: 15,
        alignItems: 'center',
        borderRadius: 14,
        top: "10%",
        marginBottom: 20,
        zIndex: 10
    },
    board: {

    },
    sub: {
        fontWeight: "400",
        fontSize: 50,
        color: "#404040",
        left: "13%"
    },
    container: {
        backgroundColor: "#fffff",
        flex: 1,
        alignContent: "center",
        alignItems: "center",

    },
    avatarContainer: {
        flex: .5,
        backgroundColor: '#eeee',
        borderRadius: 30,
    },
    myCollection: {
        height: "120%",
        
    },
    display: {
        width: "85%",
        height: "140%",
        backgroundColor: "white",
        alignContent: 'center',
        alignItems: "center",
        bottom: "-50%",
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        borderRadius: 8,
    },
    welcome: {
        bottom: "-15%",
        fontWeight: '600',
        fontSize: 36,
        color: '#000000'
    },
    avatar: {
    },
    add: {
        right: "-10%"
    },
    
    addContainer: {
        position: 'absolute',
        right: '5%',
        top: '460%',
    }
})