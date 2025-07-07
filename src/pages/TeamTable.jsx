import { useParams } from "react-router";
import {useEffect, useState} from "react";
import Error from "../components/Error.jsx";
import Loader from "../components/Loader.jsx";

export default function TeamTable() {
    const { league, gameClass, group, season } = useParams(); // response von irgendeinem funktionierenden Call untersuchen, um Parameter für neue Teams zu finden

    const [rows, setRows] = useState([]);
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
                setRows(data.data.regions[0].rows);
            })
            .catch(err => setError(err.message));
    }, [season, league, gameClass, group]);

    if (error) return <Error error={error}/>;
    if (!rows.length) return <Loader />;

    return (
        <div>
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
                {rows.map((row, i) => (
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
    );
}