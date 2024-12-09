import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function App() {
  const [messageList, setMessageList] = useState<string[]>([]);
  const webSocket = useRef<Socket | null>(null);

  function appendMessage(message: string) {
    setMessageList((prev) => [...prev, message]);
  }

  useEffect(() => {
    const socket = io("ws://localhost:3000", {
      retries: 3,
      transports: ["websocket"],
      port: 3000,
    });
    webSocket.current = socket;

    webSocket.current.on("message", (data) => {
      appendMessage(data);
    });

    webSocket.current.on("connect", () => {
      appendMessage("Hello world!");
    });

    return () => {
      webSocket.current?.disconnect();
      webSocket.current = null;
    };
  }, []);

  return (
    <div>
      <ul>
        {messageList.map((message) => (
          <li>{message}</li>
        ))}
      </ul>
    </div>
  );
}
