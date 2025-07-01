import { useParams } from "react-router";
import {useEffect, useState} from "react";
import Error from "../components/Error.jsx";
import Loader from "../components/Loader.jsx";

export default function TeamGames() {
    const { league, gameClass, group, teamId, season } = useParams();

    const [games, setGames] = useState([]);
    const [images, setImages] = useState(new Map());
    const [error, setError] = useState(null);

    useEffect(() => {
        const rankingsUrl = `https://api-v2.swissunihockey.ch/api/rankings?locale=de_CH&season=${season}&league=${league}&game_class=${gameClass}&view=full&group=${group}`;
        const gamesUrl = `https://api-v2.swissunihockey.ch/api/games?locale=de_CH&mode=team&season=${season}&team_id=${teamId}`;

        async function fetchData() {
            try {
                const [rankingRes, gamesRes] = await Promise.all([fetch(rankingsUrl), fetch(gamesUrl)]);
                if (!rankingRes.ok || !gamesRes.ok) throw new Error("Fehler beim Laden der Daten");
                const rankingData = await rankingRes.json();
                const gamesData = await gamesRes.json();

                const logoMap = new Map();
                rankingData.data.regions[0].rows.forEach(row => {
                    const name = row.data.team.name;
                    const imageCell = row.cells.find(cell => cell.image);
                    if (imageCell?.image?.url) {
                        logoMap.set(name, imageCell.image.url);
                    }
                });
                setImages(logoMap);
                setGames(gamesData.data.regions[0].rows);
            } catch (e) {
                setError(e.message);
            }
        }
        fetchData();
    }, [season, teamId]);

    if (error) return <Error error={error}/>;
    if (!games.length) return <Loader />;

    return (
        <div className="flex flex-col gap-3">
            {games.map((row, i) => {
                const [d, m, y] = row.cells[0].text[0].split(".").map(Number);
                const date = new Date(y, m - 1, d);
                const isToday = new Date().toDateString() === date.toDateString();

                const home = row.cells[2].text[0];
                const guest = row.cells[3].text[0];
                const logoHome = images.get(home);
                const logoGuest = images.get(guest);

                let scoreText = row.cells[4]?.text.join(" ") || "vs";
                let scoreColor = "white";
                if (scoreText.includes(":")) {
                    const [homeGoals, guestGoals] = scoreText.split(" ")[0].split(":").map(Number);
                    const isWWUHome = home.startsWith("UHC Winterthur United");
                    const isWWUGuest = guest.startsWith("UHC Winterthur United");
                    const won = (isWWUHome && homeGoals > guestGoals) || (isWWUGuest && guestGoals > homeGoals);
                    scoreColor = won ? "#00aa84" : "#aa0026";
                }

                return (
                    <div key={i} className="flex gap-10 px-4 py-3 rounded-lg text-white" style={{
                        backgroundColor: isToday ? "#393a3d" : "black",
                    }}>
                        <div className="flex-1 flex flex-col justify-center">
                            <p className="font-bold">{row.cells[0].text[0]}, {row.cells[0].text[1]}</p>
                            <p>{row.cells[1].text.at(-1)}</p>
                        </div>
                        <div className="flex-2 flex items-center justify-between gap-10">
                            <div className="flex-1 text-right">
                                {logoHome
                                    ? <img src={logoHome} alt={home} className="w-16 ml-auto" />
                                    : <span>{home}</span>
                                }
                            </div>
                            <div className="flex-none text-center" style={{
                                color: scoreColor
                            }}>
                                <strong>{scoreText}</strong>
                            </div>
                            <div className="flex-1 text-left">
                                {logoGuest
                                    ? <img src={logoGuest} alt={guest} className="w-16" />
                                    : <span>{guest}</span>
                                }
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}