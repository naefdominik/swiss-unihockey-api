import { useParams } from "react-router";
import {useEffect, useState} from "react";
import Error from "../components/Error.jsx";
import Loader from "../components/Loader.jsx";
import winuLogo from "../assets/logo_white.png";

export default function FutureClubGames() {
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
                        return date >= today;
                    })
                    .slice(0, 6);
                setGames(future);
            })
            .catch(err => setError(err.message));
    }, [clubId, season]);

    if (error) return <Error error={error}/>;
    if (!games.length) return <Loader />;

    return (
        <div className="flex flex-col gap-3">
            {games.map((row, i) => {
                const [d, m, y] = row.cells[0].text[0].split(".").map(Number);
                const date = new Date(y, m - 1, d);
                const isToday = new Date().toDateString() === date.toDateString();

                return (
                    <div key={i} className="flex flex-wrap gap-10 px-8 py-5 text-white" style={{
                        backgroundColor: isToday ? "#393a3d" : "#222222",
                    }}>
                        <div className="flex-1">
                            <p className="font-bold">{row.cells[2].text.join(", ")}</p>
                            <p>{row.cells[0].text[0]}, {row.cells[0].text[1]}</p>
                            <p>{row.cells[1].text.at(-1)}</p>
                        </div>
                        <div className="flex-2 flex items-center juxstify-between gap-10">
                            <div className="flex-1 text-right min-w-18">
                                {/^UHC Winterthur United/.test(row.cells[3].text)
                                    ? <img src={winuLogo} alt="UHC Winterthur United" className="w-18 inline-block" />
                                    : <div className="inline-block bg-white text-black px-3 font-bold text-center">{row.cells[3].text}</div>
                                }
                            </div>
                            <div className="flex-none text-center text-3xl font-bold" style={{ fontFamily: "SupremeLLTT" }}>
                                <strong>{row.cells[5].text[0] || "vs."}</strong>
                            </div>
                            <div className="flex-1 text-left min-w-18">
                                {/^UHC Winterthur United/.test(row.cells[4].text)
                                    ? <img src={winuLogo} alt="UHC Winterthur United" className="w-18 inline-block" />
                                    : <div className="inline-block bg-white text-black px-3 font-bold text-center">{row.cells[4].text}</div>
                                }
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}
