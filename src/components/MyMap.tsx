'use client';
import { useEffect, useState } from "react";
import { MapContainer, Marker, Polygon, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { claimArea, setTeamPosition } from "../app/utils/firebase";
import areaGeoData from "@/../public/areas.json";
import { checkCoordinateInAreas } from "@/app/utils/mapFunctions";
import { toast } from "sonner";

interface MyMapProps {
    teamName: string;
    areas: any[];
    teams: any[];
}

export default function MyMap(props: MyMapProps) {
    const startPos: [number, number] = [58.584944, 16.190009];
    const [location, setLocation] = useState<{ latitude: number, longitude: number } | undefined>(undefined);
    const [teamPositions, setTeamPositions] = useState<{ [key: string]: { latitude: number, longitude: number } }>({});

    useEffect(() => {
        // Set the team positions of all teams in the teamPositions state from teams prop
        const teamPositions: { [key: string]: { latitude: number, longitude: number } } = {};
        props.teams.forEach((team: { name: string, teamPosition: { latitude: number, longitude: number } }) => {
            if (team.teamPosition) {
                teamPositions[team.name] = team.teamPosition;
            }
        });
        setTeamPositions(teamPositions);
    }, [props.teams]);

    // Fetch location every 10 seconds
    useEffect(() => {
        const fetchLocation = () => {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(({ coords }) => {
                    // const { latitude, longitude } = { latitude: 58.619158, longitude: 16.147411 }
                    const { latitude, longitude } = coords;
                    setLocation({ latitude, longitude });
                    setTeamPosition(props.teamName, latitude, longitude);
                });
            }
        };
        fetchLocation(); // Fetch location immediately on mount
        const intervalId = setInterval(fetchLocation, 10000); // Fetch location every 10 seconds
        return () => clearInterval(intervalId); // Clear interval on unmount
    }, [props.teamName]);

    const handleClaimArea = (areaName: string) => {
        const area = areaGeoData.find((area: { name: string }) => area.name === areaName);
        if (props.teamName && location && area && checkCoordinateInAreas([location.latitude, location.longitude], [{ ...area, coordinates: area.coordinates as [number, number][] }]).isInside) {
            claimArea(props.teamName, areaName);
            toast("Claimed area!", {
                description: `You have claimed ${areaName} for ${props.teamName}`,
            });
        } else {
            toast("Failed to claim area", {
                description: "You are not in the area you are trying to claim.",
            });
        }
    }

    const createCustomIcon = (teamName: string, color: string) => {
        if (teamName === props.teamName) {
            return L.divIcon({
                className: "custom-icon",
                html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid; transform: translate(-12px, -12px); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; color: black;">You</div>`,
            });
        }
        return L.divIcon({
            className: "custom-icon",
            html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid; transform: translate(-12px, -12px);"></div>`,
        });
    };

    return (
        <div className='bg-gray-200'>
            <MapContainer className="z-0" id="map" center={[58.584944, 16.190009]} zoom={14} scrollWheelZoom={true} style={{ height: "100vh" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={startPos}>
                    <Popup>
                        Startposition
                    </Popup>
                </Marker>
                {props.areas && props.areas.map((area: { name: string, status: string, claimedBy: string, points: number }) => {
                    const areaData = areaGeoData.find((a: { name: string }) => a.name === area.name);
                    if (!areaData) {
                        console.error(`No coordinates found for area: ${area.name}`);
                        return null;
                    }
                    const coordinates: [number, number][] = areaData.coordinates.map((coord: number[]) => [coord[0], coord[1]] as [number, number]);
                    return (
                        // Get the color of the team that has claimed the area
                        <Polygon key={area.name} positions={coordinates} pathOptions={{ color: props.teams.find((team: { name: string; }) => team.name === area.claimedBy)?.teamColor }}>
                            <Popup interactive={true}>
                                <p className="font-bold">{area.name}</p>
                                <div className="">
                                    <p>Status: {area.status}</p>
                                    {area.status == "claimed" && <p>Claimed By: {area.claimedBy}</p>}
                                    <p>Points: {area.points}</p>
                                </div>
                                {area.claimedBy != props.teamName &&
                                    <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded" onClick={() => handleClaimArea(area.name)}>Claim</button>
                                }
                            </Popup>
                        </Polygon>
                    );
                })}

                {props.teams &&
                    props.teams.map((team: { name: string, teamPosition: { latitude: number, longitude: number, lastUpdated: Date }, teamColor: string }) => {
                        if (team.teamPosition && team.teamPosition.latitude !== undefined && team.teamPosition.longitude !== undefined) {
                            return (
                                <Marker
                                    key={team.name}
                                    position={[team.teamPosition.latitude, team.teamPosition.longitude]}
                                    icon={createCustomIcon(team.name, team.teamColor)}
                                >
                                    <Popup>
                                        <p>Team position of:</p>
                                        <p className="font-bold">{team.name}</p>
                                        <p>Last updated at {new Date(team.teamPosition.lastUpdated).toLocaleString()}</p>

                                    </Popup>
                                </Marker>
                            );
                        }
                        return null;
                    })
                }

            </MapContainer >
        </div >
    )
}