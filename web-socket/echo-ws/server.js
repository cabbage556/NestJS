const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 3000 });

// 'connection': 클라이언트 서버 접속 이벤트
server.on("connection", (ws) => {
  // 클라이언트의 서버 접속 이벤트 핸들러

  // 클라이언트 접속 시 클라이언트에게 메시지 전송
  ws.send("[서버 접속!]");

  // 'message': 메시지 수신 이벤트
  ws.on("message", (message) => {
    // 클라이언트 메시지를 수신한 경우의 이벤트 핸들러
    ws.send(`서버의 응답: ${message}`);
  });

  // 'close': 클라이언트 접속 종료 이벤트
  ws.on("close", () => {
    // 클라이언트 접속 종료 이벤트 핸들러
    console.log("클라이언트 접속 해제");
  });
});
