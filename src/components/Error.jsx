import winuLogo from "../assets/logo_positive.png";

export default function Error({ error }) {
    return (
        <div className="flex flex-col items-center p-3">
            <img src={winuLogo} alt="WinU Logo" className="max-w-36" />
            <h1 className="font-bold">Fehler beim Laden der Daten</h1>
            <p className="text-[#E3000B]">{error}</p>
        </div>
    );
}
