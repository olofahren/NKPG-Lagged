'use client';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import StartMenu from '../components/StartMenu';
import { listenForAreas, listenForEvents, listenForTeams } from './utils/firebase';
import LeaderBoard from '@/components/LeaderBoard';

export default function Home() {
  const [areas, setAreas] = useState<any[]>([]);
  const [teamName, setTeamName] = useState<string>();
  const [teams, setTeams] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>(events[0]?.name);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const sortedEvents = events.sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime());
    setSelectedEvent(sortedEvents[0]?.name);
  }, [events]);

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
      }
    }
  }, [teamName]);

  useEffect(() => {
    const interval = setInterval(() => {
      const event = events.find(event => event.name === selectedEvent);
      if (event) {
        const endTime = new Date(event.endTime).getTime();
        const currentTime = new Date().getTime();
        const timeLeft = Math.max(0, endTime - currentTime);
        setTimeLeft(timeLeft);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [events, selectedEvent]);

  const formatTimeLeft = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

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
        <StartMenu teams={teams} setTeams={setTeams} teamName={teamName || ''} setTeamName={setTeamName} events={events} selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} />
        <h1 className="text-2xl font-bold">NKPG Lagged</h1>
        <p className='text-xl font-bold'>{formatTimeLeft(timeLeft)}</p>
      </div>
      <div className='h-11/12 overflow-hidden'>
        <LeaderBoard teams={teams} setTeams={setTeams} teamName={teamName || ''} events={events} selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} />
        <Map teamName={teamName || ''} areas={areas} teams={teams} />
      </div>
    </div>
  );
}