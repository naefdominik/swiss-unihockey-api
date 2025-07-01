import { useParams } from "react-router";
import {useEffect, useState} from "react";
import Error from "../components/Error.jsx";
import Loader from "../components/Loader.jsx";

export default function PastClubGames() {
    const { clubId, season } = useParams();

    const [games, setGames] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const url = `https://api-v2.swissunihockey.ch/api/games?locale=de_CH&season=${season}&club_id=${clubId}&view=full&mode=club&order=natural&direction=asc`;
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                const today = new Date();
                const rows = data.data.regions[0].rows;
                const future = rows
                    .filter(row => {
                        const [d, m, y] = row.cells[0].text[0].split(".").map(Number);
                        const date = new Date(y, m - 1, d);
                        return date < today;
                    })
                    .slice(-6);
                setGames(future);
            })
            .catch(err => setError(err.message));
    }, [clubId, season]);

    if (error) return <Error error={error}/>;
    if (!games.length) return <Loader />;

    return (
        <div className="flex flex-col gap-3">
            {games.map((row, i) => {
                let scoreText = row.cells[5].text.join(" ") || "vs";
                let scoreColor = "white";
                if (scoreText.includes(":")) {
                    const [homeGoals, guestGoals] = scoreText.split(" ")[0].split(":").map(Number);
                    const home = row.cells[3].text;
                    const guest = row.cells[4].text;
                    const isWWUHome = /^UHC Winterthur United/.test(home);
                    const isWWUGuest = /^UHC Winterthur United/.test(guest);
                    const won = (isWWUHome && homeGoals > guestGoals) || (isWWUGuest && guestGoals > homeGoals);
                    scoreColor = won ? "#00aa84" : "#aa0026";
                }

                return (
                    <div key={i} className="flex gap-10 px-4 py-3 rounded-lg text-white bg-black">
                        <div className="flex-1">
                            <p className="font-bold">{row.cells[2].text.join(", ")}</p>
                            <p>{row.cells[0].text[0]}, {row.cells[0].text[1]}</p>
                            <p>{row.cells[1].text.at(-1)}</p>
                        </div>
                        <div className="flex-2 flex items-center justify-between gap-10">
                            <div className="flex-1 text-right">{row.cells[3].text}</div>
                            <div className="flex-none text-center" style={{
                                color: scoreColor,
                            }}>
                                <strong>{scoreText}</strong>
                            </div>
                            <div className="flex-1 text-left">{row.cells[4].text}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}