export let webSocket: WebSocket | null;

export const open = (sessionCode: string, playerName: string) =>
  new Promise<void>((resolve, reject) => {
    const url = new URL('/', 'ws://localhost:8080');

    url.searchParams.append('session_code', sessionCode);
    url.searchParams.append('player_name', playerName);

    if (isOpened() && webSocket?.url === url.toString()) {
      return resolve();
    }

    webSocket = new WebSocket(url);

    webSocket.onclose = reject;
    webSocket.onerror = reject;
    webSocket.onopen = () => resolve();
  });

export const isOpened = () => Boolean(webSocket) && webSocket?.readyState === WebSocket.OPEN;

export const close = () => {
  if (webSocket) {
    webSocket.close();
  }

  webSocket = null;
};
