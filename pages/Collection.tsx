import { getItemAsync } from "expo-secure-store";
import React, { useState } from "react";
import { FlatList, SafeAreaView, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { Button, Card, List } from "react-native-paper";
import { infoInterface, medicineInterfaces } from "../components/interfaces";
import { api } from "./Dashboard";

interface data {
    id: string
    title: string
    location: string
    uri?: string
    days: infoInterface["Data"]
}

  

export default function Collection() {

    const [data, setData] = useState<undefined | data[]>()

    const fetchMedicines = async () => {
        const response = await fetch(`${api}/get_medicines`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                'gmail': await getItemAsync("current-email") || ""
            })
        })
        return response.json()
    }

    const renderItem = ({ item }: {item: data}) => {
        //console.log(item)
        return <Card>
            <Card.Content>
                <Card.Title title={item.id} subtitle={item.location}/>
                <Card.Cover source={{
                    uri: item.uri
                }}/>

                <List.Item title={`Morning (${item.days.MORNING && `${item.days.MORNING} Tablet` || "None"})`} titleStyle={{ marginLeft: -23}} style={styles.item} left={props => <List.Icon {...props} icon="weather-sunset" />}/>
                <List.Item title={`Midday (${item.days.MIDDAY && `${item.days.MIDDAY} Tablet` || "None"})`}  titleStyle={{ marginLeft: -23}} style={styles.item} left={props => <List.Icon {...props} icon="white-balance-sunny" />}/>
                <List.Item title={`Evening (${item.days.EVENING && `${item.days.EVENING} Tablet` || "None"})`}  titleStyle={{ marginLeft: -23}} style={styles.item} left={props => <List.Icon {...props} icon="theme-light-dark" />}/>
                <List.Item title={`Bedtime (${item.days.BEDTIME && `${item.days.BEDTIME} Tablet` || "None"})`}  titleStyle={{ marginLeft: -23}}  style={styles.item} left={props => <List.Icon {...props} icon="weather-night" />}/>
            </Card.Content>
        </Card>
    }

    React.useEffect(() => {
        fetchMedicines().then((result: medicineInterfaces) => {
            const arr = new Array<data>()

            for (let k in result.Data) {
                arr.push({
                    ...(result.Data[k as keyof medicineInterfaces['Data']] as data),
                    id: k
                })
            }
            
            setData(arr)
        }).catch(console.error)
    }, [])

    return <View>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            >

            </FlatList>
    </View>
}

const styles = StyleSheet.create({
    item: {
        marginBottom: -30,
    },
    view: {
       flex: 1
    },
    card: {

       
    },
    cardAvatar: {
        height: "50%",
        borderRadius: 10,
    },
    delete: {
        left: "520%",
    }
})