import { Alert } from "react-native";

export const basicAlert = (title: string, message: string) => {
    Alert.alert(
        title,
        message,
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
    );
}
