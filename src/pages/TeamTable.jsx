import { useParams } from "react-router";
import { useEffect, useState } from "react";
import Error from "../components/Error.jsx";
import Loader from "../components/Loader.jsx";

// Höhe (Pixel) in FairGate = 400
// Link: https://swiss-unihockey-api.vercel.app/team-table/league/a/game_class/b/group/Gruppe+c/season/d
export default function TeamTable() {
    const {
        league,     // https://api-v2.swissunihockey.ch/api/leagues 
        gameClass,  // https://api-v2.swissunihockey.ch/api/leagues
        group,      // e.g. "Gruppe+9" auf myapp.swissunihockey.ch herausfinden
        season      // e.g. "2025"
    } = useParams();

    const [regions, setRegions] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [error, setError] = useState(null);

    const showColumn = (idx) => {
        return [0, 1, 2, headers.length - 1].includes(idx);
    }

    useEffect(() => {
        const url = `https://api-v2.swissunihockey.ch/api/rankings?locale=de_CH&season=${season}&league=${league}&game_class=${gameClass}&view=full&group=${group}`;
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error("Fehler beim Laden der Tabelle");
                return res.json();
            })
            .then(data => {
                setHeaders(data.data.headers);
                setRegions(data.data.regions);
            })
            .catch(err => setError(err.message));
    }, [season, league, gameClass, group]);

    if (error) return <Error error={error}/>;
    if (!regions.length) return <Loader />;

    return (
        <div className="space-y-6">
            {regions.map((region, regionIdx) => (
                <div key={regionIdx}>
                    {region.text && (
                        <h2 className="text-xl font-bold mb-1">{region.text}</h2>
                    )}
                    
                    <table className="w-full">
                        <thead className="bg-[#222222] text-white">
                            <tr>
                                {headers.map((header, idx) => (
                                    <th key={idx} className={`text-left px-3 py-2 ${showColumn(idx) ? '' : 'hidden sm:table-cell'}`}>
                                        {header.text}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {region.rows.map((row, i) => (
                                <tr key={i} className={row.data.team.name.startsWith("UHC Winterthur United") ? 'font-bold text-[#E3000B] bg-[#FFF5F5]' : ''}>
                                    {row.cells.map((cell, idx) => (
                                        <td key={idx} className={`px-3 py-2 ${showColumn(idx) ? '' : 'hidden sm:table-cell'}`}>
                                            {cell.image ? (
                                                <img src={cell.image.url} alt={cell.image.alt || ''} className="h-6" />
                                            ) : null}
                                            {cell.text ? cell.text.join(" ") : null}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}