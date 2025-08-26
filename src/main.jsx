import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter, Route, Routes} from "react-router";
import TeamTable from "./pages/TeamTable.jsx";
import TeamGames from "./pages/TeamGames.jsx";
import FutureClubGames from "./pages/FutureClubGames.jsx";
import PastClubGames from "./pages/PastClubGames.jsx";
import Home from "./pages/Home.jsx";
import { Analytics } from "@vercel/analytics/react"

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/club-games-past/club_id/:clubId/season/:season" element={<PastClubGames />} />
              <Route path="/club-games-future/club_id/:clubId/season/:season" element={<FutureClubGames />} />
              <Route path="/team-games/league/:league/game_class/:gameClass/group/:group/team_id/:teamId/season/:season" element={<TeamGames />} />
              <Route path="/team-table/league/:league/game_class/:gameClass/group/:group/season/:season" element={<TeamTable />} />
              <Route path="*" element={<App />} />
          </Routes>
      </BrowserRouter>
      <Analytics />
  </StrictMode>,
)
