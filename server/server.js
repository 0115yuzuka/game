const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 8080 });

const clients = new Map();

server.on("connection", (ws) => {
  console.log("新しいクライアントが接続しました");

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    // クライアントの種類を識別して保存
    if (data.type === "register") {
      clients.set(ws, data.clientType);
    }

    // スマホからの動きデータをPCに転送
    if (data.type === "movement" && clients.get(ws) === "mobile") {
      server.clients.forEach((client) => {
        if (clients.get(client) === "pc") {
          client.send(JSON.stringify(data));
        }
      });
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
    console.log("クライアントが切断しました");
  });
});
