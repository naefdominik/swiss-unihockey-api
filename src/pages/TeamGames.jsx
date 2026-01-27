import { useParams } from "react-router";
import {useEffect, useState} from "react";
import Error from "../components/Error.jsx";
import Loader from "../components/Loader.jsx";

// Höhe (Pixel) in FairGate = 1111
// Link: https://swiss-unihockey-api.vercel.app/team-games/league/a/game_class/b/group/Gruppe+c/team_id/d/season/e
export default function TeamGames() {
    const {
        league,     // https://api-v2.swissunihockey.ch/api/leagues
        gameClass,  // https://api-v2.swissunihockey.ch/api/leagues
        group,      // e.g. "Gruppe+9" auf myapp.swissunihockey.ch herausfinden
        teamId,     // https://api-v2.swissunihockey.ch/api/teams?mode=by_club&club_id=444&season=2025
        season      // e.g. 2025
    } = useParams();

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
                if (rankingData?.data?.regions?.[0]?.rows) {
                    rankingData.data.regions[0].rows.forEach(row => {
                        const name = row.data?.team?.name;
                        const imageCell = row.cells?.find(cell => cell.image);
                        if (name && imageCell?.image?.url) {
                            logoMap.set(name, imageCell.image.url);
                        }
                    });
                }

                setImages(logoMap);
                setGames(gamesData.data.regions[0].rows);
            } catch (e) {
                setError(e.message);
            }
        }
        fetchData();
    }, [season, teamId, league, gameClass, group]);

    if (error) return <Error error={error}/>;
    if (!games.length) return <Loader />;

    return (
        <div className="flex flex-col gap-3">
            {games.map((row, i) => {
                const rawDate = row.cells[0].text[0];
                const [d, m, y] = rawDate.split(".").map(Number);
                const date = new Date(y, m - 1, d);
                const isToday = new Date().toDateString() === date.toDateString() || rawDate.toLowerCase() === "heute";

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
                    const isDraw = homeGoals === guestGoals;
                    const won = (isWWUHome && homeGoals > guestGoals) || (isWWUGuest && guestGoals > homeGoals);

                    if (!isDraw) scoreColor = won ? "#00aa84" : "#FA0707";
                }

                return (
                    <div key={i} className="flex flex-wrap max-[460px]:flex-col gap-x-5 gap-y-1 px-8 py-5 text-white" style={{
                        backgroundColor: isToday ? "#393a3d" : "#222222",
                    }}>
                        <div className="flex-1 flex flex-col justify-center">
                            <p className="font-bold">{row.cells[0].text[0]}, {row.cells[0].text[1]}</p>
                            <p>{row.cells[1].text.at(-1)}</p>
                        </div>
                        <div className="flex-2 flex items-center justify-center gap-10">
                            <div className="w-20">
                                {logoHome
                                    ? <img src={logoHome} alt={home} className="w-full ml-auto" />
                                    : <div className="inline-block bg-white text-black px-3 font-bold text-center">{home}</div>
                                }
                            </div>
                            <div className="min-w-35 text-center text-3xl font-bold" style={{
                                color: scoreColor,
                                fontFamily: "SupremeLLTT"
                            }}>
                                <strong>{scoreText}</strong>
                            </div>
                            <div className="w-20">
                                {logoGuest
                                    ? <img src={logoGuest} alt={guest} className="w-full" />
                                    : <div className="inline-block bg-white text-black px-3 font-bold text-center">{guest}</div>
                                }
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}