'use client';
import { useEffect, useState } from "react";
import { MapContainer, Marker, Polygon, Popup, TileLayer, Tooltip } from "react-leaflet";
import { addTeam, claimArea, deleteTeam, listenForAreas, listenForTeams } from "../utils/firebase";
import areaGeoData from "@/../public/areas.json";

export default function MyMap(props: any) {

    const [location, setLocation] = useState<{ latitude: number, longitude: number } | undefined>(undefined);
    const [areas, setAreas] = useState<any[]>([]);
    const [teamName, setTeamName] = useState<string>();
    const [teams, setTeams] = useState<any[]>([]);
    const [newTeam, setNewTeam] = useState<string>("");
    const [newTeamColor, setNewTeamColor] = useState<string>("");


    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                const { latitude, longitude } = coords;
                setLocation({ latitude, longitude });
            })
        }
    }, []);

    useEffect(() => {
        listenForAreas(setAreas);
    }, []);

    useEffect(() => {
        listenForTeams(setTeams);
    }, []);

    const { position, zoom } = props;
    const startPos: [number, number] = [58.584944, 16.190009];

    useEffect(() => {
        if (teamName === undefined) {
            const selectedTeam = localStorage.getItem("selectedTeam");
            if (selectedTeam) {
                setTeamName(selectedTeam);
                console.log("Setting team from local storage to:", selectedTeam);
            }
        }
    }, [teamName]);

    const setDefaultTeamLocalStorage = (teamName: string) => {
        console.log("Setting default team to:", teamName);
        localStorage.setItem("selectedTeam", teamName);
        setTeamName(teamName);
    }

    const handleClaimArea = (areaName: string) => {
        console.log("Trying to claim area...");
        if (teamName) {
            console.log(`Claiming area: ${areaName}`);
            claimArea(teamName, areaName);
        } else {
            alert("Please select a team first");
        }
    }

    return (
        <div className='bg-gray-200'>
            <div className="flex flex-row">
                <div className="border-r-2 border-gray-400 pr-4">
                    <select value={teamName} onChange={(e) => (setDefaultTeamLocalStorage(e.target.value))}>
                        <option disabled value="">Choose team...</option>
                        {teams.map(team => {
                            return <option key={team.id} value={team.name}>{team.name}</option>
                        })}
                    </select>
                    <button className="border-2 p-2" onClick={() => (teamName ? deleteTeam(teamName) : alert("Please select a team first"))}>DELETE</button>
                </div>
                <div>
                    <p>Add team</p>
                    <input className="bg-gray-400" type="text" onChange={(e) => (setNewTeam(e.target.value))} />
                    <input className="bg-gray-400" type="text" onChange={(e) => setNewTeamColor(e.target.value)} />
                    <button className="border-2" onClick={() => ((newTeam && newTeam !== "") ? addTeam(newTeam, newTeamColor) : null)}>Add</button>
                </div>
            </div>
            <MapContainer id="map" center={[58.584944, 16.190009]} zoom={14} scrollWheelZoom={true} style={{ height: "100vh" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={startPos}>
                    <Popup>
                        Startposition
                    </Popup>
                </Marker>
                {areas && areas.map((area: { name: string, status: string, claimedBy: string, points: number }) => {
                    const areaData = areaGeoData.find((a: { name: string }) => a.name === area.name);
                    if (!areaData) {
                        console.error(`No coordinates found for area: ${area.name}`);
                        return null;
                    }
                    const coordinates: [number, number][] = areaData.coordinates.map((coord: number[]) => [coord[0], coord[1]] as [number, number]);
                    return (
                        //get the color of the team that has claimed the area
                        <Polygon key={area.name} positions={coordinates} pathOptions={{ color: teams.find(team => team.name === area.claimedBy)?.teamColor }}>

                            <Popup interactive={true}>
                                <p className="font-bold">{area.name}</p>
                                <div className="">
                                    <p>Status: {area.status}</p>
                                    {area.status == "claimed" && <p>Claimed By: {area.claimedBy}</p>}
                                    <p>Points: {area.points}</p>
                                </div>
                                {area.claimedBy != teamName &&
                                    <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded" onClick={() => handleClaimArea(area.name)}>Claim</button>
                                }
                            </Popup>
                        </Polygon>
                    );
                })}

                {/* Pin on user location */}
                {
                    location &&
                    <Marker position={[location.latitude, location.longitude]}>
                        <Popup>
                            Your location
                        </Popup>
                    </Marker>
                }

            </MapContainer >
        </div >
    )
}