import winuLogo from "../assets/logo_black.png";

export default function Loader() {
    return (
        <div className="flex flex-col items-center p-3 animate-pulse">
            <img src={winuLogo} alt="WinU Logo" className="max-w-36" />
            <h1 className="font-bold">Daten werden geladen...</h1>
        </div>
    );
}
