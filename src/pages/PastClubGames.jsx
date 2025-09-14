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
                        const rawDate = row.cells[0].text[0];
                        if (rawDate.toLowerCase() === "gestern") return true;

                        const [d, m, y] = rawDate.split(".").map(Number);
                        const date = new Date(y, m - 1, d);
                        return date < today;
                    })
                    .slice(-6)
                    .reverse();
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

                const home = row.cells[3].text;
                const guest = row.cells[4].text;

                const isWWUHome = /^UHC Winterthur United/.test(home);
                const isWWUGuest = /^UHC Winterthur United/.test(guest);
                const opponent = isWWUHome ? guest : home;

                if (scoreText.includes(":")) {
                    const [homeGoals, guestGoals] = scoreText.split(" ")[0].split(":").map(Number);
                    const won = (isWWUHome && homeGoals > guestGoals) || (isWWUGuest && guestGoals > homeGoals);
                    scoreColor = won ? "#00AA84" : "#FA0707";
                }

                return (
                    <div key={i} className="flex flex-wrap gap-10 px-8 py-5 text-white bg-[#222222]">
                        <div className="flex-1 flex flex-col justify-center">
                            <p className="font-bold">{row.cells[2].text.join(", ")}</p>
                            <p>{row.cells[0].text[0]} in {row.cells[1].text.at(-1)}</p>
                        </div>
                        <div className="flex-2 flex flex-col items-center justify-center gap-1">
                            <div className="text-3xl font-bold" style={{
                                color: scoreColor,
                                fontFamily: "SupremeLLTT"
                            }}>
                                <strong>{scoreText}</strong>
                            </div>
                            <div className="bg-white text-black px-3 font-bold text-center">vs. {opponent}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}