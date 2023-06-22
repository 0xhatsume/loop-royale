import { useComponentValue } from "@latticexyz/react";
import { SyncState } from "@latticexyz/network";
import { useMUD } from "./MUDContext";
import { GameBoard } from "./GameBoard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home/Home";
import GameRoom from "./pages/GameRoom/GameRoom";

export const App = () => {
  const {
    components: { LoadingState },
    network: { singletonEntity },
  } = useMUD();

  const loadingState = useComponentValue(LoadingState, singletonEntity, {
    state: SyncState.CONNECTING,
    msg: "Connecting",
    percentage: 0,
  });

  return (
    <div className="w-full h-screen bg-[#1C140F] flex flex-col">
      <NavBar />
      {
        loadingState.state !== SyncState.LIVE ? (
        <div>
          {loadingState.msg} ({Math.floor(loadingState.percentage)}%)
        </div>
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/game/:id" element={<GameRoom />} />
            <Route path="/demo" element={<GameBoard />} />
          </Routes>
        </Router>
        
      )}
    </div>
  );
};
