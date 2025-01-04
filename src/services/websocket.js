import { Client } from "@stomp/stompjs";

export const connectWebSocket = (onMessageReceived) => {
  const client = new Client({
    brokerURL: "ws://localhost:8080/ws", // WebSocket URL
    onConnect: () => {
      client.subscribe("/topic/statistiky", (message) => {
        const data = JSON.parse(message.body);
        onMessageReceived(data);
      });
    },
    debug: (str) => console.log(str),
  });
  client.activate();
};
