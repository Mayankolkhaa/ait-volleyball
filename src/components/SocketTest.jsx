import { useEffect, useState } from "react";
import socket from "../services/socket";

const SocketTest = () => {
  const [connected, setConnected] = useState(socket.connected);
  const [score, setScore] = useState(null);

  useEffect(() => {
    const onConnect = () => {
      setConnected(true);
    };

    const onDisconnect = () => {
      setConnected(false);
    };

    const onScoreUpdate = (match) => {
      console.log("React received score:", match);
      setScore(match);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("scoreUpdated", onScoreUpdate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("scoreUpdated", onScoreUpdate);
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-[9999] rounded-xl bg-white p-5 shadow-xl">
      <div>
        Socket:
        <span className={connected ? "text-green-600" : "text-red-600"}>
          {connected ? " Connected" : " Disconnected"}
        </span>
      </div>

      {score && (
        <div className="mt-3 border-t pt-3">
          <div className="text-xl font-bold">
            AIT {score.aitPoints} - {score.opponentPoints}{" "}
            {score.opponent}
          </div>

          <div className="text-sm text-gray-500">
            Set {score.currentSet}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocketTest;