import winuLogo from './assets/logo_positive.png'

export default function App() {

  return (
      <div className="flex flex-col gap-3 p-10">
          <img src={winuLogo} alt="WinU Logo" className="max-w-36" />
          <div>
              <h1 className="font-bold">Willkommen</h1>
              <p>Diese Webseite stellt die Daten von SwissUnihockey für die WinU Website bereit.</p>
              <p className="pt-3">Folgende Anzeigen sind verfügbar:</p>
              <ul className="pt-1 list-disc list-inside">
                  <li><a href="/club-games-past/club_id/444/season/2025" className="text-[#E3000B]">Vergangene Club Spiele</a> - Zeigt vergangene Spiele eines Clubs an.</li>
                  <li><a href="/club-games-future/club_id/444/season/2025" className="text-[#E3000B]">Zukünftige Club Spiele</a> - Zeigt zukünftige Spiele eines Clubs an.</li>
                  <li><a href="/team-games/league/4/game_class/11/group/Gruppe+4/team_id/409379/season/2024" className="text-[#E3000B]">Team Spiele</a> - Zeigt Spiele eines Teams in einer Saison an.</li>
                  <li><a href="/team-table/league/4/game_class/11/group/Gruppe+4/season/2024" className="text-[#E3000B]">Team Tabelle</a> - Zeigt die Tabelle eines Teams in einer Liga an.</li>
              </ul>
              <p className="pt-3">Die Links sind nur Beispiele und können durch die entsprechenden IDs und Saisons in der URL angepasst werden.</p>
          </div>
      </div>
  )
}
