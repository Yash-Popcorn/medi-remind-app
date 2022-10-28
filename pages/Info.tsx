import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Card, Divider, List, Switch, TextInput } from "react-native-paper";
import { basicAlert } from "../components/alert";
import { infoInterface } from "../components/interfaces";
import * as Notifications from 'expo-notifications';
import { getItemAsync } from "expo-secure-store";
import { api } from "./Dashboard";
import { createEventAsync, useCalendarPermissions } from "expo-calendar";
import { documentDirectory, downloadAsync } from "expo-file-system";

export default function Info() {

    const route = useRoute()
    const info = route.params as infoInterface
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const [location, setLocation] = React.useState("")
    const [name, setName] = React.useState("")
    const navigation = useNavigation()
    const [status, requestPermission] = useCalendarPermissions();

    const createEvent = async () => {
        const id = await getItemAsync('calender')
        if (id) {
            await createEventAsync(id, {
                calendarId: id,
                location: "Home",
                title: `${name} reminder`,
                notes: `Remember to take your medicine. ${info.Data}`,
                startDate: new Date(),
                endDate: new Date(),
                alarms: [
                    {
                        relativeOffset: 1
                    }
                ],
                recurrenceRule: {
                    frequency: "DAILY",
                    occurrence: 10,
                }
            })
        }
    }

    const onToggleSwitch = async () => {
        setIsSwitchOn(!isSwitchOn)

        if (!isSwitchOn) {
            
            if (!status?.granted) {
                setIsSwitchOn(false)
                basicAlert("Notifications", "Go to settings and enable notifications for reminders")
                await requestPermission()
            } else {
                console.log("Has noti on")
            }
        }
    }

    async function add(gmail: string, info: {}) {
        console.log(gmail, isSwitchOn)
        const response = await fetch(`${api}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                'gmail': gmail,
                'info': info,
                'name': name
            })
        })

        if (isSwitchOn) await createEvent()

        return response.json()
    }

    const onRequest = async () => {
        if (location === "") basicAlert("Invalid Location", "Must provide a location")
        else if (name === "") basicAlert("Invalid Name", "Must provide valid a name")

        const { uri } = await downloadAsync(info.URI, documentDirectory + `${Date.now()}.jpeg`)
        const bodyData = {
            location: location,
            days: info.Data,
            uri: uri,
        }
        const result = await add(await getItemAsync("current-email") || "", bodyData)
        if (result) {
            navigation.navigate('Dashboard')
        }
    }

    return <Card>
        <Card.Content>
            <Card.Title title={"Info Card"}/>
            <Card.Cover source={{
                uri: info.URI
            }} style={styles.cover}/>
            <Divider/>
            <TextInput onChangeText={text => setLocation(text)} style={styles.input} label={"Last Location"} placeholder={"Near John Doe's desk"} selectionColor={"#2b2b2b"} outlineColor={"#2b2b2b"} activeUnderlineColor={"#2b2b2b"}>

            </TextInput>
            <TextInput onChangeText={text => setName(text)} style={styles.medicine_input} label={"Medicine Name"} placeholder={"Lorem Ipsum medicine"} selectionColor={"#2b2b2b"} outlineColor={"#2b2b2b"} activeUnderlineColor={"#2b2b2b"}/>
            <Text style={styles.switch_text}>
                Show on calendar
            </Text>
            <Switch value={isSwitchOn} onValueChange={onToggleSwitch} style={styles.switch}>
                
            </Switch>
            <Card.Actions>
                <Button mode={"contained"} style={styles.button} onPress={onRequest}>
                    Submit
                </Button>
            </Card.Actions>

            <View style={styles.container}>
                <List.Item title={`Morning (${info.Data.MORNING && `${info.Data.MORNING} Tablet` || "None"})`} titleStyle={{ marginLeft: -23}} style={styles.item} left={props => <List.Icon {...props} icon="weather-sunset" />}/>
                <List.Item title={`Midday (${info.Data.MIDDAY && `${info.Data.MIDDAY} Tablet` || "None"})`}  titleStyle={{ marginLeft: -23}} style={styles.item} left={props => <List.Icon {...props} icon="white-balance-sunny" />}/>
                <List.Item title={`Evening (${info.Data.EVENING && `${info.Data.EVENING} Tablet` || "None"})`}  titleStyle={{ marginLeft: -23}} style={styles.item} left={props => <List.Icon {...props} icon="theme-light-dark" />}/>
                <List.Item title={`Bedtime (${info.Data.BEDTIME && `${info.Data.BEDTIME} Tablet` || "None"})`}  titleStyle={{ marginLeft: -23}}  style={styles.item} left={props => <List.Icon {...props} icon="weather-night" />}/>
            </View>
        </Card.Content>
    </Card>
}

const styles = StyleSheet.create({
    item: {
        marginBottom: -20,
    },
    switch_text: {
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 5,
    },
    container: {
        left: "53%",
        bottom: "15%",
    },
    switch: {
        marginBottom: 30,
    },
    cover: {
        marginBottom: 20,
        backgroundColor: "#2b2b2b"
    },
    button: {
        right: "22%",
        backgroundColor: "#2b2b2b"
    },
    input: {
        marginBottom: 10,
    },
    medicine_input: {
        marginBottom: 20,
    }
})