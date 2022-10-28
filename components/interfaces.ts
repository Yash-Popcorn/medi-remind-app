import { TokenResponse } from "expo-auth-session";

export type dashboardInterface = {
    data: TokenResponse
}

export type infoInterface = {
    Data: {
        MORNING?: number,
        EVENING?: number,
        MIDDAY?: number,
        BEDTIME?: number,
    },
    URI: string
}

export interface medicineInterfaces {
    Code: 200,
    Data: {} // Because it's dictionary currently
}