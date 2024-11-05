export let webSocket: WebSocket | null;

export const connect = (sessionCode: string) =>
  new Promise<void>((resolve, reject) => {
    webSocket = new WebSocket(`http://localhost:8080?session_code=${sessionCode}`);

    webSocket.onclose = reject;
    webSocket.onerror = reject;
    webSocket.onopen = () => resolve();
  });

export const disconnect = () => {
  if (webSocket) {
    webSocket.close();
  }

  webSocket = null;
};
