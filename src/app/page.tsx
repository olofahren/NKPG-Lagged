'use client';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import StartMenu from '../components/StartMenu';
import { listenForAreas, listenForEvents, listenForTeams } from './utils/firebase';

export default function Home() {
  const [areas, setAreas] = useState<any[]>([]);
  const [teamName, setTeamName] = useState<string>();
  const [teams, setTeams] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    listenForAreas(setAreas);
  }, []);

  useEffect(() => {
    listenForTeams(setTeams);
  }, []);

  useEffect(() => {
    listenForEvents(setEvents);
  }, []);



  useEffect(() => {
    if (teamName === undefined) {
      const selectedTeam = localStorage.getItem("selectedTeam");
      if (selectedTeam) {
        setTeamName(selectedTeam);
        console.log("Setting team from local storage to:", selectedTeam);
      }
    }
  }, [teamName]);

  const Map = useMemo(() => dynamic(
    () => import('@/components/MyMap'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])

  return (
    <div className="h-screen">
      <div className="h-1/12 p-3 flex flex-row justify-between items-center">
        <StartMenu teams={teams} setTeams={setTeams} teamName={teamName || ''} setTeamName={setTeamName} events={events} />
        <h1 className="text-2xl font-bold">NKPG Lagged</h1>
      </div>
      <div className='h-10/12 overflow-hidden'>
        <Map teamName={teamName || ''} areas={areas} teams={teams} />
      </div>
      <div className='h-1/12 p-3 flex justify-center items-center'>
        <p className='text-xl font-bold'>TIME LEFT: 99:99</p>
      </div>
    </div>
  );
}
