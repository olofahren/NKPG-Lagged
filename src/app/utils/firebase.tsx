import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, push, remove, update, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const database = getDatabase(app);

// Initialize Firebase Auth
const auth = getAuth(app);

/**
 * Listens for changes to the teams in the Realtime Database
 * @param {function} callback - Function to call with the updated teams data
 */
function listenForTeams(callback: (teams: any[]) => void) {
    const teamsRef = ref(database, "teams");
    onValue(teamsRef, (snapshot) => {
        const teamsData = snapshot.val();
        const teamsArray = teamsData ? Object.keys(teamsData).map(key => ({
            id: key,
            ...teamsData[key]
        })) : [];
        callback(teamsArray);
    });
}

/**
 * Listens for changes to the areas in the Realtime Database
 * @param {function} callback - Function to call with the updated areas data
 */
function listenForAreas(callback: (areas: any[]) => void) {
    const areasRef = ref(database, "areas");
    onValue(areasRef, (snapshot) => {
        const areasData = snapshot.val();
        const areasArray = areasData ? Object.keys(areasData).map(key => ({
            id: key,
            ...areasData[key]
        })) : [];
        callback(areasArray);
    });
}

function listenForEvents(callback: (events: any[]) => void) {
    const eventsRef = ref(database, "events");
    onValue(eventsRef, (snapshot) => {
        const eventsData = snapshot.val();
        const eventsArray = eventsData ? Object.keys(eventsData).map(key => ({
            id: key,
            ...eventsData[key]
        })) : [];
        callback(eventsArray);
    });
}

/**
 * Retrieves all teams from the Realtime Database
 * @returns {Promise<Array>} Array of team objects
 */
async function getTeams() {
    try {
        const teamsRef = ref(database, "teams");
        const snapshot = await get(teamsRef);

        if (!snapshot.exists()) {
            console.log("No teams data available");
            return [];
        }

        const teamsData = snapshot.val();
        const teamsArray = Object.keys(teamsData).map(key => ({
            id: key,
            ...teamsData[key]
        }));

        console.log(`Successfully retrieved ${teamsArray.length} teams`);
        return teamsArray;

    } catch (error) {
        console.error("Error retrieving teams:", error);
        throw error;
    }
}

/**
 * Retrieves all areas from the Realtime Database
 * @returns {Promise<Array>} Array of area objects
 */
async function getAreas() {
    try {
        const areasRef = ref(database, "areas");
        const snapshot = await get(areasRef);

        if (!snapshot.exists()) {
            console.log("No areas data available");
            return [];
        }

        const areasData = snapshot.val();
        const areasArray = Object.keys(areasData).map(key => ({
            id: key,
            ...areasData[key]
        }));

        console.log(`Successfully retrieved ${areasArray.length} areas`);
        return areasArray;

    } catch (error) {
        console.error("Error retrieving areas:", error);
        throw error;
    }
}

async function getEvents() {
    try {
        const eventsRef = ref(database, "events");
        const snapshot = await get(eventsRef);

        if (!snapshot.exists()) {
            console.log("No areas data available");
            return [];
        }

        const eventsData = snapshot.val();
        const eventsArray = Object.keys(eventsData).map(key => ({
            id: key,
            ...eventsData[key]
        }));

        console.log(`Successfully retrieved ${eventsArray.length} events`);
        return eventsArray;

    } catch (error) {
        console.error("Error retrieving events:", error);
        throw error;
    }
}

async function addArea(areaName: string, points: number, areaStatus?: string, claimedBy?: string) {
    try {
        const areasRef = ref(database, "areas");
        await push(areasRef, {
            name: areaName,
            status: areaStatus ? areaStatus : "unclaimed",
            claimedBy: claimedBy ? claimedBy : "none",
            points: points
        });

    } catch (error) {
        console.error("Error adding area:", error);
        throw error;
    }
}

async function addTeam(teamName: string, teamColor: string) {
    try {
        const teamsRef = ref(database, "teams");
        await push(teamsRef, {
            name: teamName,
            claimedAreas: [],
            teamColor: teamColor
        });

        console.log(`Successfully added team: ${teamName}`);

    } catch (error) {
        console.error("Error adding team:", error);
        throw error;
    }
}

async function deleteTeam(teamName: string) {
    try {
        console.log("Trying to delete team:", teamName);
        const teamsRef = ref(database, "teams");
        const teamsSnapshot = await get(teamsRef);
        const teamsData = teamsSnapshot.val();
        const teamKey = Object.keys(teamsData).find(key => teamsData[key].name === teamName);
        const teamRef = ref(database, `teams/${teamKey}`);

        await remove(teamRef);

        console.log(`Successfully deleted team: ${teamName}`);

    } catch (error) {
        console.error("Error deleting team:", error);
        throw error;
    }
}

async function claimArea(teamName: string, area: string) {
    try {
        const areasRef = ref(database, "areas");
        const areasSnapshot = await get(areasRef);
        const areasData = areasSnapshot.val();
        const areaKey = Object.keys(areasData).find(key => areasData[key].name === area);
        const areaRef = ref(database, `areas/${areaKey}`);

        await update(areaRef, {
            status: "claimed",
            claimedBy: teamName
        });

        console.log(`Successfully claimed area: ${area}`);

    } catch (error) {
        console.error("Error claiming area:", error);
        throw error;
    }
}

async function setEventTimes(eventName: string, startTime: string, endTime: string) {
    try {
        const eventRef = ref(database, `events/${eventName}`);
        await update(eventRef, {
            name: eventName,
            startTime: startTime,
            endTime: endTime
        });

        console.log(`Successfully set event times for ${eventName}`);

    } catch (error) {
        console.error("Error setting event times:", error);
        throw error;
    }

}

async function getEventTimes(eventName: string) {
    try {
        const eventRef = ref(database, `events/${eventName}`);
        const snapshot = await get(eventRef);

        if (!snapshot.exists()) {
            console.log(`No event times available for ${eventName}`);
            return {};
        }

        const eventData = snapshot.val();
        console.log(`Successfully retrieved event times for ${eventName}`);
        return eventData;

    } catch (error) {
        console.error("Error retrieving event times:", error);
        throw error;
    }
}

export { database, auth, getTeams, addTeam, deleteTeam, claimArea, getAreas, addArea, listenForTeams, listenForAreas, setEventTimes, getEventTimes, getEvents, listenForEvents };