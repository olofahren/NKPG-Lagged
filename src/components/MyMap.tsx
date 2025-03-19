'use client';
import { useEffect, useState } from "react";
import { MapContainer, Marker, Polygon, Popup, TileLayer } from "react-leaflet";
import { claimArea } from "../app/utils/firebase";
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

    useEffect(() => {
        const fetchLocation = () => {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(({ coords }) => {
                    const { latitude, longitude } = coords;
                    setLocation({ latitude, longitude });
                });
            }
        };
        fetchLocation(); // Fetch location immediately on mount
        const intervalId = setInterval(fetchLocation, 10000); // Fetch location every 10 seconds
        return () => clearInterval(intervalId); // Clear interval on unmount
    }, []);

    const handleClaimArea = (areaName: string) => {
        const area = areaGeoData.find((area: { name: string }) => area.name === areaName);
        if (props.teamName && location && area && checkCoordinateInAreas([location.latitude, location.longitude], [{ ...area, coordinates: area.coordinates as [number, number][] }]).isInside) {
            claimArea(props.teamName, areaName);
        } else {
            toast("Failed to claim area", {
                description: "You are not in the area you are trying to claim.",
            })
        }
    }

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
                        //get the color of the team that has claimed the area
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