'use client';
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { addTeam, deleteTeam, setEventTimes } from "../app/utils/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import DateTimePicker24h from "@/components/DateTimePicker";

interface Team {
    id: string;
    name: string;
    teamColor: string;
}

interface StartMenuProps {
    teams: Team[];
    setTeams: any;
    teamName: string;
    setTeamName: any;
    events: any[];
}

export default function StartMenu(props: StartMenuProps) {
    const [newTeam, setNewTeam] = useState<string>("");
    const [newTeamColor, setNewTeamColor] = useState<string>("");
    const [settingMode, setSettingMode] = useState<string>("default");
    const [selectedEvent, setSelectedEvent] = useState<string>("");
    //get the date and time from the selected event
    const [eventStartDate, setEventStartDate] = useState<Date>();
    const [eventEndDate, setEventEndDate] = useState<Date>();


    // get the date and time from the selected event
    useEffect(() => {
        if (selectedEvent !== "") {
            const event = props.events.find((event: { name: string; }) => event.name === selectedEvent);
            if (event) {
                setEventStartDate(new Date(event.startTime));
                setEventEndDate(new Date(event.endTime));
            }
        }
    }, [selectedEvent]);


    const setDefaultTeamLocalStorage = (teamName: string) => {
        localStorage.setItem("selectedTeam", teamName);
        props.setTeamName(teamName);
    }

    return (
        <Dialog onOpenChange={(isOpen) => isOpen && setSettingMode("default")}>
            <DialogTrigger>
                <FontAwesomeIcon size="2xl" icon={faBars} />
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center z-50" aria-describedby="dialog-description">
                <DialogHeader>
                    <DialogTitle>Game options</DialogTitle>
                    <Select onValueChange={(value) => setSettingMode(value)} defaultValue="default">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select options to edit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="default">Player options</SelectItem>
                            <SelectItem value="teams">Manage teams</SelectItem>
                            <SelectItem value="add-team">Add teams</SelectItem>
                            <SelectItem value="event">Manage event</SelectItem>
                        </SelectContent>
                    </Select>
                </DialogHeader>

                <div className="flex flex-row">
                    {settingMode === "default" &&
                        <div>
                            <p className="font-bold">Select team</p>
                            <Select value={props.teamName} onValueChange={(value) => (setDefaultTeamLocalStorage(value))}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select team" />
                                </SelectTrigger>
                                <SelectContent>
                                    {props.teams.map((team: { id: string; name: string; teamColor: string }) => (
                                        <SelectItem key={team.id} value={team.name}>{team.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    }
                    {settingMode === "teams" &&
                        <div className="">
                            <Table>
                                <TableCaption>All active teams</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Team name</TableHead>
                                        <TableHead>
                                            Color
                                        </TableHead>
                                        <TableHead>Manage</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {props.teams.map((team: { id: string; name: string, teamColor: string }) => (
                                        <TableRow key={team.id}>
                                            <TableCell>
                                                {team.name}
                                            </TableCell>
                                            <TableCell>
                                                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: team.teamColor }}></div>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant={"destructive"} onClick={() => (props.teamName ? deleteTeam(team.name) : alert("Please select a team first"))}>DELETE</Button>
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                        </div>
                    }
                    {settingMode === "add-team" &&
                        <div>
                            <p className="font-bold">Add team</p>
                            <label className="text-xs">Team name:</label>
                            <Input type="text" onChange={(e) => (setNewTeam(e.target.value))} />
                            <label className="text-xs">Team color:</label>
                            <Input type="color" onChange={(e) => setNewTeamColor(e.target.value)} />
                            <Button className="border-2" onClick={() => ((newTeam && newTeam !== "") ? addTeam(newTeam, newTeamColor) : null)}>Add</Button>
                        </div>
                    }
                    {settingMode === "event" &&
                        <div>
                            <p className="font-bold">Event options</p>
                            <Select onValueChange={(value) => setSelectedEvent(value)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select options to edit" />
                                </SelectTrigger>
                                <SelectContent defaultValue={props.events && props.events[0]}>
                                    {props.events.map((team: { id: string; name: string; }) => (
                                        <SelectItem key={team.id} value={team.name}>{team.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {selectedEvent != "" && <div>
                                <div className="flex flex-row">
                                    <div>
                                        <label className="text-xs">Start time:</label>
                                        <DateTimePicker24h date={eventStartDate} setDate={setEventStartDate} />
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <div>
                                        <label className="text-xs">End time:</label>
                                        <DateTimePicker24h date={eventEndDate} setDate={setEventEndDate} />
                                    </div>
                                </div>
                                <Button className="w-full mt-4" onClick={() => setEventTimes(selectedEvent, eventStartDate?.toISOString() || "", eventEndDate?.toISOString() || "")}>Save</Button>
                            </div>}
                        </div>


                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}