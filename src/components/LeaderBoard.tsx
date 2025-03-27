'use client';
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface Team {
    id: string;
    name: string;
    teamColor: string;
    points: number
}

interface LeaderBoardProps {
    teams: Team[];
    setTeams: any;
    teamName: string;
    events: any[];
    selectedEvent: string;
    setSelectedEvent: any;
}

export default function LeaderBoard(props: LeaderBoardProps) {
    const [sortedTeams, setSortedTeams] = useState<Team[]>([]);
    const [collapsed, setCollapsed] = useState<boolean>(false);

    useEffect(() => {
        setSortedTeams([...props.teams].sort((a, b) => b.points - a.points));
    }, [props.teams]);

    return (
        <div className={` ${collapsed ? 'w-1/7' : 'w-3/5'} bg-white ${collapsed ? 'p-0' : 'p-4'} ${collapsed ? 'rounded-full' : 'rounded-lg'} shadow-lg absolute bottom-0 left-0 mb-2 ml-2 z-10 ${collapsed ? 'h-1/15' : 'h-1/4'} overflow-hidden`}>
            <div className={`flex ${collapsed ? 'justify-center' : 'justify-between'} items-center ${collapsed ? 'h-full' : ''}`}>
                {!collapsed && <h3>Leaderboard</h3>}
                <Button variant={"ghost"} onClick={() => setCollapsed(!collapsed)}>
                    {!collapsed ? <FontAwesomeIcon icon={faMinus} /> : <FontAwesomeIcon icon={faPlus} />}
                </Button>
            </div>

            {
                !collapsed && props.teams.length > 0 && (
                    <div className="overflow-auto max-h-full pb-5">
                        <Table className="w-2/3 overflow-auto max-h-96">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Team</TableHead>
                                    <TableHead>Points</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedTeams.map((team) => (
                                    <TableRow key={team.id}>
                                        <TableCell>{sortedTeams.indexOf(team) + 1}</TableCell>
                                        <TableCell>{team.name}</TableCell>
                                        <TableCell>{team.points ? team.points : 0}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )
            }
        </div >
    );
}